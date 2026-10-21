import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorCoreProps {
  isActive: boolean;
}

export function SectorCore({ isActive: _isActive }: SectorCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerLatticeRef = useRef<THREE.LineSegments>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.Points>(null);

  // Geometric polyhedral wireframe lattice
  const latticeGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.6, 1);
    return new THREE.WireframeGeometry(geo);
  }, []);

  // Data Conduit Network branching outwards from the core
  const conduitGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];

    // 8 primary architectural conduits
    const branches = [
      [2.8, 1.2, 0.8],
      [-2.6, 1.5, -0.6],
      [2.2, -1.8, 1.2],
      [-2.4, -1.4, -1.0],
      [0.8, 2.8, -1.2],
      [-1.0, 2.6, 1.4],
      [1.4, -2.5, -1.5],
      [-1.2, -2.7, 1.2],
    ];

    branches.forEach(([x, y, z]) => {
      // Core origin to elbow
      points.push(0, 0, 0);
      points.push(x * 0.5, y * 0.5, z * 0.5);

      // Elbow to service node
      points.push(x * 0.5, y * 0.5, z * 0.5);
      points.push(x, y, z);

      // Node ring terminal
      points.push(x, y, z);
      points.push(x * 1.25, y * 1.25, z * 1.25);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  // Data packets traveling along conduits
  const packetCount = 32;
  const packetPositions = useMemo(() => new Float32Array(packetCount * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Gentle core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x += delta * 0.25;
    }

    if (outerLatticeRef.current) {
      outerLatticeRef.current.rotation.y -= delta * 0.2;
      outerLatticeRef.current.rotation.z += delta * 0.15;
    }

    // Gyroscopic orbital rings counter-rotating
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.35;
      ring1Ref.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.45;
      ring2Ref.current.rotation.z = Math.cos(t * 0.3) * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.3;
      ring3Ref.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }

    // Animate data flow packets pulsing along conduits
    if (packetsRef.current) {
      const branches = [
        [2.8, 1.2, 0.8],
        [-2.6, 1.5, -0.6],
        [2.2, -1.8, 1.2],
        [-2.4, -1.4, -1.0],
        [0.8, 2.8, -1.2],
        [-1.0, 2.6, 1.4],
        [1.4, -2.5, -1.5],
        [-1.2, -2.7, 1.2],
      ];

      const attr = packetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < packetCount; i++) {
        const branchIdx = i % branches.length;
        const [bx, by, bz] = branches[branchIdx];
        const progress = (t * 0.6 + i * (1 / packetCount)) % 1;

        arr[i * 3] = bx * progress;
        arr[i * 3 + 1] = by * progress;
        arr[i * 3 + 2] = bz * progress;
      }
      attr.needsUpdate = true;
    }

    // Subtle pointer parallax tilt on the whole core
    if (groupRef.current) {
      const targetRotX = state.pointer.y * 0.2;
      const targetRotY = state.pointer.x * 0.25;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3.0, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3.0, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central High-Tech Inner Polyhedral Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#795b16"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Floating Outer Icosahedral Lattice Cage */}
      <lineSegments ref={outerLatticeRef} geometry={latticeGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </lineSegments>

      {/* Gyroscopic Orbital Rings */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#dfc070" transparent opacity={0.8} />
        </mesh>
      </group>

      <group ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.9, 0.018, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>
      </group>

      <group ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[3.3, 0.015, 16, 100]} />
          <meshBasicMaterial color="#848e9c" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Branching Architectural Conduits */}
      <lineSegments geometry={conduitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </lineSegments>

      {/* Flowing Data Packet Pulses */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[packetPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Service Nodes at branch terminals */}
      {[
        [2.8, 1.2, 0.8],
        [-2.6, 1.5, -0.6],
        [2.2, -1.8, 1.2],
        [-2.4, -1.4, -1.0],
        [0.8, 2.8, -1.2],
        [-1.0, 2.6, 1.4],
        [1.4, -2.5, -1.5],
        [-1.2, -2.7, 1.2],
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#dfc070' : '#38bdf8'}
            emissive={idx % 2 === 0 ? '#634b12' : '#0e5f80'}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}
