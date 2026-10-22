import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  buildSystemMap,
  backbonePoint,
  mulberry32,
  GOLD,
  CYAN,
  SECTION_COUNT,
  type SystemMapData,
} from './systemMap';
import { scrollStore, toNodeInfo } from './scrollStore';
import { EXHIBITION_PROJECTS } from '../../data/universeData';
import { type Theme } from '../../theme';

interface SystemMapSceneProps {
  reducedMotion: boolean;
  lite: boolean;
  theme: Theme;
}

const BASE_FOV = 48;
const TRACE_COUNT = 6;
const TRACE_LEAD = 0.22; // how far ahead of the camera the request packet travels, in sections
// Beyond this many sections from the camera a cluster is out of sight and out of reach, so
// its nodes and edges are left alone. Edges are fully dimmed by 1.2 sections out.
const NEAR_NODES = 2;
const NEAR_EDGES = 1.3;

// Dark mode glows: additive blending, colours dimmed toward black. Light mode can't glow on a
// pale background, so it uses opaque blending with deeper colours faded toward the background.
interface Palette {
  bgHex: string;
  bg: THREE.Color;
  gold: THREE.Color;
  cyan: THREE.Color;
  trace: THREE.Color;
  starColor: string;
  starOpacity: number;
  wireOpacity: number;
  /** Resting brightness of an inactive node (0..1) */
  dim: number;
  additive: boolean;
  fog: number;
}
const PALETTES: Record<Theme, Palette> = {
  dark: {
    bgHex: '#07080b',
    bg: new THREE.Color('#07080b'),
    gold: GOLD,
    cyan: CYAN,
    trace: new THREE.Color('#fff1c1'),
    starColor: '#9fb6d6',
    starOpacity: 0.65,
    wireOpacity: 0.55,
    dim: 0.22,
    additive: true,
    fog: 0.011,
  },
  light: {
    bgHex: '#eef1f6',
    bg: new THREE.Color('#eef1f6'),
    gold: new THREE.Color('#a87a12'),
    cyan: new THREE.Color('#0284c7'),
    trace: new THREE.Color('#b45309'),
    starColor: '#64748b',
    starOpacity: 0.3,
    wireOpacity: 0.75,
    dim: 0.34,
    additive: false,
    fog: 0.006,
  },
};
const PROJECT_COUNT = EXHIBITION_PROJECTS.length;

const smoothstep = (x: number) => x * x * (3 - 2 * x);
// How "lit" a cluster is, given how far the camera currently is from its section
const activity = (cluster: number, f: number) =>
  smoothstep(Math.max(0, 1 - Math.abs(f - cluster) * 0.85));

// Instance matrices are written straight into the buffer: a uniform scale plus translation
// (optionally a spin about X then Y), without going through Object3D/Euler/Quaternion.
function writeMatrix(a: Float32Array, i: number, x: number, y: number, z: number, s: number) {
  const o = i * 16;
  a[o] = s;
  a[o + 1] = 0;
  a[o + 2] = 0;
  a[o + 3] = 0;
  a[o + 4] = 0;
  a[o + 5] = s;
  a[o + 6] = 0;
  a[o + 7] = 0;
  a[o + 8] = 0;
  a[o + 9] = 0;
  a[o + 10] = s;
  a[o + 11] = 0;
  a[o + 12] = x;
  a[o + 13] = y;
  a[o + 14] = z;
  a[o + 15] = 1;
}

function writeSpinMatrix(
  a: Float32Array,
  i: number,
  x: number,
  y: number,
  z: number,
  s: number,
  cx: number,
  sx: number,
  cy: number,
  sy: number
) {
  // R = Rx(ax) * Ry(ay), column-major
  const o = i * 16;
  a[o] = cy * s;
  a[o + 1] = sx * sy * s;
  a[o + 2] = -cx * sy * s;
  a[o + 3] = 0;
  a[o + 4] = 0;
  a[o + 5] = cx * s;
  a[o + 6] = sx * s;
  a[o + 7] = 0;
  a[o + 8] = sy * s;
  a[o + 9] = -sx * cy * s;
  a[o + 10] = cx * cy * s;
  a[o + 11] = 0;
  a[o + 12] = x;
  a[o + 13] = y;
  a[o + 14] = z;
  a[o + 15] = 1;
}

