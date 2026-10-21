import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKILL_DOMAINS, type SkillDomainNode } from '../../data/universeData';
import { sound } from './SoundSystem';

interface SectorSkillsProps {
  isActive: boolean;
  selectedDomain: string | null;
  onSelectDomain: (id: string) => void;
}

export function SectorSkills({ isActive: _isActive, selectedDomain, onSelectDomain }: SectorSkillsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.Points>(null);

  // Network connection lines between related skill nodes
  const { lineGeometry, pairs } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const nodeMap = new Map<string, SkillDomainNode>();
    SKILL_DOMAINS.forEach((d) => nodeMap.set(d.id, d));

    const connPairs: [SkillDomainNode, SkillDomainNode][] = [];
    const addedPairs = new Set<string>();

    SKILL_DOMAINS.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodeMap.get(targetId);
        if (target) {
          const key = [node.id, target.id].sort().join('--');
          if (!addedPairs.has(key)) {
            addedPairs.add(key);
            connPairs.push([node, target]);
            positions.push(...node.position);
            positions.push(...target.position);
          }
        }
      });
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return { lineGeometry: geo, pairs: connPairs };
  }, []);

  // Traveling pulses along network lines
  const pulseCount = 24;
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      // Gentle orbital wobble
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.08;
    }

    if (packetsRef.current && pairs.length > 0) {
      const attr = packetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < pulseCount; i++) {
        const pairIdx = i % pairs.length;
        const [fromNode, toNode] = pairs[pairIdx];
        const progress = (t * 0.7 + i * (1 / pulseCount)) % 1;

        arr[i * 3] = THREE.MathUtils.lerp(fromNode.position[0], toNode.position[0], progress);
        arr[i * 3 + 1] = THREE.MathUtils.lerp(fromNode.position[1], toNode.position[1], progress);
        arr[i * 3 + 2] = THREE.MathUtils.lerp(fromNode.position[2], toNode.position[2], progress);
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Network Connection Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
        />
      </lineSegments>

      {/* Network Data Pulses */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#dfc070"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Interactive System Domain Nodes */}
      {SKILL_DOMAINS.map((domain) => {
        const isSelected = selectedDomain === domain.id;
        const isConnected = selectedDomain
          ? domain.id === selectedDomain ||
            domain.connections.includes(selectedDomain) ||
            SKILL_DOMAINS.find((d) => d.id === selectedDomain)?.connections.includes(domain.id)
          : true;

        return (
          <group
            key={domain.id}
            position={domain.position}
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onSelectDomain(domain.id);
            }}
          >
            {/* Core Node Polyhedron */}
            <mesh scale={isSelected ? 1.4 : 1.0}>
              <octahedronGeometry args={[0.38, 0]} />
              <meshStandardMaterial
                color={isSelected ? '#dfc070' : domain.color}
                emissive={isSelected ? '#c5a059' : domain.color}
                emissiveIntensity={isSelected ? 0.9 : isConnected ? 0.4 : 0.15}
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>

            {/* Orbiting Ring Indicator */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.62, 0.015, 8, 32]} />
              <meshBasicMaterial
                color={isSelected ? '#ffffff' : domain.color}
                transparent
                opacity={isSelected ? 0.9 : 0.4}
              />
            </mesh>

            {/* Vertical Anchor Laser */}
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 1.2, 4]} />
              <meshBasicMaterial
                color={domain.color}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
