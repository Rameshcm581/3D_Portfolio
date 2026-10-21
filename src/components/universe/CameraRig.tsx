import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SECTORS, type SectorId } from '../../types/universe';

interface CameraRigProps {
  activeSectorId: SectorId;
  reducedMotion: boolean;
  onCoordinatesUpdate?: (coords: [number, number, number]) => void;
}

export function CameraRig({ activeSectorId, reducedMotion, onCoordinatesUpdate }: CameraRigProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const coordThrottle = useRef(0);

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];

  useFrame((state, delta) => {
    const targetPos = new THREE.Vector3(...activeSector.cameraPosition);
    const targetLookAt = new THREE.Vector3(...activeSector.cameraTarget);

    if (reducedMotion) {
      // In reduced motion mode, instantly jump or do a very rapid short ease
      camera.position.copy(targetPos);
      currentLookAt.current.copy(targetLookAt);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // Organic pointer parallax (subtle offset based on mouse pointer position)
    const parallaxX = state.pointer.x * 0.45;
    const parallaxY = state.pointer.y * 0.35;

    const desiredCamPos = new THREE.Vector3(
      targetPos.x + parallaxX,
      targetPos.y + parallaxY,
      targetPos.z
    );

    // Smoothly interpolate camera position using damp
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCamPos.x, 2.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCamPos.y, 2.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCamPos.z, 2.8, delta);

    // Smoothly interpolate lookAt target
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.x, 3.2, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.y, 3.2, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.z, 3.2, delta);

    camera.lookAt(currentLookAt.current);

    // Throttle coordinate reporting to HUD for telemetry display
    coordThrottle.current += delta;
    if (coordThrottle.current > 0.1) {
      coordThrottle.current = 0;
      onCoordinatesUpdate?.([
        Math.round(camera.position.x * 10) / 10,
        Math.round(camera.position.y * 10) / 10,
        Math.round(camera.position.z * 10) / 10,
      ]);
    }
  });

  return null;
}
