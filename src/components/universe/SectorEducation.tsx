import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorEducationProps {
  isActive: boolean;
}

export function SectorEducation({ isActive: _isActive }: SectorEducationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[-16, -16, 0]}>
      {/* Calm Architectural Sanctuary Base */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[3.8, 4.2, 0.3, 32]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Embedded Gold Compass Ring */}
      <mesh ref={ringRef} position={[0, -1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#634b12"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 3 Spatial Credential Tablets: B.E. Degree, Certifications, Leadership */}
      {[
        { x: -2.2, z: -0.8, color: '#dfc070', height: 2.2 },
        { x: 0, z: -1.4, color: '#38bdf8', height: 2.6 },
        { x: 2.2, z: -0.8, color: '#dfc070', height: 2.2 },
      ].map((tablet, i) => (
        <group key={i} position={[tablet.x, 0, tablet.z]}>
          {/* Glass / Graphite Monolith */}
          <mesh position={[0, tablet.height / 2 - 1.2, 0]}>
            <boxGeometry args={[1.4, tablet.height, 0.08]} />
            <meshStandardMaterial
              color="#0f131a"
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>

          {/* Glowing Edge Accent */}
          <lineSegments position={[0, tablet.height / 2 - 1.2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.42, tablet.height + 0.02, 0.1)]} />
            <lineBasicMaterial color={tablet.color} transparent opacity={0.6} />
          </lineSegments>

          {/* Floating Emblem Node above tablet */}
          <mesh position={[0, tablet.height - 0.7, 0]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color={tablet.color} emissive={tablet.color} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
