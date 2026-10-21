import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SECTORS, type SectorId } from '../../types/universe';

interface SceneLightingProps {
  activeSectorId: SectorId;
}

export function SceneLighting({ activeSectorId }: SceneLightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const cyanPointRef = useRef<THREE.PointLight>(null);

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];

  useFrame((state, delta) => {
    // Dynamic orbiting accent light
    const t = state.clock.elapsedTime;
    if (cyanPointRef.current) {
      cyanPointRef.current.position.x = activeSector.cameraTarget[0] + Math.cos(t * 0.8) * 6;
      cyanPointRef.current.position.y = activeSector.cameraTarget[1] + Math.sin(t * 0.6) * 4;
      cyanPointRef.current.position.z = activeSector.cameraTarget[2] + Math.sin(t * 0.8) * 5;
    }

    if (dirLightRef.current) {
      const targetPos = new THREE.Vector3(...activeSector.cameraTarget);
      dirLightRef.current.target.position.lerp(targetPos, delta * 3);
      dirLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      {/* Base ambient lighting */}
      <ambientLight intensity={0.45} color={activeSector.ambientColor} />

      {/* Primary Key Light - Warm Gold & Editorial White */}
      <directionalLight
        ref={dirLightRef}
        position={[15, 20, 15]}
        intensity={1.2}
        color="#fff4e0"
      />

      {/* Muted Gold Accent Light */}
      <pointLight
        ref={pointLightRef}
        position={[activeSector.cameraTarget[0] - 4, activeSector.cameraTarget[1] + 5, activeSector.cameraTarget[2] + 4]}
        intensity={1.6}
        distance={25}
        color="#dfc070"
      />

      {/* Restrained Cyan Technical Accent */}
      <pointLight
        ref={cyanPointRef}
        position={[activeSector.cameraTarget[0] + 5, activeSector.cameraTarget[1] - 3, activeSector.cameraTarget[2] + 4]}
        intensity={1.8}
        distance={28}
        color="#38bdf8"
      />

      {/* Deep Rim Fill */}
      <directionalLight
        position={[-12, -8, -10]}
        intensity={0.5}
        color="#1e293b"
      />
    </>
  );
}
