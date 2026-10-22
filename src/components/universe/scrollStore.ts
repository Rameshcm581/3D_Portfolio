// Mutable state shared between the page (DOM) and the 3D scene. Read every frame
// by the scene, so it deliberately lives outside React state.
export const scrollStore = {
  /** Continuous section position: 0 = first section centred, 6 = last section centred */
  progress: 0,
  /** Pointer position, -1..1 on both axes */
  pointerX: 0,
  pointerY: 0,
  /** Index of the project card being hovered or inspected, or -1 */
  highlightProject: -1,
};
