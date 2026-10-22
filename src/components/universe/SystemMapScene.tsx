import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildSystemMap, mulberry32, GOLD, CYAN, SECTION_COUNT, type SystemMapData } from './systemMap';
import { scrollStore } from './scrollStore';

interface SystemMapSceneProps {
  reducedMotion: boolean;
  lite: boolean;
}

const BASE_FOV = 48;
const DIM = 0.22;

const smoothstep = (x: number) => x * x * (3 - 2 * x);
// How "lit" a cluster is, given how far the camera currently is from its section
const activity = (cluster: number, f: number) =>
  smoothstep(Math.max(0, 1 - Math.abs(f - cluster) * 0.85));

interface Sim {
  data: SystemMapData;
  packets: {
    pickEdge: () => number;
    edge: Int32Array;
    u: Float32Array;
    speed: Float32Array;
  };
  dummy: THREE.Object3D;
  color: THREE.Color;
  look: THREE.Vector3;
  pos: THREE.Vector3;
  smooth: number;
  parX: number;
  parY: number;
  fov: number;
  ready: boolean;
}

// Packets ride the edges; the backbone is weighted so the main line always has traffic
function createSim(data: SystemMapData, packetCount: number): Sim {
  const rand = mulberry32(23);
  const { edges } = data;
  const backbone = edges.map((e, i) => (e.cluster < 0 ? i : -1)).filter((i) => i >= 0);
  const pickEdge = () =>
    backbone.length > 0 && rand() < 0.45
      ? backbone[Math.floor(rand() * backbone.length)]
      : Math.floor(rand() * edges.length);
  return {
    data,
    packets: {
      pickEdge,
      edge: Int32Array.from({ length: packetCount }, pickEdge),
      u: Float32Array.from({ length: packetCount }, rand),
      speed: Float32Array.from({ length: packetCount }, () => 2.2 + rand() * 2.4),
    },
    dummy: new THREE.Object3D(),
    color: new THREE.Color(),
    look: new THREE.Vector3(),
    pos: new THREE.Vector3(),
    smooth: 0,
    parX: 0,
    parY: 0,
    fov: BASE_FOV,
    ready: false,
  };
}

