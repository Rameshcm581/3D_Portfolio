import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorContactProps {
  isActive: boolean;
}

export function SectorContact({ isActive: _isActive }: SectorContactProps) {
  const beaconRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Radiating conduits to 4 satellites
  const conduitGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];

    const satellites = [
      [-2.6, 0.4, 1.2],
      [-1.2, 1.4, -2.0],
      [1.2, 1.4, -2.0],
      [2.6, 0.4, 1.2],
    ];

    satellites.forEach(([x, y, z]) => {
      points.push(0, 0.2, 0);
      points.push(x * 0.5, y * 0.5, z * 0.5);
      points.push(x * 0.5, y * 0.5, z * 0.5);
      points.push(x, y, z);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.18;
    }

    if (beamRef.current) {
      const pulse = 1 + Math.sin(t * 3.5) * 0.12;
      beamRef.current.scale.set(pulse, 1, pulse);
    }

    if (beaconRef.current) {
      beaconRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <group ref={beaconRef} position={[0, -33.8, -4]}>
      {/* Platform Foundation */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[3.6, 4.0, 0.3, 32]} />
        <meshStandardMaterial color="#0c1017" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Outer Gold Transmitter Ring */}
      <mesh ref={ring1Ref} position={[0, -1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#795b16"
          emissiveIntensity={0.6}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Cyan Circuit Ring */}
      <mesh ref={ring2Ref} position={[0, -1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.025, 16, 48]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Central Beacon Pylon */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.55, 3.4, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Vertical Ascending Light Beam */}
      <mesh ref={beamRef} position={[0, 4.0, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 7.0, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>

      {/* Radiating Energy Conduits */}
      <lineSegments geometry={conduitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </lineSegments>

      {/* 4 Satellite Relay Terminals (Email, GitHub, LinkedIn, Signal) */}
      {[
        [-2.6, 0.4, 1.2],
        [-1.2, 1.4, -2.0],
        [1.2, 1.4, -2.0],
        [2.6, 0.4, 1.2],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#dfc070' : '#38bdf8'}
              emissive={idx % 2 === 0 ? '#dfc070' : '#0284c7'}
              emissiveIntensity={0.6}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* High-intensity beacon flare */}
      <pointLight color="#dfc070" intensity={3.5} distance={10} position={[0, 2, 1]} />
    </group>
  );
}
