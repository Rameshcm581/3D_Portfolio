import React, { useRef, useMemo, useState, useEffect, Component, type ErrorInfo, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { NetworkSceneFallback } from './NetworkSceneFallback';
import './NetworkScene3D.css';

/**
 * Service Node Specification representing distributed architectural tiers
 */
interface ServiceTier {
  name: string;
  position: [number, number, number];
  color: string;
  geometryType: 'cube' | 'prism' | 'cylinder';
}

const SERVICE_TIERS: ServiceTier[] = [
  { name: 'API Gateway & Security', position: [0, 1.8, 0], color: '#dfc070', geometryType: 'prism' },
  { name: 'Workflow & Automation Engine', position: [2.1, 0, 0.4], color: '#38bdf8', geometryType: 'cube' },
  { name: 'Microservices Backend', position: [0, -1.8, 0], color: '#dfc070', geometryType: 'cube' },
  { name: 'Relational & Vector Stores', position: [-2.1, 0, -0.4], color: '#38bdf8', geometryType: 'cylinder' },
];

/**
 * Central Gateway Hub & Interconnected Architecture Mesh
 */
function ArchitectureCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const busLinesRef = useRef<THREE.LineSegments>(null);
  const packetsRef = useRef<THREE.Points>(null);

  // Orthogonal Conduit Line Geometry connecting services to central hub
  const busGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    SERVICE_TIERS.forEach((service) => {
      // 0,0,0 (Hub) -> Midpoint -> Service position
      const [tx, ty, tz] = service.position;
      const mx = tx * 0.5;
      const my = ty * 0.5;
      const mz = tz * 0.5;

      // Segment 1: Origin to Midpoint
      positions.push(0, 0, 0);
      positions.push(mx, my, mz);

      // Segment 2: Midpoint to Service
      positions.push(mx, my, mz);
      positions.push(tx, ty, tz);

      // Orbit cross-ties
      positions.push(tx * 0.85, ty * 0.85, tz * 0.85);
      positions.push(tx, ty, tz);
    });

    // Ring perimeter ties between neighboring services
    for (let i = 0; i < SERVICE_TIERS.length; i++) {
      const curr = SERVICE_TIERS[i].position;
      const next = SERVICE_TIERS[(i + 1) % SERVICE_TIERS.length].position;
      positions.push(curr[0], curr[1], curr[2]);
      positions.push(next[0], next[1], next[2]);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Dynamic Data Flow Packets (Pulses travelling along data conduits)
  const packetCount = 28;
  const packetPositions = useMemo(() => new Float32Array(packetCount * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Smooth interactive tilt following mouse pointer
    if (groupRef.current) {
      const targetRotX = state.pointer.y * 0.22;
      const targetRotY = state.pointer.x * 0.32;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3.5, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3.5, delta);
    }

    // Animate data flow packets travelling along bus routes
    if (packetsRef.current) {
      const posAttr = packetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < packetCount; i++) {
        const tierIdx = i % SERVICE_TIERS.length;
        const target = SERVICE_TIERS[tierIdx].position;
        // Progress cycles 0 -> 1
        const progress = ((t * 0.6 + i * (1 / packetCount)) % 1);
        
        // Linear interpolation from Hub (0,0,0) to Service target
        const x = target[0] * progress;
        const y = target[1] * progress;
        const z = target[2] * progress;

        array[i * 3] = x;
        array[i * 3 + 1] = y;
        array[i * 3 + 2] = z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central API Gateway Hub */}
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
        {/* Core Gateway Outer Enclosure */}
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#141722"
            emissive="#dfc070"
            emissiveIntensity={0.28}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>

        {/* Golden Wireframe Precision Lattice */}
        <mesh scale={[1.12, 1.12, 1.12]}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            wireframe
            color="#dfc070"
            emissive="#cfa851"
            emissiveIntensity={0.45}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>

        {/* Inner Pulsing Core Light */}
        <pointLight color="#dfc070" intensity={2.8} distance={5} />
      </Float>

      {/* Primary Data Flow Bus Lines */}
      <lineSegments ref={busLinesRef} geometry={busGeometry}>
        <lineBasicMaterial color="#cfa851" transparent opacity={0.32} linewidth={1} />
      </lineSegments>

      {/* Discrete Flowing Data Packets */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[packetPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#38bdf8"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Architectural Service Nodes */}
      {SERVICE_TIERS.map((tier, index) => (
        <ServiceNode key={index} tier={tier} index={index} />
      ))}
    </group>
  );
}

/**
 * Individual Architectural Service Tier Node
 */
function ServiceNode({ tier, index }: { tier: ServiceTier; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + index * 1.2;
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group position={tier.position}>
      {/* Node Body */}
      <mesh ref={meshRef}>
        {tier.geometryType === 'prism' && <coneGeometry args={[0.34, 0.55, 6]} />}
        {tier.geometryType === 'cube' && <boxGeometry args={[0.45, 0.45, 0.45]} />}
        {tier.geometryType === 'cylinder' && <cylinderGeometry args={[0.26, 0.26, 0.5, 8]} />}

        <meshStandardMaterial
          color="#12151f"
          emissive={tier.color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Outer Wireframe Cage */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        {tier.geometryType === 'prism' && <coneGeometry args={[0.34, 0.55, 6]} />}
        {tier.geometryType === 'cube' && <boxGeometry args={[0.45, 0.45, 0.45]} />}
        {tier.geometryType === 'cylinder' && <cylinderGeometry args={[0.26, 0.26, 0.5, 8]} />}

        <meshStandardMaterial
          wireframe
          color={tier.color}
          transparent
          opacity={0.5}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Node Beacon Glow */}
      <pointLight color={tier.color} intensity={1.2} distance={2.5} />
    </group>
  );
}

/**
 * Error boundary for Canvas
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL Canvas error, rendering architecture fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Main NetworkScene3D Component
 */
export const NetworkScene3D: React.FC = () => {
  const [isSupported] = useState<boolean>(checkWebGLSupport);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(checkReducedMotion);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  if (prefersReducedMotion) {
    return <NetworkSceneFallback reason="reduced-motion" />;
  }

  if (!isSupported) {
    return <NetworkSceneFallback reason="webgl-disabled" />;
  }

  return (
    <div className="scene-container" aria-label="Interactive Systems Architecture Visualization">
      <div className="scene-ambient-glow" />
      <CanvasErrorBoundary fallback={<NetworkSceneFallback reason="fallback" />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          dpr={[1, 1.8]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="three-canvas"
        >
          {/* Controlled Architectural Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 4]} intensity={1.5} color="#f5f5f7" />
          <directionalLight position={[-5, -4, -2]} intensity={0.9} color="#dfc070" />
          <pointLight position={[0, 0, 0]} intensity={2.2} color="#dfc070" distance={5} />
          
          <ArchitectureCluster />
        </Canvas>
      </CanvasErrorBoundary>

      <div className="scene-interactive-hint">
        <span className="hint-indicator"></span>
        <span className="hint-text">Systems Architecture Topology</span>
      </div>
    </div>
  );
};
export default NetworkScene3D;
