import React, { useEffect, useState } from 'react';
import { PROJECT_ARCHITECTURES } from '../../data/projectArchitectures';

const BOX_W = 124;
const BOX_H = 46;
const FLOW_GAP = 30; // gap between stages, along the direction of flow
const CROSS_GAP = 12; // gap between boxes in the same stage
const PAD = 6;

// Narrow screens flow top-to-bottom so the diagram stays legible
function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

export const ArchitectureDiagram: React.FC<{ projectId: string }> = ({ projectId }) => {
  const arch = PROJECT_ARCHITECTURES[projectId];
  const vertical = useNarrow();
  if (!arch) return null;

  // Stage of each component: the longest chain of links leading to it
  const stage = arch.nodes.map(() => 0);
  for (let pass = 0; pass < arch.nodes.length; pass++) {
    for (const [from, to] of arch.links) stage[to] = Math.max(stage[to], stage[from] + 1);
  }
  const stageCount = Math.max(...stage) + 1;
  const members: number[][] = Array.from({ length: stageCount }, () => []);
  stage.forEach((s, i) => members[s].push(i));
  const widest = Math.max(...members.map((m) => m.length));

  // Position of each box's top-left corner
  const flowLen = stageCount * BOX_W + (stageCount - 1) * FLOW_GAP;
  const crossLen = widest * BOX_H + (widest - 1) * CROSS_GAP;
  const vFlowLen = stageCount * BOX_H + (stageCount - 1) * FLOW_GAP;
  const vCrossLen = widest * BOX_W + (widest - 1) * CROSS_GAP;
  const pos = arch.nodes.map((_, i) => {
    const s = stage[i];
    const k = members[s].indexOf(i);
    const count = members[s].length;
    if (!vertical) {
      const colH = count * BOX_H + (count - 1) * CROSS_GAP;
      return { x: PAD + s * (BOX_W + FLOW_GAP), y: PAD + (crossLen - colH) / 2 + k * (BOX_H + CROSS_GAP) };
    }
    const rowW = count * BOX_W + (count - 1) * CROSS_GAP;
    return { x: PAD + (vCrossLen - rowW) / 2 + k * (BOX_W + CROSS_GAP), y: PAD + s * (BOX_H + FLOW_GAP) };
  });

  const width = PAD * 2 + (vertical ? vCrossLen : flowLen);
  const height = PAD * 2 + (vertical ? vFlowLen : crossLen);

  const link = ([from, to]: [number, number]) => {
    const a = pos[from];
    const b = pos[to];
    if (!vertical) {
      const x1 = a.x + BOX_W;
      const y1 = a.y + BOX_H / 2;
      const x2 = b.x;
      const y2 = b.y + BOX_H / 2;
      const mx = (x1 + x2) / 2;
      return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
    }
    const x1 = a.x + BOX_W / 2;
    const y1 = a.y + BOX_H;
    const x2 = b.x + BOX_W / 2;
    const y2 = b.y;
    const my = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  };

  const markerId = `arrow-${projectId}`;

  return (
    <figure className="arch-figure">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="arch-svg"
        role="img"
        aria-label={`System flow: ${arch.summary}`}
        style={{ maxWidth: width * 1.3 }}
      >
        <defs>
          <marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--accent-gold)" />
          </marker>
        </defs>
        {arch.links.map((l, i) => (
          <path key={i} d={link(l)} className="arch-link" markerEnd={`url(#${markerId})`} />
        ))}
        {arch.nodes.map((n, i) => (
          <g key={i} transform={`translate(${pos[i].x},${pos[i].y})`}>
            <rect width={BOX_W} height={BOX_H} rx={8} className="arch-box" />
            <text x={BOX_W / 2} y={n.tech ? 19 : 28} textAnchor="middle" className="arch-label">
              {n.label}
            </text>
            {n.tech && (
              <text x={BOX_W / 2} y={34} textAnchor="middle" className="arch-tech">
                {n.tech}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="arch-caption">{arch.summary} Simplified view.</figcaption>
    </figure>
  );
};
