import * as THREE from 'three';

// A service mesh the camera travels along as the page scrolls. Each portfolio
// section owns one cluster of nodes; a backbone links the cluster hubs.

export const SECTION_COUNT = 7;
export const GOLD = new THREE.Color('#dfc070');
export const CYAN = new THREE.Color('#38bdf8');

const SPACING = 28; // distance between sections along the travel path
// How far ahead of the camera each cluster sits (the hero's is far back so it stays behind the headline)
const CLUSTER_DEPTHS = [16, 10, 10, 12, 10, 10, 10];

export interface MapNode {
  position: THREE.Vector3;
  size: number;
  cluster: number;
  color: THREE.Color;
  /** Index into the projects list, or -1 */
  projectIndex: number;
}

export interface MapEdge {
  a: THREE.Vector3;
  b: THREE.Vector3;
  length: number;
  /** Cluster index, or -1 for the backbone */
  cluster: number;
  /** Next backbone segment packets continue onto, or -1 */
  next: number;
  color: THREE.Color;
}

export interface SystemMapData {
  nodes: MapNode[];
  edges: MapEdge[];
  waypoints: THREE.Vector3[];
  hubs: THREE.Vector3[];
}

export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface BuildOptions {
  /** Fewer nodes for phones */
  lite: boolean;
  /** Portrait screens: tighter clusters, centred behind the content */
  portrait: boolean;
}

export function buildSystemMap({ lite, portrait }: BuildOptions): SystemMapData {
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
    projectIndex = -1
  ) => {
    const position = center.clone().add(offset.multiplyScalar(spread));
    nodes.push({ position, size: size * 0.8, cluster, color, projectIndex });
    return nodes.length - 1;
  };

  const link = (a: number, b: number, cluster: number) => {
    const pa = nodes[a].position;
    const pb = nodes[b].position;
    edges.push({
      a: pa,
      b: pb,
      length: pa.distanceTo(pb),
      cluster,
      next: -1,
      color: nodes[a].color,
    });
  };

  const shell = (rMin: number, rMax: number) => {
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const r = rMin + rand() * (rMax - rMin);
    const s = Math.sqrt(1 - u * u);
    return new THREE.Vector3(r * s * Math.cos(phi), r * u * 0.8, r * s * Math.sin(phi) * 0.7);
  };

  // Connect each node in `ids` to its k nearest neighbours inside the group
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

  for (let c = 0; c < SECTION_COUNT; c++) {
    const w = waypoints[c];
    const center = new THREE.Vector3(
      w.x + sides[c] * 4.8 * sideScale,
      w.y + lifts[c],
      w.z - CLUSTER_DEPTHS[c]
    );
    const zero = () => new THREE.Vector3();
    const ids: number[] = [];
    const hub = addNode(center, zero(), c === 6 ? 1.2 : 0.95, c, GOLD);
    hubs.push(nodes[hub].position);
    ids.push(hub);

    if (c === 0 || c === 1 || c === 2 || c === 5 || c === 6) {
      // Satellites scattered around a hub
      const count = [9, 6, lite ? 9 : 14, 0, 0, 7, 8][c];
      const [rMin, rMax] = c === 0 ? [4.5, 6.5] : c === 2 ? [2.4, 5.2] : [3, 5];
      for (let i = 0; i < count; i++) {
        const id = addNode(center, shell(rMin, rMax), 0.28 + rand() * 0.24, c, pick());
        ids.push(id);
        if (c !== 2 || i < 5) link(hub, id, c);
      }
      connectNearest(ids.slice(1), c === 2 ? 2 : 1, c);
    } else if (c === 3) {
      // Projects: an API gateway fanning out to one service per project
      const xs = [-6, -3, 0, 3, 6];
      let prevProject = -1;
      xs.forEach((x, i) => {
        const id = addNode(
          center,
          new THREE.Vector3(x, 2.2 + Math.sin(i * 1.7) * 0.9, 1.4 - Math.abs(x) * 0.12),
          0.62,
          c,
          i % 2 === 0 ? GOLD : CYAN,
          i
        );
        ids.push(id);
        link(hub, id, c);
        if (prevProject >= 0) link(prevProject, id, c);
        prevProject = id;
        if (!lite) {
          for (let s = 0; s < 2; s++) {
            const sat = addNode(center, new THREE.Vector3(x + (rand() - 0.5) * 2.2, 3.8 + rand() * 1.6, (rand() - 0.5) * 2), 0.2, c, CYAN);
            link(id, sat, c);
          }
        }
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
  for (let c = 0; c < SECTION_COUNT - 1; c++) {
    const from = hubs[c];
    const to = hubs[c + 1];
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.x += (c % 2 === 0 ? -1 : 1) * 4.5;
    mid.y += (c % 2 === 0 ? 1 : -1) * 2.5;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = curve.getPoints(8);
    const first = edges.length;
    for (let i = 0; i < pts.length - 1; i++) {
      edges.push({
        a: pts[i],
        b: pts[i + 1],
        length: pts[i].distanceTo(pts[i + 1]),
        cluster: -1,
        next: i < pts.length - 2 ? first + i + 1 : -1,
        color: i % 2 === 0 ? GOLD : CYAN,
      });
    }
  }

  return { nodes, edges, waypoints, hubs };
}
