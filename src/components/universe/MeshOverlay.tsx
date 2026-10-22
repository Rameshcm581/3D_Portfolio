import React, { useEffect, useRef, useState } from 'react';
import { scrollStore } from './scrollStore';
import { describeNode, type NodeDescription } from './meshInteraction';

// DOM layer over the 3D scene: text labels pinned to nodes, the hover tooltip,
// and the request-trace readout. Positions are written straight to the DOM each
// frame from the scene's projected coordinates, so none of this re-renders React.

const TRACE: { route: string; via: string; status: string; ms: number }[] = [
  { route: 'GET /', via: 'gateway', status: '200 OK', ms: 12 },
  { route: 'GET /about', via: 'gateway → profile-svc', status: '200 OK', ms: 18 },
  { route: 'GET /skills', via: 'gateway → skills-svc', status: '200 OK', ms: 9 },
  { route: 'GET /projects', via: 'gateway → project-svc', status: '200 OK', ms: 24 },
  { route: 'GET /experience', via: 'gateway → timeline-svc', status: '200 OK', ms: 15 },
  { route: 'GET /credentials', via: 'gateway → credentials-svc', status: '200 OK', ms: 11 },
  { route: 'POST /contact', via: 'gateway → mail-svc', status: '202 Accepted', ms: 31 },
];

interface MeshOverlayProps {
  activeIndex: number;
}

export const MeshOverlay: React.FC<MeshOverlayProps> = ({ activeIndex }) => {
  const [labelNodes, setLabelNodes] = useState<number[]>([]);
  const [hover, setHover] = useState<NodeDescription | null>(null);

  const chipRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const tipRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  const hoverRef = useRef(-1);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    let frame = 0;
    let knownNodes: number[] | null = null;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const w = window.innerWidth;
      const h = window.innerHeight;

      // The scene builds (and rebuilds) its label list; pick it up when it changes
      if (scrollStore.labelNodes !== knownNodes) {
        knownNodes = scrollStore.labelNodes;
        setLabelNodes(knownNodes.slice());
      }

      const { nodeScreen, labelAlpha } = scrollStore;
      chipRefs.current.forEach((el, i) => {
        const a = labelAlpha[i] ?? 0;
        if (a < 0.03) {
          if (el.style.opacity !== '0') el.style.opacity = '0';
          return;
        }
        const x = (nodeScreen[i * 4] * 0.5 + 0.5) * w;
        const y = (-nodeScreen[i * 4 + 1] * 0.5 + 0.5) * h;
        const below = nodeScreen[i * 4 + 3] * (h / 2) + 6; // clear the node's own shell
        el.style.opacity = String(Math.min(1, a));
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, ${below.toFixed(1)}px)`;
      });

      // Hover tooltip + pointer cursor
      const hi = scrollStore.hoverNode;
      if (hi !== hoverRef.current) {
        hoverRef.current = hi;
        const desc = hi >= 0 ? describeNode(scrollStore.nodeInfo[hi], activeRef.current) : null;
        setHover(desc);
        document.body.style.cursor = desc?.action ? 'pointer' : '';
      }
      const tip = tipRef.current;
      if (tip && hi >= 0 && nodeScreen.length > hi * 4) {
        const x = (nodeScreen[hi * 4] * 0.5 + 0.5) * w;
        const y = (-nodeScreen[hi * 4 + 1] * 0.5 + 0.5) * h - nodeScreen[hi * 4 + 3] * (h / 2);
        tip.style.transform = `translate3d(${Math.min(Math.max(x, 120), w - 120).toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, calc(-100% - 8px))`;
      }

      // Request progress along the backbone
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollStore.progress / 6)).toFixed(3)})`;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.cursor = '';
    };
  }, []);

  const trace = TRACE[Math.min(activeIndex, TRACE.length - 1)];

  return (
    <>
      <div className="mesh-labels" aria-hidden="true">
        {labelNodes.map((i) => {
          const info = scrollStore.nodeInfo[i];
          if (!info) return null;
          return (
            <div
              key={i}
              ref={(el) => {
                if (el) chipRefs.current.set(i, el);
                else chipRefs.current.delete(i);
              }}
              className={`mesh-chip${info.isArch ? ' arch' : ''}`}
            >
              <span>{info.label}</span>
              {info.isArch && info.sub && <small>{info.sub}</small>}
            </div>
          );
        })}
      </div>

      <div ref={tipRef} className={`mesh-tooltip${hover ? ' visible' : ''}`} aria-hidden="true">
        {hover && (
          <>
            <strong>{hover.title}</strong>
            {hover.sub && <span>{hover.sub}</span>}
            {hover.hint && <em>{hover.hint}</em>}
          </>
        )}
      </div>

      <div className="trace-hud" role="status" aria-label="Request trace for the current section">
        <span className="trace-dot" aria-hidden="true" />
        <span className="trace-route">{trace.route}</span>
        <span className="trace-via">{trace.via}</span>
        <span className="trace-status">
          {trace.status} · {trace.ms}ms
        </span>
        <div className="trace-bar" aria-hidden="true">
          <div ref={barRef} className="trace-bar-fill" />
        </div>
      </div>
    </>
  );
};
