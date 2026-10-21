import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SECTORS, PROJECT_CAMERA_TARGETS, type SectorId } from '../../types/universe';

interface CameraRigProps {
  activeSectorId: SectorId;
  selectedProjectId: string | null;
  reducedMotion: boolean;
  onCoordinatesUpdate?: (coords: [number, number, number]) => void;
}

export function CameraRig({
  activeSectorId,
  selectedProjectId,
  reducedMotion,
  onCoordinatesUpdate,
}: CameraRigProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const coordThrottle = useRef(0);

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];

  useFrame((state, delta) => {
    let targetPos = new THREE.Vector3(...activeSector.cameraPosition);
    let targetLookAt = new THREE.Vector3(...activeSector.cameraTarget);

    // If an installation is selected within the Projects exhibition, zoom in to focus on it!
    if (activeSectorId === 'projects' && selectedProjectId && PROJECT_CAMERA_TARGETS[selectedProjectId]) {
      const projTarget = PROJECT_CAMERA_TARGETS[selectedProjectId];
      targetPos = new THREE.Vector3(...projTarget.position);
      targetLookAt = new THREE.Vector3(...projTarget.target);
    }

    if (reducedMotion) {
      // In reduced motion mode, instantly jump or do a very rapid short ease
      camera.position.copy(targetPos);
      currentLookAt.current.copy(targetLookAt);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // Organic subtle pointer parallax
    const parallaxX = state.pointer.x * 0.35;
    const parallaxY = state.pointer.y * 0.25;

    const desiredCamPos = new THREE.Vector3(
      targetPos.x + parallaxX,
      targetPos.y + parallaxY,
      targetPos.z
    );

    // Smoothly interpolate camera position using damp
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCamPos.x, 2.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCamPos.y, 2.6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCamPos.z, 2.6, delta);

    // Smoothly interpolate lookAt target
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.x, 3.0, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.y, 3.0, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.z, 3.0, delta);

    camera.lookAt(currentLookAt.current);

    // Throttle coordinate reporting
    coordThrottle.current += delta;
    if (coordThrottle.current > 0.15) {
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
