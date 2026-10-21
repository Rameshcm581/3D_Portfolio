import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DeepSpaceBackgroundProps {
  particleCount?: number;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function DeepSpaceBackground({ particleCount = 1200 }: DeepSpaceBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Distant Star Field
  const [starPositions, starColors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color('#dfc070');
    const cyanColor = new THREE.Color('#38bdf8');
    const whiteColor = new THREE.Color('#ffffff');
    const dimColor = new THREE.Color('#4a5568');

    let seed = 42;
    for (let i = 0; i < particleCount; i++) {
      const x = (pseudoRandom(seed++) - 0.5) * 160;
      const y = (pseudoRandom(seed++) - 0.5) * 120;
      const z = (pseudoRandom(seed++) - 0.5) * 90;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const rand = pseudoRandom(seed++);
      let c = dimColor;
      if (rand > 0.85) c = goldColor;
      else if (rand > 0.70) c = cyanColor;
      else if (rand > 0.40) c = whiteColor;

      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [pos, cols];
  }, [particleCount]);

  // Ambient Floating Dust Motes
  const dustCount = 350;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    let seed = 999;
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (pseudoRandom(seed++) - 0.5) * 60;
      pos[i * 3 + 1] = (pseudoRandom(seed++) - 0.5) * 70;
      pos[i * 3 + 2] = (pseudoRandom(seed++) - 0.5) * 35;
    }
    return pos;
  }, [dustCount]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012;
      pointsRef.current.rotation.x += delta * 0.005;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y -= delta * 0.018;
      dustRef.current.rotation.z += delta * 0.008;
    }
  });

  return (
    <group>
      {/* Distant Star Constellations */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Foreground Ambient Dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#38bdf8"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
