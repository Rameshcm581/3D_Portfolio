import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SectorExperienceProps {
  isActive: boolean;
}

export function SectorExperience({ isActive: _isActive }: SectorExperienceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Glowing highway conduit rails
  const railGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [
      -7, -1.8, 0,
      7, -1.8, 0,
      -7, -1.8, -0.8,
      7, -1.8, -0.8,
      -7, -1.8, 0.8,
      7, -1.8, 0.8,
    ];
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Moving energy pulse along the timeline highway
    if (pulseRef.current) {
      pulseRef.current.position.x = ((t * 2.5) % 14) - 7;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[18, -17.8, -4]}>
      {/* Highway Foundation Rails */}
      <lineSegments geometry={railGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </lineSegments>

      {/* Traveling Energy Pulse on Rail */}
      <mesh ref={pulseRef} position={[-7, -1.8, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#dfc070"
          emissive="#dfc070"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Stepped Architectural Milestones for Younder Bots Contributions */}
      {[
        { x: -3.6, h: 1.6, label: 'Microservices & Gateway', color: '#dfc070' },
        { x: -1.8, h: 2.2, label: 'Lab Analyzer QC & Automation', color: '#10b981' },
        { x: 0, h: 2.8, label: 'Clinical & Hospital Workflows', color: '#dfc070' },
        { x: 1.8, h: 2.2, label: 'RBAC, JWT & Audit Trails', color: '#38bdf8' },
        { x: 3.6, h: 1.6, label: 'AI Support & Local LLMs', color: '#a855f7' },
      ].map((milestone, idx) => (
        <group key={idx} position={[milestone.x, 0, 0]}>
          {/* Stepped Architectural Monolith */}
          <mesh position={[0, milestone.h / 2 - 1.8, 0]}>
            <boxGeometry args={[1.1, milestone.h, 0.8]} />
            <meshStandardMaterial
              color="#0d111a"
              metalness={0.9}
              roughness={0.2}
              emissive={milestone.color}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Glowing Edge Wireframe */}
          <lineSegments position={[0, milestone.h / 2 - 1.8, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.12, milestone.h + 0.02, 0.82)]} />
            <lineBasicMaterial color={milestone.color} />
          </lineSegments>

          {/* Summit Indicator Node */}
          <mesh position={[0, milestone.h - 1.8 + 0.15, 0]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color={milestone.color}
              emissive={milestone.color}
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient soft spotlight on the timeline */}
      <pointLight color="#dfc070" intensity={2} distance={8} position={[0, 2, 2]} />
    </group>
  );
}
