import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface SectorAboutProps {
  isActive: boolean;
}

export function SectorAbout({ isActive: _isActive }: SectorAboutProps) {
  const groupRef = useRef<THREE.Group>(null);
  const portalFrameRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Load portrait texture
  const portraitTexture = useTexture('/images/ramesh-profile.png');

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Gentle hover levitation on the portal
    if (portalFrameRef.current) {
      portalFrameRef.current.position.y = 1.6 + Math.sin(t * 1.2) * 0.08;
      // Slight pointer responsive rotation
      const targetRotY = state.pointer.x * 0.15;
      portalFrameRef.current.rotation.y = THREE.MathUtils.damp(
        portalFrameRef.current.rotation.y,
        targetRotY,
        3.0,
        delta
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[18, 0, 0]}>
      {/* Architectural Platform Base */}
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.35, 32]} />
        <meshStandardMaterial
          color="#0f1218"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Floating Gold Perimeter Ring */}
      <mesh ref={ringRef} position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.4, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#795b16"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Grid line pattern on platform */}
      <gridHelper
        args={[8, 16, '#dfc070', '#1e293b']}
        position={[0, -1.6, 0]}
      />

      {/* 4 Architectural Vertical Columns of Light */}
      {[
        [-3.2, 0, -2.5],
        [3.2, 0, -2.5],
        [-3.2, 0, 2.5],
        [3.2, 0, 2.5],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 4.5, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#115e79"
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#dfc070"
              emissive="#dfc070"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Spatial 3D Framed Holographic Portrait */}
      <group ref={portalFrameRef} position={[0, 1.6, 0]}>
        {/* Outer Gold Architectural Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.5, 3.2, 0.08]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.9}
            roughness={0.25}
            emissive="#554010"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Inner Dark Bevel */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[2.35, 3.05, 0.08]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.5} />
        </mesh>

        {/* Portrait Canvas Plane */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[2.2, 2.9]} />
          <meshBasicMaterial
            map={portraitTexture}
            toneMapped={false}
          />
        </mesh>

        {/* Subtle Cyan Laser Scanning Horizon Bar */}
        <mesh position={[0, -1.5, 0.06]}>
          <boxGeometry args={[2.4, 0.02, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
}
