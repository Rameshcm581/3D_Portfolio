import type { MapNode } from './systemMap';

// Mutable state shared between the page (DOM) and the 3D scene. Read every frame
// by the scene and the overlay, so it deliberately lives outside React state.
export interface NodeInfo {
  label?: string;
  sub?: string;
  cluster: number;
  projectIndex: number;
  isArch: boolean;
}

export const scrollStore = {
  /** Continuous section position: 0 = first section centred, 6 = last section centred */
  progress: 0,
  /** Pointer position, -1..1 on both axes */
  pointerX: 0,
  pointerY: 0,
  /** True while the pointer is over empty page (not a card or control), so the mesh can react */
  pointerActive: false,
  /** Project card being hovered (-1 for none) */
  highlightProject: -1,
  /** Project whose dossier is open (-1 for none) */
  openProject: -1,
  /** Skills tab currently selected, so matching nodes light up */
  skillDomain: null as string | null,

  // Written by the scene each frame, read by the DOM overlay
  /** Index of the mesh node under the pointer, or -1 */
  hoverNode: -1,
  /** Static info for every node, by index */
  nodeInfo: [] as NodeInfo[],
  /** Screen position per node as normalised device coords: [x, y, visible, radius] x N, where radius is in half-screen-heights */
  nodeScreen: new Float32Array(0) as Float32Array,
  /** Label opacity per node, 0 when its label should be hidden */
  labelAlpha: new Float32Array(0) as Float32Array,
  /** Which nodes carry a text label */
  labelNodes: [] as number[],
};

export const toNodeInfo = (n: MapNode): NodeInfo => ({
  label: n.label,
  sub: n.sub,
  cluster: n.cluster,
  projectIndex: n.projectIndex,
  isArch: n.isArch,
});
