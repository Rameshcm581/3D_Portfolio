import { Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { type SectorId } from '../../types/universe';
import { DeepSpaceBackground } from './DeepSpaceBackground';
import { SceneLighting } from './SceneLighting';
import { CameraRig } from './CameraRig';
import { SectorCore } from './SectorCore';
import { SectorAbout } from './SectorAbout';
import { SectorSkills } from './SectorSkills';
import { SectorProjects } from './SectorProjects';
import { SectorExperience } from './SectorExperience';
import { SectorEducation } from './SectorEducation';
import { SectorContact } from './SectorContact';

interface UniverseCanvasProps {
  activeSectorId: SectorId;
  reducedMotion: boolean;
  selectedSkillDomain: string | null;
  onSelectSkillDomain: (id: string) => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCoordinatesUpdate?: (coords: [number, number, number]) => void;
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

export function UniverseCanvas({
  activeSectorId,
  reducedMotion,
  selectedSkillDomain,
  onSelectSkillDomain,
  selectedProjectId,
  onSelectProject,
  onCoordinatesUpdate,
}: UniverseCanvasProps) {
  return (
    <div className="universe-canvas-container" style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'auto' }}>
      <WebGLErrorBoundary
        fallback={
          <div className="webgl-fallback-ambient" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #151a24 0%, #08090d 100%)' }} />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 48, near: 0.1, far: 250 }}
          dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Deep Space Volumetric Fog */}
          <fogExp2 attach="fog" args={['#07080b', 0.015]} />

          {/* Scene Lighting Engine */}
          <SceneLighting activeSectorId={activeSectorId} />

          {/* Infinite Celestial Dust & Starfield */}
          <DeepSpaceBackground particleCount={1000} />

          {/* Camera Controller with Project Zoom-In & Organic Parallax */}
          <CameraRig
            activeSectorId={activeSectorId}
            selectedProjectId={selectedProjectId}
            reducedMotion={reducedMotion}
            onCoordinatesUpdate={onCoordinatesUpdate}
          />

          {/* Spatially Positioned 3D Environments */}
          <Suspense fallback={null}>
            <SectorCore isActive={activeSectorId === 'core'} />
            <SectorAbout isActive={activeSectorId === 'about'} />
            <SectorSkills
              isActive={activeSectorId === 'skills'}
              selectedDomain={selectedSkillDomain}
              onSelectDomain={onSelectSkillDomain}
            />
            <SectorProjects
              isActive={activeSectorId === 'projects'}
              selectedProjectId={selectedProjectId}
              onSelectProject={onSelectProject}
            />
            <SectorExperience isActive={activeSectorId === 'experience'} />
            <SectorEducation isActive={activeSectorId === 'education'} />
            <SectorContact isActive={activeSectorId === 'contact'} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