export function SystemMapScene({ reducedMotion, lite }: SystemMapSceneProps) {
  const size = useThree((s) => s.size);
  const portrait = size.width / size.height < 1;
  const data = useMemo(() => buildSystemMap({ lite, portrait }), [lite, portrait]);
  const { nodes, edges, waypoints, hubs } = data;

  const curve = useMemo(() => new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5), [waypoints]);

  const solidRef = useRef<THREE.InstancedMesh>(null);
  const wireRef = useRef<THREE.InstancedMesh>(null);
  const packetRef = useRef<THREE.InstancedMesh>(null);
  const edgeColorRef = useRef<THREE.BufferAttribute>(null);
  const coreShellRef = useRef<THREE.Mesh>(null);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  const edgePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      arr.set([e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z], i * 6);
    });
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

  // Per-frame simulation state lives in a ref: it is created lazily and rebuilt when the map changes
  const simRef = useRef<Sim | null>(null);

  useFrame((state, rawDelta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(rawDelta, 0.1);
    const t = state.clock.elapsedTime;
    if (!simRef.current || simRef.current.data !== data) {
      simRef.current = createSim(data, packetCount);
    }
    const s = simRef.current;
    const { packets } = s;

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

    const motion = reducedMotion ? 0 : 1;
    const highlight = scrollStore.highlightProject;

    // --- Nodes ---
    const solid = solidRef.current;
    const wire = wireRef.current;
    if (solid && wire) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const act = activity(n.cluster, f);
        const boost = n.projectIndex >= 0 && n.projectIndex === highlight ? 0.55 : 0;
        const pulse = Math.sin(t * 1.6 + i * 1.7) * 0.07 * motion;
        const sc = n.size * (0.7 + 0.5 * act + boost + pulse);

        s.dummy.position.copy(n.position);
        s.dummy.rotation.set(0, 0, 0);
        s.dummy.scale.setScalar(sc * 0.5);
        s.dummy.updateMatrix();
        solid.setMatrixAt(i, s.dummy.matrix);

        s.dummy.rotation.set(t * 0.25 * motion + i, t * 0.35 * motion, 0);
        s.dummy.scale.setScalar(sc * 1.05);
        s.dummy.updateMatrix();
        wire.setMatrixAt(i, s.dummy.matrix);

        s.color.copy(n.color).multiplyScalar(DIM + (1 - DIM) * Math.min(1, act + boost));
        solid.setColorAt(i, s.color);
        wire.setColorAt(i, s.color);
      }
      solid.instanceMatrix.needsUpdate = true;
      wire.instanceMatrix.needsUpdate = true;
      if (solid.instanceColor) solid.instanceColor.needsUpdate = true;
      if (wire.instanceColor) wire.instanceColor.needsUpdate = true;
    }

    // --- Edges: brightness follows the active cluster ---
    const ec = edgeColorRef.current;
    if (ec) {
      const edgeColors = ec.array as Float32Array;
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const act = e.cluster < 0 ? 0.5 : activity(e.cluster, f);
        const k = 0.12 + 0.5 * act;
        edgeColors[i * 6] = edgeColors[i * 6 + 3] = e.color.r * k;
        edgeColors[i * 6 + 1] = edgeColors[i * 6 + 4] = e.color.g * k;
        edgeColors[i * 6 + 2] = edgeColors[i * 6 + 5] = e.color.b * k;
      }
      ec.needsUpdate = true;
    }

    // --- Packets travelling along edges ---
    const pk = packetRef.current;
    if (pk) {
      const flow = reducedMotion ? 0.25 : 1;
      for (let i = 0; i < packetCount; i++) {
        let e = edges[packets.edge[i]];
        packets.u[i] += (packets.speed[i] * dt * flow) / Math.max(e.length, 0.001);
        if (packets.u[i] >= 1) {
          packets.u[i] = 0;
          packets.edge[i] = e.next >= 0 ? e.next : packets.pickEdge();
          e = edges[packets.edge[i]];
        }
        const act = e.cluster < 0 ? 0.6 : activity(e.cluster, f);
        s.dummy.position.lerpVectors(e.a, e.b, packets.u[i]);
        s.dummy.rotation.set(0, 0, 0);
        s.dummy.scale.setScalar(0.07 + 0.1 * act);
        s.dummy.updateMatrix();
        pk.setMatrixAt(i, s.dummy.matrix);
        s.color.copy(e.color).multiplyScalar(0.35 + 0.65 * act);
        pk.setColorAt(i, s.color);
      }
      pk.instanceMatrix.needsUpdate = true;
      if (pk.instanceColor) pk.instanceColor.needsUpdate = true;
    }

    // --- Section signatures ---
    if (coreShellRef.current) {
      coreShellRef.current.rotation.y = t * 0.12 * motion;
      coreShellRef.current.rotation.x = t * 0.07 * motion;
      const k = 0.08 + 0.25 * activity(0, f);
      (coreShellRef.current.material as THREE.MeshBasicMaterial).opacity = k;
    }
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      // Endpoint beacon: rings expand outward and fade, staggered
      const phase = ((t * 0.35 * motion + i / 3) % 1 + 1) % 1;
      ring.scale.setScalar(1 + phase * 5);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.5 * activity(6, f);
    });
  });

  const coreHub = hubs[0];
  const contactHub = hubs[SECTION_COUNT - 1];

  return (
    <>
      <fogExp2 attach="fog" args={['#07080b', 0.011]} />

      {/* Distant stars along the whole route */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#9fb6d6"
          transparent
          opacity={0.65}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Links between services */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
          <bufferAttribute ref={edgeColorRef} attach="attributes-color" args={[edgeColorInit, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Service nodes: a solid core inside a slowly turning wire shell */}
      <instancedMesh ref={solidRef} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={wireRef} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Data packets */}
      <instancedMesh ref={packetRef} args={[undefined, undefined, packetCount]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Core: the gateway everything hangs off */}
      <mesh ref={coreShellRef} position={coreHub}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial
          color={GOLD}
          wireframe
          transparent
          opacity={0.4}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
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
            color={CYAN}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}
