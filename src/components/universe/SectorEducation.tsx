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
      ringRef.current.rotation.z += delta * 0.08;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[-18, -19.8, -4]}>
      {/* Calm Architectural Sanctuary Base */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[4.2, 4.6, 0.3, 32]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Embedded Gold Compass Ring */}
      <mesh ref={ringRef} position={[0, -1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#634b12"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 3 Spatial Credential Tablets: B.E. Degree, Certifications, Leadership */}
      {[
        { x: -2.4, z: -0.6, color: '#dfc070', height: 2.4, label: 'Degree' },
        { x: 0, z: -1.2, color: '#38bdf8', height: 2.8, label: 'Certifications' },
        { x: 2.4, z: -0.6, color: '#dfc070', height: 2.4, label: 'Leadership' },
      ].map((tablet, i) => (
        <group key={i} position={[tablet.x, 0, tablet.z]}>
          {/* Glass / Graphite Monolith */}
          <mesh position={[0, tablet.height / 2 - 1.2, 0]}>
            <boxGeometry args={[1.5, tablet.height, 0.08]} />
            <meshStandardMaterial
              color="#0e131b"
              metalness={0.9}
              roughness={0.15}
              emissive={tablet.color}
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Glowing Edge Wireframe */}
          <lineSegments position={[0, tablet.height / 2 - 1.2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.52, tablet.height + 0.02, 0.1)]} />
            <lineBasicMaterial color={tablet.color} transparent opacity={0.65} />
          </lineSegments>

          {/* Crown Jewel Floating Above */}
          <mesh position={[0, tablet.height - 1.2 + 0.25, 0]}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial
              color={tablet.color}
              emissive={tablet.color}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Calm Ambient Lighting */}
      <pointLight color="#dfc070" intensity={1.8} distance={7} position={[0, 1.5, 2]} />
    </group>
  );
}
