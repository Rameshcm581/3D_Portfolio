import { SECTORS } from '../../types/universe';
import type { NodeInfo } from './scrollStore';

export type NodeAction = { kind: 'project'; projectIndex: number } | { kind: 'travel'; cluster: number } | null;

export interface NodeDescription {
  title: string;
  sub?: string;
  hint?: string;
  action: NodeAction;
}

/** What hovering or clicking a mesh node means, given which section is in view */
export function describeNode(info: NodeInfo | undefined, activeCluster: number): NodeDescription | null {
  if (!info) return null;
  if (info.projectIndex >= 0) {
    return { title: info.label ?? 'Project', sub: info.sub, hint: 'Click to open case study', action: { kind: 'project', projectIndex: info.projectIndex } };
  }
  if (info.cluster !== activeCluster) {
    const name = SECTORS[info.cluster]?.navLabel;
    return { title: info.label ?? name ?? '', sub: info.label ? info.sub : undefined, hint: `Click to travel to ${name}`, action: { kind: 'travel', cluster: info.cluster } };
  }
  if (info.label) return { title: info.label, sub: info.sub, action: null };
  return null;
}