interface Sim {
  data: SystemMapData;
  packets: { edge: Int32Array; u: Float32Array; speed: Float32Array };
  /** Edge indices belonging to each project's architecture */
  archEdges: number[][];
  rand: () => number;
  /** Live node positions (architecture nodes move as they unfold) */
  live: THREE.Vector3[];
  unfold: Float32Array;
  /** Eased unfold per project */
  ufe: Float32Array;
  /** Whether a project's architecture is moving or open, so its nodes/edges need updating */
  archActive: Uint8Array;
  dist: Float32Array;
  /** Camera distance per node */
  depth: Float32Array;
  screen: Float32Array;
  alpha: Float32Array;
  /** cos/sin of each node's spin phase offset, so no trig runs per node per frame */
  phaseCos: Float32Array;
  phaseSin: Float32Array;
  hover: number;
  color: THREE.Color;
  look: THREE.Vector3;
  pos: THREE.Vector3;
  tmp: THREE.Vector3;
  smooth: number;
  parX: number;
  parY: number;
  fov: number;
  ready: boolean;
  /** Theme the buffers were last fully written for; a change forces a full rewrite */
  theme: Theme | null;
}

function createSim(data: SystemMapData, packetCount: number): Sim {
  const rand = mulberry32(23);
  const { edges, nodes } = data;
  const archEdges: number[][] = Array.from({ length: PROJECT_COUNT }, () => []);
  edges.forEach((e, i) => {
    if (e.projectIndex >= 0) archEdges[e.projectIndex].push(i);
  });
  const sim: Sim = {
    data,
    packets: {
      edge: Int32Array.from({ length: packetCount }, () => Math.floor(rand() * edges.length)),
      u: Float32Array.from({ length: packetCount }, rand),
      speed: Float32Array.from({ length: packetCount }, () => 2.2 + rand() * 2.4),
    },
    archEdges,
    rand,
    live: nodes.map((n) => n.position.clone()),
    unfold: new Float32Array(PROJECT_COUNT),
    ufe: new Float32Array(PROJECT_COUNT),
    archActive: new Uint8Array(PROJECT_COUNT),
    dist: new Float32Array(nodes.length),
    depth: new Float32Array(nodes.length),
    screen: new Float32Array(nodes.length * 4),
    alpha: new Float32Array(nodes.length),
    phaseCos: Float32Array.from(nodes, (_, i) => Math.cos(i)),
    phaseSin: Float32Array.from(nodes, (_, i) => Math.sin(i)),
    hover: -1,
    color: new THREE.Color(),
    look: new THREE.Vector3(),
    pos: new THREE.Vector3(),
    tmp: new THREE.Vector3(),
    smooth: 0,
    parX: 0,
    parY: 0,
    fov: BASE_FOV,
    ready: false,
    theme: null,
  };
  // Hand the overlay (labels, tooltip) everything it needs to read each frame
  scrollStore.nodeInfo = nodes.map(toNodeInfo);
  scrollStore.nodeScreen = sim.screen;
  scrollStore.labelAlpha = sim.alpha;
  scrollStore.labelNodes = nodes.map((n, i) => (n.label ? i : -1)).filter((i) => i >= 0);
  return sim;
}

