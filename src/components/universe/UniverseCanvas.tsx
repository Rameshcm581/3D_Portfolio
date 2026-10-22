import { Component, useEffect, useRef, useState, type ReactNode, type ErrorInfo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SystemMapScene } from './SystemMapScene';
import { type Theme } from '../../theme';
import { scrollStore } from './scrollStore';

interface UniverseCanvasProps {
  reducedMotion: boolean;
  theme: Theme;
  /** Stop rendering entirely (e.g. while a modal covers the scene) */
  paused: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL Rendering Encountered an Error, falling back to 2D UI:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const isTouchDevice = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches;

const maxDpr = () => {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, isTouchDevice() ? 1.5 : 2);
};

const IDLE_FRAME_MS = 33; // ~30 fps while nothing is changing
const INTERACTION_GRACE_MS = 700;

// Renders on demand: full rate while the visitor is scrolling, moving the pointer or the camera
// is still settling, and roughly 30 fps for the ambient drift otherwise. Halves idle GPU and
// battery use without touching how it feels in use. Also steps the resolution down when frames
// run slow and back up when there is headroom.
function FrameGovernor({
  paused,
  onSlow,
  onFast,
}: {
  paused: boolean;
  onSlow: () => void;
  onFast: () => void;
}) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const busy =
        scrollStore.camMoving ||
        scrollStore.hoverNode >= 0 ||
        now - scrollStore.lastInput < INTERACTION_GRACE_MS;
      if (busy || now - last >= IDLE_FRAME_MS) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, invalidate]);

  // Frame-time watch, counting only frames rendered while the visitor is actively interacting
  const watch = useRef({ time: 0, frames: 0, good: 0 });
  useFrame((_, delta) => {
    if (!scrollStore.camMoving) return;
    const window_ = watch.current;
    window_.time += delta;
    window_.frames++;
    if (window_.time < 2) return;
    const avg = window_.time / window_.frames;
    window_.time = 0;
    window_.frames = 0;
    if (avg > 1 / 40) {
      window_.good = 0;
      onSlow();
    } else if (avg < 1 / 55 && ++window_.good >= 2) {
      window_.good = 0;
      onFast();
    }
  });

  return null;
}

export function UniverseCanvas({ reducedMotion, theme, paused }: UniverseCanvasProps) {
  const [lite] = useState(isTouchDevice);
  const [dprCeiling] = useState(maxDpr);
  const [dpr, setDpr] = useState(dprCeiling);

  return (
    <div
      className="universe-canvas-container"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <WebGLErrorBoundary
        fallback={
          <div
            className="webgl-fallback-ambient"
            style={{ position: 'absolute', inset: 0, background: 'var(--bg-primary)' }}
          />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 0], fov: 48, near: 0.1, far: 250 }}
          dpr={dpr}
          frameloop={paused ? 'never' : 'demand'}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          
          <FrameGovernor
            paused={paused}
            onSlow={() => setDpr((d) => Math.max(1, d - 0.5))}
            onFast={() => setDpr((d) => Math.min(dprCeiling, d + 0.5))}
          />
          <SystemMapScene reducedMotion={reducedMotion} lite={lite} theme={theme} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
