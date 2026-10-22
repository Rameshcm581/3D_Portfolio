import * as THREE from 'three';
import { EXHIBITION_PROJECTS, SKILL_DOMAINS } from '../../data/universeData';
import { PROJECT_ARCHITECTURES } from '../../data/projectArchitectures';

// A service mesh the camera travels along as the page scrolls. Each portfolio
// section owns one cluster of nodes; a backbone links the cluster hubs.

export const SECTION_COUNT = 7;
export const GOLD = new THREE.Color('#dfc070');
export const CYAN = new THREE.Color('#38bdf8');

const SPACING = 28; // distance between sections along the travel path
// How far ahead of the camera each cluster sits (the hero's is far back so it stays behind the headline)
const CLUSTER_DEPTHS = [16, 10, 10, 12, 10, 10, 10];
const BACKBONE_SEGMENTS = 8;

export interface MapNode {
  /** Resting position. Architecture nodes rest on top of their project node, folded away. */
  position: THREE.Vector3;
  size: number;
  cluster: number;
  color: THREE.Color;
  /** Project index for a project node, and for each architecture node under it; otherwise -1 */
  projectIndex: number;
  /** True for the architecture nodes that unfold from a project node */
  isArch: boolean;
  /** Architecture nodes: where they unfold to, relative to the project node */
  offset?: THREE.Vector3;
  label?: string;
  sub?: string;
  /** Skill domain ids (matching the Skills tabs) this node belongs to */
  domains?: string[];
}

export interface MapEdge {
  /** Endpoints for backbone segments, which are static */
  a: THREE.Vector3;
  b: THREE.Vector3;
  /** Node indices for the endpoints, or -1 for a backbone segment */
  aNode: number;
  bNode: number;
  length: number;
  /** Cluster index, or -1 for the backbone */
  cluster: number;
  /** Next backbone segment packets continue onto, or -1 */
  next: number;
  color: THREE.Color;
  /** Project index when the edge belongs to an unfolded architecture, else -1 */
  projectIndex: number;
}

export interface SystemMapData {
  nodes: MapNode[];
  edges: MapEdge[];
  waypoints: THREE.Vector3[];
  hubs: THREE.Vector3[];
  /** Polyline points of each backbone leg (hub c to hub c+1) */
  backbone: THREE.Vector3[][];
}

export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface BuildOptions {
  /** Portrait screens: tighter clusters, centred behind the content */
  portrait: boolean;
}

// Hand-placed so the skills cluster reads as a real stack: who talks to whom
const SKILL_NODES: { label: string; domains: string[]; at: [number, number, number] }[] = [
  { label: 'FastAPI', domains: ['backend'], at: [0, 0, 0] },
  { label: 'Python', domains: ['languages'], at: [-3.2, 1.0, 0.6] },
  { label: 'REST APIs', domains: ['backend'], at: [-1.2, 2.4, -0.8] },
  { label: 'SQLAlchemy', domains: ['backend'], at: [2.0, 1.7, 0.4] },
  { label: 'JWT & RBAC', domains: ['backend'], at: [3.6, 0.2, -0.6] },
  { label: 'PostgreSQL', domains: ['databases'], at: [4.2, -1.7, 0.8] },
  { label: 'MySQL', domains: ['databases'], at: [2.2, -2.6, -0.4] },
  { label: 'Docker', domains: ['devops'], at: [-0.6, -2.4, 0.8] },
  { label: 'GitHub Actions', domains: ['devops'], at: [-3.2, -2.2, -0.2] },
  { label: 'Playwright', domains: ['automation'], at: [-4.6, -0.6, -0.8] },
  { label: 'OpenCV', domains: ['ai'], at: [-4.0, 2.6, -0.4] },
  { label: 'Qdrant', domains: ['ai'], at: [0.4, 3.3, 0.4] },
  { label: 'Rasa', domains: ['ai'], at: [3.0, 3.0, -1.0] },
  { label: 'React', domains: ['frontend'], at: [-1.8, -3.5, 0.2] },
  { label: 'Stripe', domains: ['integrations'], at: [1.2, -3.6, -0.6] },
];
const SKILL_LINKS: [string, string][] = [
  ['FastAPI', 'Python'],
  ['FastAPI', 'REST APIs'],
  ['FastAPI', 'SQLAlchemy'],
  ['FastAPI', 'JWT & RBAC'],
  ['SQLAlchemy', 'PostgreSQL'],
  ['SQLAlchemy', 'MySQL'],
  ['FastAPI', 'Docker'],
  ['Docker', 'GitHub Actions'],
  ['GitHub Actions', 'Playwright'],
  ['Python', 'Playwright'],
  ['Python', 'OpenCV'],
  ['Python', 'Qdrant'],
  ['Python', 'Rasa'],
  ['FastAPI', 'React'],
  ['FastAPI', 'Stripe'],
];