export function SystemMapScene({ reducedMotion, lite, theme }: SystemMapSceneProps) {
  const pal = PALETTES[theme];
  const blending = pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
  const size = useThree((s) => s.size);
  const portrait = size.width / size.height < 1;
  const data = useMemo(() => buildSystemMap({ portrait }), [portrait]);
  const { nodes, edges, waypoints, hubs } = data;

  const curve = useMemo(() => new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5), [waypoints]);

  const solidRef = useRef<THREE.InstancedMesh>(null);
  const wireRef = useRef<THREE.InstancedMesh>(null);
  const packetRef = useRef<THREE.InstancedMesh>(null);
  const traceRef = useRef<THREE.InstancedMesh>(null);
  const edgePosRef = useRef<THREE.BufferAttribute>(null);
  const edgeColorRef = useRef<THREE.BufferAttribute>(null);
  const coreShellRef = useRef<THREE.Mesh>(null);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Static edges are positioned once here; only unfolding architecture links move afterwards
  const edgePosInit = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => arr.set([e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z], i * 6));
    return arr;
  }, [edges]);
  const edgeColorInit = useMemo(() => new Float32Array(edges.length * 6), [edges]);

  const stars = useMemo(() => {
    const rand = mulberry32(11);
    const count = lite ? 450 : 900;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 90;
      arr[i * 3 + 1] = (rand() - 0.5) * 56;
      arr[i * 3 + 2] = 20 - rand() * 215;
    }
    return arr;
  }, [lite]);

  const packetCount = lite ? 50 : 110;

  // Per-frame simulation state lives in a ref: created lazily, rebuilt when the map changes
  const simRef = useRef<Sim | null>(null);

  useFrame((state, rawDelta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(rawDelta, 0.1);
    const t = state.clock.elapsedTime;
    if (!simRef.current || simRef.current.data !== data) {
      simRef.current = createSim(data, packetCount);
    }
    const s = simRef.current;
    const { packets, live } = s;
    // First frame, or the theme changed: rewrite everything, including parts normally skipped
    const full = s.theme !== theme;
    s.theme = theme;

    // Theme helpers: map a mesh colour to this theme, and fade it by `amount` (0 = invisible)
    const base = (c: THREE.Color) => (c === GOLD ? pal.gold : pal.cyan);
    const shade = (out: THREE.Color, from: THREE.Color, amount: number) =>
      pal.additive ? out.copy(from).multiplyScalar(amount) : out.copy(pal.bg).lerp(from, Math.min(1, amount));

    // --- Camera: follow smoothed scroll progress along the path ---
    const target = THREE.MathUtils.clamp(scrollStore.progress, 0, SECTION_COUNT - 1);
    if (!s.ready || t < 0.4 || reducedMotion) {
      s.smooth = target; // snap on load / deep links, and when motion is reduced
      s.ready = true;
    } else {
      s.smooth = THREE.MathUtils.damp(s.smooth, target, 3.4, dt);
    }
    const f = s.smooth;
    const u = f / SECTION_COUNT;
    curve.getPoint(u, s.pos);
    curve.getPoint(Math.min(1, u + 0.05), s.look);

    const px = reducedMotion ? 0 : scrollStore.pointerX * 0.45;
    const py = reducedMotion ? 0 : scrollStore.pointerY * 0.3;
    s.parX = THREE.MathUtils.damp(s.parX, px, 3, dt);
    s.parY = THREE.MathUtils.damp(s.parY, py, 3, dt);
    s.pos.x += s.parX;
    s.pos.y += s.parY;

    camera.position.copy(s.pos);
    camera.lookAt(s.look);

    // A touch of lens stretch while travelling quickly
    const speed = Math.abs(target - f);
    const fovTarget = BASE_FOV + Math.min(speed * 3, 7);
    s.fov = THREE.MathUtils.damp(s.fov, fovTarget, 4, dt);
    if (Math.abs(camera.fov - s.fov) > 0.02) {
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
    }
    camera.updateMatrixWorld();

    const motion = reducedMotion ? 0 : 1;
    const aspect = state.size.width / state.size.height;
    const showLabels = aspect >= 1;

    // --- Which project is unfolded: a hovered card, else a hovered node, else the open dossier ---
    const hoveredProject = s.hover >= 0 ? nodes[s.hover].projectIndex : -1;
    const focusProject =
      scrollStore.highlightProject >= 0
        ? scrollStore.highlightProject
        : hoveredProject >= 0
          ? hoveredProject
          : scrollStore.openProject;
    let unfolding = false;
    for (let p = 0; p < PROJECT_COUNT; p++) {
      const before = s.unfold[p];
      s.unfold[p] = THREE.MathUtils.damp(before, p === focusProject ? 1 : 0, 5, dt);
      s.ufe[p] = smoothstep(s.unfold[p]);
      const moving = Math.abs(s.unfold[p] - before) > 1e-5;
      // Keep updating for one frame after motion stops so the final position lands exactly
      s.archActive[p] = moving || s.unfold[p] > 0.0005 ? 1 : 0;
      if (moving) unfolding = true;
    }

    // Architecture nodes slide out of their project node as it unfolds
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.isArch && n.offset && (full || s.archActive[n.projectIndex])) {
        live[i].copy(n.position).addScaledVector(n.offset, s.ufe[n.projectIndex]);
      }
    }

    // --- Nodes: project to screen, find what the pointer is over, and update their instances ---
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const pointerOn = scrollStore.pointerActive;
    const domain = scrollStore.skillDomain;
    const solid = solidRef.current;
    const wire = wireRef.current;
    let best = -1;
    let bestScore = 1;
    if (solid && wire) {
      if (!solid.instanceColor) solid.setColorAt(0, s.color);
      if (!wire.instanceColor) wire.setColorAt(0, s.color);
      const solidM = solid.instanceMatrix.array as Float32Array;
      const wireM = wire.instanceMatrix.array as Float32Array;
      const solidC = solid.instanceColor!.array as Float32Array;
      const wireC = wire.instanceColor!.array as Float32Array;
      // Spin shared by every node; per-node phase is added via angle-sum identities
      const ca = Math.cos(t * 0.25 * motion);
      const sa = Math.sin(t * 0.25 * motion);
      const cy = Math.cos(t * 0.35 * motion);
      const sy = Math.sin(t * 0.35 * motion);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!full && Math.abs(f - n.cluster) > NEAR_NODES) {
          s.screen[i * 4 + 2] = 0;
          s.alpha[i] = 0;
          s.dist[i] = 99;
          continue;
        }
        const act = activity(n.cluster, f);
        const wp = live[i];

        s.tmp.copy(wp).project(camera);
        const onScreen = s.tmp.z < 1 && Math.abs(s.tmp.x) < 1.15 && Math.abs(s.tmp.y) < 1.15;
        s.screen[i * 4] = s.tmp.x;
        s.screen[i * 4 + 1] = s.tmp.y;
        s.screen[i * 4 + 2] = onScreen ? 1 : 0;
        const depth = camera.position.distanceTo(wp);
        s.depth[i] = depth;

        s.dist[i] = 99;
        if (pointerOn && onScreen) {
          const d = Math.hypot((s.tmp.x - scrollStore.pointerX) * aspect, s.tmp.y - scrollStore.pointerY);
          s.dist[i] = d;
          const interactive = n.isArch ? s.ufe[n.projectIndex] > 0.5 : act > 0.35;
          if (interactive) {
            const score = d / Math.max((n.size * 1.4) / (depth * tanHalf), 0.05);
            if (score < bestScore) {
              bestScore = score;
              best = i;
            }
          }
        }

        const prox = Math.max(0, 1 - s.dist[i] / 0.3);
        const hoverBoost = i === s.hover ? 0.6 : 0.3 * prox * prox;
        const pulse = Math.sin(t * 1.6 + i * 1.7) * 0.07 * motion;

        let sc: number;
        let lit: number;
        if (n.isArch) {
          const uf = s.ufe[n.projectIndex];
          sc = uf < 0.02 ? 0 : n.size * (1 + pulse) * (0.4 + 0.6 * uf) * 1.2;
          lit = Math.min(1, 0.55 + 0.45 * uf + hoverBoost);
        } else {
          const focusBoost = n.projectIndex >= 0 && n.projectIndex === focusProject ? 0.55 : 0;
          const domainMatch = domain && n.domains?.includes(domain) ? 0.5 : 0;
          sc = n.size * (0.7 + 0.5 * act + focusBoost + domainMatch * 0.5 + pulse + hoverBoost * 0.6);
          lit = Math.min(1, act + focusBoost + domainMatch + hoverBoost);
          // With a Skills tab selected, the rest of the stack recedes
          if (domain && n.domains && !n.domains.includes(domain)) lit *= 0.6;
        }

        // On-screen radius of the node's outer shell, in half-screen-heights, so labels can sit below it
        s.screen[i * 4 + 3] = (sc * 1.05) / (depth * tanHalf);

        writeMatrix(solidM, i, wp.x, wp.y, wp.z, sc * 0.5);
        // Spin phase: angle (t*0.25 + i) via cos/sin of a sum
        const cx = ca * s.phaseCos[i] - sa * s.phaseSin[i];
        const sx = sa * s.phaseCos[i] + ca * s.phaseSin[i];
        writeSpinMatrix(wireM, i, wp.x, wp.y, wp.z, sc * 1.05, cx, sx, cy, sy);

        shade(s.color, base(n.color), pal.dim + (1 - pal.dim) * lit);
        solidC[i * 3] = wireC[i * 3] = s.color.r;
        solidC[i * 3 + 1] = wireC[i * 3 + 1] = s.color.g;
        solidC[i * 3 + 2] = wireC[i * 3 + 2] = s.color.b;

        // Label opacity for the overlay
        let a = 0;
        if (showLabels && n.label && onScreen) {
          if (n.isArch) a = s.ufe[n.projectIndex] ** 2;
          else {
            a = act * act;
            if (domain && n.domains) a *= n.domains.includes(domain) ? 1 : 0.4;
          }
          if (i === s.hover) a = Math.max(a, 1);
        }
        s.alpha[i] = a;
      }
      solid.instanceMatrix.needsUpdate = true;
      wire.instanceMatrix.needsUpdate = true;
      solid.instanceColor!.needsUpdate = true;
      wire.instanceColor!.needsUpdate = true;
    }
    s.hover = best;
    scrollStore.hoverNode = best;

    // --- Edges: brightness follows the active cluster; only unfolding links ever move ---
    const ec = edgeColorRef.current;
    const ep = edgePosRef.current;
    if (ec && ep) {
      const edgeColors = ec.array as Float32Array;
      const edgePositions = ep.array as Float32Array;
      let colorsDirty = false;
      let positionsDirty = false;
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const isArch = e.projectIndex >= 0;
        if (!full) {
          if (isArch) {
            if (!s.archActive[e.projectIndex]) continue;
          } else if (e.cluster < 0 || Math.abs(f - e.cluster) > NEAR_EDGES) continue;
        }

        if (isArch) {
          const a = live[e.aNode];
          const b = live[e.bNode];
          edgePositions[i * 6] = a.x;
          edgePositions[i * 6 + 1] = a.y;
          edgePositions[i * 6 + 2] = a.z;
          edgePositions[i * 6 + 3] = b.x;
          edgePositions[i * 6 + 4] = b.y;
          edgePositions[i * 6 + 5] = b.z;
          positionsDirty = true;
        }

        let k: number;
        if (isArch) k = s.ufe[e.projectIndex] ** 1.5 * 0.55;
        else {
          const act = e.cluster < 0 ? 0.5 : activity(e.cluster, f);
          k = 0.12 + 0.5 * act;
        }
        if (s.hover >= 0 && (e.aNode === s.hover || e.bNode === s.hover)) k += 0.4;
        shade(s.color, base(e.color), pal.additive ? k : k * 1.3);
        edgeColors[i * 6] = edgeColors[i * 6 + 3] = s.color.r;
        edgeColors[i * 6 + 1] = edgeColors[i * 6 + 4] = s.color.g;
        edgeColors[i * 6 + 2] = edgeColors[i * 6 + 5] = s.color.b;
        colorsDirty = true;
      }
      if (positionsDirty) ep.needsUpdate = true;
      if (colorsDirty) ec.needsUpdate = true;
    }

    // --- Packets travelling along edges ---
    const pk = packetRef.current;
    if (pk) {
      if (!pk.instanceColor) pk.setColorAt(0, s.color);
      const pkM = pk.instanceMatrix.array as Float32Array;
      const pkC = pk.instanceColor!.array as Float32Array;
      const flow = reducedMotion ? 0.25 : 1;
      const focusArch = focusProject >= 0 && s.ufe[focusProject] > 0.5 ? s.archEdges[focusProject] : null;
      const sizeK = pal.additive ? 1 : 0.7;
      for (let i = 0; i < packetCount; i++) {
        let e = edges[packets.edge[i]];
        packets.u[i] += (packets.speed[i] * dt * flow) / Math.max(e.length, 0.001);
        if (packets.u[i] >= 1) {
          packets.u[i] = 0;
          let next = e.next;
          if (next < 0) {
            // Prefer the unfolded architecture's links so its flow is visibly alive
            next =
              focusArch && focusArch.length > 0 && s.rand() < 0.5
                ? focusArch[Math.floor(s.rand() * focusArch.length)]
                : Math.floor(s.rand() * edges.length);
            // Skip folded architecture links: nothing to see there
            if (edges[next].projectIndex >= 0 && s.ufe[edges[next].projectIndex] < 0.5) {
              next = Math.floor(s.rand() * edges.length);
              if (edges[next].projectIndex >= 0 && s.ufe[edges[next].projectIndex] < 0.5) next = 0;
            }
          }
          packets.edge[i] = next;
          e = edges[next];
        }
        // Packets on far-away clusters keep their schedule but aren't redrawn
        if (!full && e.cluster >= 0 && e.projectIndex < 0 && Math.abs(f - e.cluster) > NEAR_NODES) continue;
        const isArch = e.projectIndex >= 0;
        const a = isArch ? live[e.aNode] : e.a;
        const b = isArch ? live[e.bNode] : e.b;
        const act = isArch ? s.ufe[e.projectIndex] : e.cluster < 0 ? 0.6 : activity(e.cluster, f);
        const w = packets.u[i];
        writeMatrix(
          pkM,
          i,
          a.x + (b.x - a.x) * w,
          a.y + (b.y - a.y) * w,
          a.z + (b.z - a.z) * w,
          (isArch && act < 0.05 ? 0 : 0.07 + 0.1 * act) * sizeK
        );
        shade(s.color, base(e.color), 0.35 + 0.65 * act);
        pkC[i * 3] = s.color.r;
        pkC[i * 3 + 1] = s.color.g;
        pkC[i * 3 + 2] = s.color.b;
      }
      pk.instanceMatrix.needsUpdate = true;
      pk.instanceColor!.needsUpdate = true;
    }

    // --- The request: a bright packet with a trail, riding the backbone just ahead of the camera ---
    const trace = traceRef.current;
    if (trace) {
      if (!trace.instanceColor) trace.setColorAt(0, s.color);
      const trM = trace.instanceMatrix.array as Float32Array;
      const trC = trace.instanceColor!.array as Float32Array;
      const lead = Math.min(f + TRACE_LEAD, SECTION_COUNT - 1);
      for (let k = 0; k < TRACE_COUNT; k++) {
        backbonePoint(data, Math.max(0, lead - k * 0.05), s.tmp);
        const fade = 1 - k / TRACE_COUNT;
        writeMatrix(
          trM,
          k,
          s.tmp.x,
          s.tmp.y,
          s.tmp.z,
          0.17 * (0.35 + 0.65 * fade) * (1 + Math.sin(t * 5) * 0.08 * motion)
        );
        shade(s.color, pal.trace, 0.25 + 0.75 * fade);
        trC[k * 3] = s.color.r;
        trC[k * 3 + 1] = s.color.g;
        trC[k * 3 + 2] = s.color.b;
      }
      trace.instanceMatrix.needsUpdate = true;
      trace.instanceColor!.needsUpdate = true;
    }

    // --- Section signatures (only when their section is near) ---
    if (coreShellRef.current && f < 1.5) {
      coreShellRef.current.rotation.y = t * 0.12 * motion;
      coreShellRef.current.rotation.x = t * 0.07 * motion;
      const k = 0.08 + 0.25 * activity(0, f);
      (coreShellRef.current.material as THREE.MeshBasicMaterial).opacity = k;
    }
    if (f > SECTION_COUNT - 2.5) {
      ringRefs.current.forEach((ring, i) => {
        if (!ring) return;
        // Endpoint beacon: rings expand outward and fade, staggered
        const phase = ((t * 0.35 * motion + i / 3) % 1 + 1) % 1;
        ring.scale.setScalar(1 + phase * 5);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.5 * activity(6, f);
      });
    }

    // Tell the frame governor whether anything is changing fast enough to deserve full frame rate
    scrollStore.camMoving =
      speed > 0.003 ||
      unfolding ||
      Math.abs(s.parX - px) > 0.003 ||
      Math.abs(s.parY - py) > 0.003;
  });

  const coreHub = hubs[0];
  const contactHub = hubs[SECTION_COUNT - 1];

  return (
    <>
      <color attach="background" args={[pal.bgHex]} />
      <fogExp2 attach="fog" args={[pal.bgHex, pal.fog]} />

      {/* Distant stars along the whole route */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color={pal.starColor}
          transparent
          opacity={pal.starOpacity}
          sizeAttenuation
          depthWrite={false}
          blending={blending}
        />
      </points>

      {/* Links between services */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute ref={edgePosRef} attach="attributes-position" args={[edgePosInit, 3]} />
          <bufferAttribute ref={edgeColorRef} attach="attributes-color" args={[edgeColorInit, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent depthWrite={false} blending={blending} />
      </lineSegments>

      {/* Service nodes: a solid core inside a slowly turning wire shell */}
      <instancedMesh ref={solidRef} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={wireRef} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={pal.wireOpacity}
          depthWrite={false}
          toneMapped={false}
          blending={blending}
        />
      </instancedMesh>

      {/* Data packets */}
      <instancedMesh ref={packetRef} args={[undefined, undefined, packetCount]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* The request travelling the backbone as you scroll */}
      <instancedMesh ref={traceRef} args={[undefined, undefined, TRACE_COUNT]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Core: the gateway everything hangs off */}
      <mesh ref={coreShellRef} position={coreHub}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial
          color={pal.gold}
          wireframe
          transparent
          opacity={0.4}
          depthWrite={false}
          toneMapped={false}
          blending={blending}
        />
      </mesh>

      {/* Contact: an endpoint beacon pinging outward */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          position={contactHub}
          rotation={[Math.PI / 2.4, 0, 0]}
        >
          <torusGeometry args={[1, 0.012, 8, 96]} />
          <meshBasicMaterial
            color={pal.cyan}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={blending}
          />
        </mesh>
      ))}
    </>
  );
}
