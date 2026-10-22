import { Component, useState, type ReactNode, type ErrorInfo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { SystemMapScene } from './SystemMapScene';
import { type Theme } from '../../theme';

interface UniverseCanvasProps {
  reducedMotion: boolean;
  theme: Theme;
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

export function UniverseCanvas({ reducedMotion, theme }: UniverseCanvasProps) {
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
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          
          {/* Drop resolution when frames get slow, restore it when there is headroom */}
          <PerformanceMonitor
            onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
            onIncline={() => setDpr((d) => Math.min(dprCeiling, d + 0.5))}
          />
          <SystemMapScene reducedMotion={reducedMotion} lite={lite} theme={theme} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
