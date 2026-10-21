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

export function SectorSkills({
  isActive: _isActive,
  selectedDomain,
  onSelectDomain,
}: SectorSkillsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const packetsRef = useRef<THREE.Points>(null);

  // Position relative to Sector center [0, 22, -6]
  const clusterNodes: (SkillDomainNode & { relPos: [number, number, number] })[] = useMemo(() => [
    {
      ...SKILL_DOMAINS[0], // backend
      relPos: [0, 0.4, 0],
    },
    {
      ...SKILL_DOMAINS[1], // languages
      relPos: [-3.4, 1.6, 0.8],
    },
    {
      ...SKILL_DOMAINS[2], // databases
      relPos: [3.4, 1.4, -0.6],
    },
    {
      ...SKILL_DOMAINS[3], // automation
      relPos: [-2.6, -1.6, -1.0],
    },
    {
      ...SKILL_DOMAINS[4], // ai
      relPos: [-4.2, 0.2, -1.2],
    },
    {
      ...SKILL_DOMAINS[5], // devops
      relPos: [2.8, -1.5, 1.0],
    },
    {
      ...SKILL_DOMAINS[6], // frontend
      relPos: [4.4, 0.2, 1.2],
    },
    {
      ...SKILL_DOMAINS[7], // integrations
      relPos: [1.2, -2.2, -1.6],
    },
  ], []);

  // Compute connections between relative positions
  const { lineGeometry, pairs } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const nodeMap = new Map<string, typeof clusterNodes[0]>();
    clusterNodes.forEach((n) => nodeMap.set(n.id, n));

    const connPairs: [typeof clusterNodes[0], typeof clusterNodes[0]][] = [];
    const added = new Set<string>();

    clusterNodes.forEach((node) => {
      node.connections.forEach((tId) => {
        const target = nodeMap.get(tId);
        if (target) {
          const key = [node.id, target.id].sort().join('--');
          if (!added.has(key)) {
            added.add(key);
            connPairs.push([node, target]);
            positions.push(...node.relPos);
            positions.push(...target.relPos);
          }
        }
      });
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return { lineGeometry: geo, pairs: connPairs };
  }, [clusterNodes]);

  const pulseCount = 32;
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      // Gentle orbital wobble
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.06;
    }

    if (packetsRef.current && pairs.length > 0) {
      const attr = packetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < pulseCount; i++) {
        const pairIdx = i % pairs.length;
        const [fromNode, toNode] = pairs[pairIdx];
        const progress = (t * 0.75 + i * (1 / pulseCount)) % 1;

        arr[i * 3] = THREE.MathUtils.lerp(fromNode.relPos[0], toNode.relPos[0], progress);
        arr[i * 3 + 1] = THREE.MathUtils.lerp(fromNode.relPos[1], toNode.relPos[1], progress);
        arr[i * 3 + 2] = THREE.MathUtils.lerp(fromNode.relPos[2], toNode.relPos[2], progress);
      }

      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 22, -6]}>
      {/* Network Connection Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </lineSegments>

      {/* Traveling Network Pulses */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#dfc070"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Interactive Skill Domain Cluster Hubs */}
      {clusterNodes.map((node) => {
        const isSelected = selectedDomain === node.id;
        const isBackend = node.id === 'backend';

        return (
          <group
            key={node.id}
            position={node.relPos}
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onSelectDomain(node.id);
            }}
          >
            {/* Main Polyhedral Hub */}
            <mesh scale={isSelected ? 1.35 : 1.0}>
              {isBackend ? (
                <octahedronGeometry args={[0.55, 0]} />
              ) : (
                <dodecahedronGeometry args={[0.42, 0]} />
              )}
              <meshStandardMaterial
                color={isSelected ? '#dfc070' : node.color}
                emissive={isSelected ? '#dfc070' : node.color}
                emissiveIntensity={isSelected ? 0.8 : 0.25}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>

            {/* Orbital Rings around selected or core hub */}
            {(isSelected || isBackend) && (
              <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.75, 0.02, 16, 32]} />
                <meshBasicMaterial color={isSelected ? '#dfc070' : '#38bdf8'} />
              </mesh>
            )}

            {/* Satellite Node Orbiters */}
            {[
              [0.6, 0.3, 0],
              [-0.5, -0.4, 0.3],
              [0.2, 0.6, -0.4],
            ].map(([sx, sy, sz], sIdx) => (
              <mesh key={sIdx} position={[sx, sy, sz]} scale={isSelected ? 1.2 : 0.8}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial
                  color={isSelected ? '#dfc070' : '#38bdf8'}
                  emissive={isSelected ? '#dfc070' : '#0284c7'}
                  emissiveIntensity={0.5}
                />
              </mesh>
            ))}

            {/* Subtle Point Light for active domain */}
            {isSelected && (
              <pointLight color="#dfc070" intensity={2.5} distance={5} />
            )}
          </group>
        );
      })}
    </group>
  );
}