const HUB_LABELS: Record<number, { label: string; sub: string }> = {
  0: { label: 'API Gateway', sub: 'GET /' },
  1: { label: 'profile-svc', sub: 'GET /about' },
  3: { label: 'project-svc', sub: 'GET /projects' },
  4: { label: 'timeline-svc', sub: 'GET /experience' },
  5: { label: 'credentials-svc', sub: 'GET /credentials' },
  6: { label: 'mail-svc', sub: 'POST /contact' },
};

export function buildSystemMap({ portrait }: BuildOptions): SystemMapData {
  const rand = mulberry32(7);
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];
  const hubs: THREE.Vector3[] = [];
  const spread = portrait ? 0.55 : 1;
  const sideScale = portrait ? 0.12 : 1;
  const pick = () => (rand() < 0.55 ? GOLD : CYAN);

  // The camera's path: a gentle weave forward through the mesh. One extra point
  // past the last section gives the curve something to look toward at the end.
  const waypoints = Array.from(
    { length: SECTION_COUNT + 1 },
    (_, i) => new THREE.Vector3(Math.sin(i * 1.3) * 2.2, Math.cos(i * 0.9) * 1.2, -i * SPACING)
  );

  // Which side of the screen each section's content leaves open: +1 right, -1 left
  const sides = [0, 1, 0.5, 0, -1, 1, 1];
  const lifts = [0, 0, 0, -0.8, 0, 0, 0];

  const addNode = (
    center: THREE.Vector3,
    offset: THREE.Vector3,
    size: number,
    cluster: number,
    color: THREE.Color,
    extra: Partial<MapNode> = {}
  ) => {
    nodes.push({
      position: center.clone().add(offset.multiplyScalar(spread)),
      size: size * 0.8,
      cluster,
      color,
      projectIndex: -1,
      isArch: false,
      ...extra,
    });
    return nodes.length - 1;
  };

  const link = (a: number, b: number, cluster: number, projectIndex = -1, length?: number) => {
    const pa = nodes[a].position;
    const pb = nodes[b].position;
    edges.push({
      a: pa,
      b: pb,
      aNode: a,
      bNode: b,
      length: length ?? pa.distanceTo(pb),
      cluster,
      next: -1,
      color: nodes[a].color,
      projectIndex,
    });
  };

  const shell = (rMin: number, rMax: number) => {
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const r = rMin + rand() * (rMax - rMin);
    const s = Math.sqrt(1 - u * u);
    return new THREE.Vector3(r * s * Math.cos(phi), r * u * 0.8, r * s * Math.sin(phi) * 0.7);
  };

  // Connect each node in `ids` to its nearest neighbour(s) inside the group
  const connectNearest = (ids: number[], k: number, cluster: number) => {
    const seen = new Set<string>();
    for (const i of ids) {
      const near = ids
        .filter((j) => j !== i)
        .sort(
          (x, y) =>
            nodes[i].position.distanceToSquared(nodes[x].position) -
            nodes[i].position.distanceToSquared(nodes[y].position)
        )
        .slice(0, k);
      for (const j of near) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        link(i, j, cluster);
      }
    }
  };

  const skillTitle = (id: string) => SKILL_DOMAINS.find((d) => d.id === id)?.title ?? '';

  for (let c = 0; c < SECTION_COUNT; c++) {
    const w = waypoints[c];
    const center = new THREE.Vector3(
      w.x + sides[c] * 4.8 * sideScale,
      w.y + lifts[c],
      w.z - CLUSTER_DEPTHS[c]
    );
    const ids: number[] = [];
    const hub = addNode(center, new THREE.Vector3(), c === 6 ? 1.2 : 0.95, c, GOLD, { ...HUB_LABELS[c] });
    hubs.push(nodes[hub].position);
    ids.push(hub);

    if (c === 2) {
      // Skills: the real stack, with FastAPI at the centre
      const byLabel = new Map<string, number>([['FastAPI', hub]]);
      Object.assign(nodes[hub], {
        label: 'FastAPI',
        sub: skillTitle('backend'),
        domains: ['backend'],
        size: 0.5,
      });
      SKILL_NODES.slice(1).forEach((s, i) => {
        const id = addNode(
          center,
          new THREE.Vector3(s.at[0], s.at[1] * 0.9, s.at[2]),
          0.5,
          c,
          i % 2 === 0 ? CYAN : GOLD,
          { label: s.label, sub: skillTitle(s.domains[0]), domains: s.domains }
        );
        byLabel.set(s.label, id);
      });
      for (const [a, b] of SKILL_LINKS) {
        const ia = byLabel.get(a);
        const ib = byLabel.get(b);
        if (ia !== undefined && ib !== undefined) link(ia, ib, c);
      }
    } else if (c === 0 || c === 1 || c === 5 || c === 6) {
      // Satellites scattered around a hub
      const count = [9, 6, 0, 0, 0, 7, 8][c];
      const [rMin, rMax] = c === 0 ? [4.5, 6.5] : [3, 5];
      for (let i = 0; i < count; i++) {
        const id = addNode(center, shell(rMin, rMax), 0.28 + rand() * 0.24, c, pick());
        ids.push(id);
        link(hub, id, c);
      }
      connectNearest(ids.slice(1), 1, c);
    } else if (c === 3) {
      // Projects: a project service fanning out to one node per project, each of which
      // can unfold into that project's architecture
      const xs = [-6, -3, 0, 3, 6];
      let prevProject = -1;
      xs.forEach((x, i) => {
        const project = EXHIBITION_PROJECTS[i];
        const id = addNode(
          center,
          new THREE.Vector3(x, 1.4 + Math.sin(i * 1.7) * 0.7, 1.4 - Math.abs(x) * 0.12),
          0.62,
          c,
          i % 2 === 0 ? GOLD : CYAN,
          { projectIndex: i, label: project.shortTitle, sub: project.category }
        );
        link(hub, id, c);
        if (prevProject >= 0) link(prevProject, id, c);
        prevProject = id;

        const arch = PROJECT_ARCHITECTURES[project.id];
        if (!arch) return;
        const count = arch.nodes.length;
        const archIds = arch.nodes.map((n, k) => {
          const offset = new THREE.Vector3(
            // Fan toward the middle of the screen so outer projects don't unfold off the edge
            (-2.6 + (5.2 * k) / Math.max(count - 1, 1)) * (portrait ? 0.6 : 1) - x * 0.45,
            1.2 + Math.sin(k * 1.3) * 0.45,
            0.8
          );
          // Rests on the project node (folded) until the project is highlighted
          return addNode(nodes[id].position, new THREE.Vector3(), 0.34, c, k % 2 === 0 ? CYAN : GOLD, {
            projectIndex: i,
            isArch: true,
            offset,
            label: n.label,
            sub: n.tech,
          });
        });
        link(id, archIds[0], c, i, 1.6);
        for (const [from, to] of arch.links) link(archIds[from], archIds[to], c, i, 1.8);
      });
    } else if (c === 4) {
      // Journey: a pipeline climbing toward the present
      const steps = 6;
      let prev = -1;
      for (let i = 0; i < steps; i++) {
        const f = i / (steps - 1);
        const id = addNode(
          center,
          new THREE.Vector3(-3.4 + f * 6.8, -3 + f * 5.5 + Math.sin(f * 6) * 0.5, 1.6 - f * 3),
          0.4 + f * 0.35,
          c,
          f > 0.8 ? GOLD : CYAN
        );
        ids.push(id);
        if (prev >= 0) link(prev, id, c);
        if (i > 1) link(ids[ids.length - 3], id, c);
        prev = id;
      }
      link(hub, prev, c);
    }
  }

  // Backbone: a curved chain of segments from each hub to the next
  const backbone: THREE.Vector3[][] = [];
  for (let c = 0; c < SECTION_COUNT - 1; c++) {
    const from = hubs[c];
    const to = hubs[c + 1];
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.x += (c % 2 === 0 ? -1 : 1) * 4.5;
    mid.y += (c % 2 === 0 ? 1 : -1) * 2.5;
    const pts = new THREE.QuadraticBezierCurve3(from, mid, to).getPoints(BACKBONE_SEGMENTS);
    backbone.push(pts);
    const first = edges.length;
    for (let i = 0; i < pts.length - 1; i++) {
      edges.push({
        a: pts[i],
        b: pts[i + 1],
        aNode: -1,
        bNode: -1,
        length: pts[i].distanceTo(pts[i + 1]),
        cluster: -1,
        next: i < pts.length - 2 ? first + i + 1 : -1,
        color: i % 2 === 0 ? GOLD : CYAN,
        projectIndex: -1,
      });
    }
  }

  return { nodes, edges, waypoints, hubs, backbone };
}

/** Position along the backbone at section progress `s` (0..SECTION_COUNT-1), written into `out` */
export function backbonePoint(data: SystemMapData, s: number, out: THREE.Vector3) {
  const legs = data.backbone.length;
  const clamped = Math.min(Math.max(s, 0), legs);
  const leg = Math.min(Math.floor(clamped), legs - 1);
  const pts = data.backbone[leg];
  const x = (clamped - leg) * (pts.length - 1);
  const i = Math.min(Math.floor(x), pts.length - 2);
  return out.lerpVectors(pts[i], pts[i + 1], x - i);
}
