import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorContactProps {
  isActive: boolean;
}

export function SectorContact({ isActive: _isActive }: SectorContactProps) {
  const beaconRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Radiating conduit lines from beacon to satellite targets
  const conduitGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];

    const satellites = [
      [-2.4, 0.4, 1.2],
      [-1.0, 1.4, -1.8],
      [1.0, 1.4, -1.8],
      [2.4, 0.4, 1.2],
    ];

    satellites.forEach(([x, y, z]) => {
      points.push(0, 0, 0);
      points.push(x * 0.5, y * 0.5, z * 0.5);
      points.push(x * 0.5, y * 0.5, z * 0.5);
      points.push(x, y, z);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }

    if (beamRef.current) {
      // Subtle pulse in the beacon transmission beam
      const pulse = 1 + Math.sin(t * 3) * 0.1;
      beamRef.current.scale.set(pulse, 1, pulse);
    }

    if (beaconRef.current) {
      beaconRef.current.rotation.y = Math.sin(t * 0.25) * 0.1;
    }
  });

  return (
    <group ref={beaconRef} position={[0, -29, 0]}>
      {/* Platform Base */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[3.2, 3.6, 0.25, 32]} />
        <meshStandardMaterial color="#0c1017" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Orbiting Quantum Wave Ring */}
      <mesh ref={ringRef} position={[0, -1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.025, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Central Quantum Transmission Core */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#dfc070"
          metalness={0.9}
          roughness={0.2}
          emissive="#c5a059"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Vertical Transmission Light Beam */}
      <mesh ref={beamRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 5, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>

      {/* Outward Radiating Conduits */}
      <lineSegments geometry={conduitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </lineSegments>

      {/* 4 Professional Connection Terminals */}
      {[
        { pos: [-2.4, 0.4, 1.2], label: 'EMAIL', color: '#dfc070' },
        { pos: [-1.0, 1.4, -1.8], label: 'GITHUB', color: '#38bdf8' },
        { pos: [1.0, 1.4, -1.8], label: 'LINKEDIN', color: '#38bdf8' },
        { pos: [2.4, 0.4, 1.2], label: 'RESUME', color: '#dfc070' },
      ].map((sat, i) => (
        <group key={i} position={sat.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color={sat.color}
              emissive={sat.color}
              emissiveIntensity={0.7}
              metalness={0.8}
            />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.3, 0.015, 8, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
