import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorCoreProps {
  isActive: boolean;
}

export function SectorCore({ isActive: _isActive }: SectorCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const crystalShellRef = useRef<THREE.LineSegments>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.Points>(null);

  // Procedural 8-branch architectural pipeline conduits
  const { conduitGeometry, branches } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];

    const branchVectors = [
      [3.4, 1.4, 0.6],
      [-3.2, 1.6, -0.8],
      [2.8, -2.0, 1.0],
      [-3.0, -1.8, -0.9],
      [1.0, 3.2, -1.0],
      [-1.2, 3.0, 1.2],
      [1.8, -3.0, -1.2],
      [-1.6, -3.2, 1.0],
    ];

    branchVectors.forEach(([x, y, z]) => {
      // Core origin to mid-elbow
      points.push(0, 0, 0);
      points.push(x * 0.45, y * 0.45, z * 0.45);

      // Mid-elbow to substation junction
      points.push(x * 0.45, y * 0.45, z * 0.45);
      points.push(x * 0.85, y * 0.85, z * 0.85);

      // Substation junction to terminal node
      points.push(x * 0.85, y * 0.85, z * 0.85);
      points.push(x, y, z);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return { conduitGeometry: geo, branches: branchVectors };
  }, []);

  // Outer faceted crystalline lattice
  const crystalShellGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.0, 1);
    return new THREE.WireframeGeometry(geo);
  }, []);

  // Traveling data packets along the conduits
  const packetCount = 48;
  const packetPositions = useMemo(() => new Float32Array(packetCount * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Slow, powerful core rotation
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y += delta * 0.35;
      nucleusRef.current.rotation.x += delta * 0.2;
    }

    if (crystalShellRef.current) {
      crystalShellRef.current.rotation.y -= delta * 0.18;
      crystalShellRef.current.rotation.z += delta * 0.12;
    }

    // Concentric precision orbital gimbal rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.28;
      ring1Ref.current.rotation.x = Math.sin(t * 0.3) * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.36;
      ring2Ref.current.rotation.z = Math.cos(t * 0.25) * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.22;
      ring3Ref.current.rotation.y = Math.sin(t * 0.4) * 0.4;
    }

    // Animate data flow packets pulsing along conduits
    if (packetsRef.current) {
      const attr = packetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < packetCount; i++) {
        const branchIdx = i % branches.length;
        const [bx, by, bz] = branches[branchIdx];
        const progress = (t * 0.85 + i * (1 / packetCount)) % 1;

        arr[i * 3] = bx * progress;
        arr[i * 3 + 1] = by * progress;
        arr[i * 3 + 2] = bz * progress;
      }

      attr.needsUpdate = true;
    }

    // Gentle levitation of the entire core structure
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. CENTRAL NUCLEUS - Multi-faceted Compute Core */}
      <mesh ref={nucleusRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#b8933b"
          emissiveIntensity={0.65}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* 2. INNER GLOW SPHERE */}
      <mesh>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>

      {/* 3. CRYSTALLINE WIREFRAME ARMOR SHELL */}
      <lineSegments ref={crystalShellRef} geometry={crystalShellGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </lineSegments>

      {/* 4. GIMBAL RING 1 - Inner Golden Ring */}
      <group ref={ring1Ref}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.5, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.95}
            roughness={0.1}
            emissive="#dfc070"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* 5. GIMBAL RING 2 - Middle Cyan Circuit Ring */}
      <group ref={ring2Ref}>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 6]}>
          <torusGeometry args={[2.9, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.9}
            roughness={0.15}
            emissive="#0284c7"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* 6. GIMBAL RING 3 - Outer Architectural Segmented Perimeter */}
      <group ref={ring3Ref}>
        <mesh rotation={[Math.PI / 6, Math.PI / 3, 0]}>
          <torusGeometry args={[3.3, 0.035, 16, 64]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.9}
            roughness={0.2}
            emissive="#b8933b"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* 7. ARCHITECTURAL DATA CONDUIT NETWORK (8 radial pipes) */}
      <lineSegments geometry={conduitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </lineSegments>

      {/* 8. TERMINAL SERVICE NODES & DATABASE STORAGE CYLINDERS */}
      {branches.map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          {/* Microservice Container Node */}
          <mesh>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#dfc070' : '#38bdf8'}
              metalness={0.8}
              roughness={0.2}
              emissive={idx % 2 === 0 ? '#795b16' : '#0369a1'}
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Database Disk Cylinder for DB pipelines */}
          {idx % 3 === 0 && (
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.22, 16]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.9}
                roughness={0.1}
                emissive="#38bdf8"
                emissiveIntensity={0.3}
              />
            </mesh>
          )}

          {/* Substation Beacon Dot */}
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* 9. TRAVELING DATA PACKETS */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[packetPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#38bdf8"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 10. POINT LIGHT EMITTED FROM THE CORE */}
      <pointLight color="#dfc070" intensity={3.5} distance={12} />
      <pointLight color="#38bdf8" intensity={2.0} distance={9} />
    </group>
  );
}
