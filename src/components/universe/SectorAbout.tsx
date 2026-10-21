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

  // Load portrait texture from public folder
  const portraitTexture = useTexture('/images/ramesh-profile.png');

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Gentle hover levitation on the portal
    if (portalFrameRef.current) {
      portalFrameRef.current.position.y = 0.5 + Math.sin(t * 1.2) * 0.06;
      // Responsive pointer parallax rotation
      const targetRotY = state.pointer.x * 0.15;
      const targetRotX = -state.pointer.y * 0.1;
      portalFrameRef.current.rotation.y = THREE.MathUtils.damp(
        portalFrameRef.current.rotation.y,
        targetRotY,
        2.8,
        delta
      );
      portalFrameRef.current.rotation.x = THREE.MathUtils.damp(
        portalFrameRef.current.rotation.x,
        targetRotX,
        2.8,
        delta
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    // Positioned at X: 24.0 so it sits clearly in the right visual field beside the text card
    <group ref={groupRef} position={[24.0, 0, -3.5]}>
      {/* Warm dedicated spotlight on the identity monolith */}
      <spotLight
        position={[0, 4, 3.5]}
        target-position={[0, 0.5, 0]}
        color="#dfc070"
        intensity={4.0}
        angle={0.65}
        penumbra={0.5}
      />
      <pointLight position={[0, -0.5, 1.8]} color="#38bdf8" intensity={1.5} distance={6} />

      {/* Architectural Platform Base */}
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <cylinderGeometry args={[3.8, 4.2, 0.35, 32]} />
        <meshStandardMaterial
          color="#0f1218"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Floating Gold Perimeter Ring */}
      <mesh ref={ringRef} position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.0, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#795b16"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Platform Floor Grid */}
      <gridHelper
        args={[7, 14, '#dfc070', '#1e293b']}
        position={[0, -1.6, 0]}
      />

      {/* 4 Architectural Vertical Columns of Light */}
      {[
        [-2.8, 0, -2.2],
        [2.8, 0, -2.2],
        [-2.8, 0, 2.2],
        [2.8, 0, 2.2],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 4.8, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#115e79"
              emissiveIntensity={0.6}
              transparent
              opacity={0.65}
            />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#dfc070"
              emissive="#dfc070"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Monumental 3D Framed Holographic Portrait Monolith */}
      <group ref={portalFrameRef} position={[0, 0.5, 0]}>
        {/* Outer Gold Architectural Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 3.1, 0.12]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.95}
            roughness={0.15}
            emissive="#795b16"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Inner Dark Bezel */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[2.32, 2.92, 0.08]} />
          <meshStandardMaterial
            color="#080a0f"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* High-Resolution Portrait Texture Plane */}
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[2.2, 2.8]} />
          <meshBasicMaterial
            map={portraitTexture}
            toneMapped={false}
          />
        </mesh>

        {/* Ambient Holographic Glass Cover */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[2.2, 2.8]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            roughness={0.05}
            metalness={0.1}
            transmission={0.85}
            ior={1.4}
            color="#e0f2fe"
          />
        </mesh>

        {/* Gold Corner Accents */}
        {[
          [-1.25, 1.55, 0.08],
          [1.25, 1.55, 0.08],
          [-1.25, -1.55, 0.08],
          [1.25, -1.55, 0.08],
        ].map(([cx, cy, cz], i) => (
          <mesh key={i} position={[cx, cy, cz]}>
            <boxGeometry args={[0.16, 0.16, 0.1]} />
            <meshStandardMaterial
              color="#dfc070"
              metalness={0.9}
              roughness={0.1}
              emissive="#dfc070"
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
