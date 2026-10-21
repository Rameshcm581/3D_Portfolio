import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorExperienceProps {
  isActive: boolean;
}

export function SectorExperience({ isActive: _isActive }: SectorExperienceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Glowing conduit rails
  const railGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [
      -6, -1.8, 0,
      6, -1.8, 0,
      -6, -1.8, -0.6,
      6, -1.8, -0.6,
      -6, -1.8, 0.6,
      6, -1.8, 0.6,
    ];
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Moving energy pulse along the journey highway
    if (pulseRef.current) {
      pulseRef.current.position.x = ((t * 2.2) % 12) - 6;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[16, -15, 0]}>
      {/* Highway Foundation Rails */}
      <lineSegments geometry={railGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </lineSegments>

      {/* Traveling Energy Pulse on Rail */}
      <mesh ref={pulseRef} position={[-6, -1.8, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#dfc070"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* PRIMARY MILESTONE 1: Younder Bots (Mar 2025 – Present) */}
      <group position={[1.5, 0, 0]}>
        {/* Main Monolith Base */}
        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[2.2, 1.8, 1.2]} />
          <meshStandardMaterial
            color="#0f141d"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Gold Trim Outline */}
        <lineSegments position={[0, -0.9, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(2.22, 1.82, 1.22)]} />
          <lineBasicMaterial color="#dfc070" />
        </lineSegments>

        {/* Floating Enterprise Core Prism */}
        <mesh position={[0, 0.8, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.9}
            roughness={0.2}
            emissive="#795b16"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Orbiting Service Beacon Rings */}
        <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.9, 0.02, 16, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>

        {/* 4 Laboratory Analyzer Service Satellites */}
        {[
          [-0.8, 1.4, 0.6],
          [0.8, 1.4, 0.6],
          [-0.8, 1.4, -0.6],
          [0.8, 1.4, -0.6],
        ].map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>

      {/* MILESTONE 0: Academic & Pre-Production Platform */}
      <group position={[-3.8, -0.6, 0]}>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.6, 1.0, 1.0]} />
          <meshStandardMaterial color="#0c0e14" metalness={0.7} roughness={0.4} />
        </mesh>
        <lineSegments position={[0, -0.7, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.62, 1.02, 1.02)]} />
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </lineSegments>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#848e9c" wireframe />
        </mesh>
      </group>
    </group>
  );
}
