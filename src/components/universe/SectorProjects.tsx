import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from './SoundSystem';

interface SectorProjectsProps {
  isActive: boolean;
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export function SectorProjects({
  isActive: _isActive,
  selectedProjectId,
  onSelectProject,
}: SectorProjectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  const ragBeamRef = useRef<THREE.LineSegments>(null);
  const tumorBoxRef = useRef<THREE.LineSegments>(null);
  const microserviceRef = useRef<THREE.Group>(null);

  // Exhibit positions along spatial arc around [-24, 0, 0]
  const exhibits = [
    { id: 'sitewatch', offset: [-6.4, 0.4, 0.5] },
    { id: 'retail-management', offset: [-3.2, 0.2, 1.2] },
    { id: 'thirukural-rag', offset: [0, 0, 1.6] },
    { id: 'brain-tumor-detection', offset: [3.2, 0.2, 1.2] },
    { id: 'healthcare-management', offset: [6.4, 0.4, 0.5] },
  ];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // SiteWatch Radar sweep rotation
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.4;
    }

    // Retail scanner vertical laser sweep
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(t * 2.5) * 0.45;
    }

    // RAG vector pulses
    if (ragBeamRef.current) {
      ragBeamRef.current.rotation.y += delta * 0.5;
    }

    // Brain tumor bounding box subtle pulse
    if (tumorBoxRef.current) {
      const scale = 1 + Math.sin(t * 3.5) * 0.05;
      tumorBoxRef.current.scale.set(scale, scale, scale);
    }

    // Enterprise microservice satellite cluster orbit
    if (microserviceRef.current) {
      microserviceRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={[-24, 1.5, 0]}>
      {/* Curved Gallery Architectural Deck */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[8.8, 9.2, 0.25, 48, 1, false, -Math.PI / 3, (2 * Math.PI) / 3]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 5 Distinct Spatial Exhibits */}

      {/* EXHIBIT 0: SITEWATCH - Uptime Radar, Timeline, Alert Beacon */}
      <group
        position={exhibits[0].offset as [number, number, number]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('sitewatch');
        }}
      >
        {/* Pedestal */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.9, 1.0, 0.6, 24]} />
          <meshStandardMaterial
            color={selectedProjectId === 'sitewatch' ? '#dfc070' : '#141824'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Heartbeat Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <torusGeometry args={[0.85, 0.02, 16, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Radar Dish & Scanner Needle */}
        <group ref={radarRef} position={[0, 0, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <coneGeometry args={[0.55, 0.25, 16, 1, true]} />
            <meshStandardMaterial color="#dfc070" wireframe />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* 5-Min Scheduled Ping Satellites */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i * 2 * Math.PI) / 3) * 0.65, 0.4, Math.sin((i * 2 * Math.PI) / 3) * 0.65]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* EXHIBIT 1: MULTI-TENANT RETAIL - Inventory Grid & Laser POS */}
      <group
        position={exhibits[1].offset as [number, number, number]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('retail-management');
        }}
      >
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.9, 1.0, 0.6, 24]} />
          <meshStandardMaterial
            color={selectedProjectId === 'retail-management' ? '#dfc070' : '#141824'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Modular Inventory Cubes (Multi-Tenant Shelf Matrix) */}
        {[-0.22, 0.22].map((x) =>
          [-0.22, 0.22].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.1, z]}>
              <boxGeometry args={[0.24, 0.24, 0.24]} />
              <meshStandardMaterial
                color="#dfc070"
                metalness={0.8}
                roughness={0.2}
                emissive="#634b12"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))
        )}

        {/* Point of Sale Laser Bar Scanner */}
        <mesh ref={scannerRef} position={[0, 0, 0]}>
          <boxGeometry args={[0.75, 0.02, 0.02]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        <mesh position={[0, 0.55, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.7} />
        </mesh>
      </group>

      {/* EXHIBIT 2: THIRUKURAL RAG - Semantic Vector Constellation */}
      <group
        position={exhibits[2].offset as [number, number, number]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('thirukural-rag');
        }}
      >
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.9, 1.0, 0.6, 24]} />
          <meshStandardMaterial
            color={selectedProjectId === 'thirukural-rag' ? '#dfc070' : '#141824'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Central Qdrant Knowledge Core */}
        <mesh position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.32, 1]} />
          <meshStandardMaterial color="#dfc070" wireframe />
        </mesh>

        {/* Semantic concept nodes & retrieval query lines */}
        <group ref={ragBeamRef} position={[0, 0.2, 0]}>
          {[
            [0.6, 0.3, 0.4],
            [-0.5, 0.4, -0.4],
            [0.4, -0.3, -0.5],
            [-0.4, -0.2, 0.5],
            [0.2, 0.6, -0.2],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* EXHIBIT 3: BRAIN TUMOR YOLOv8 - MRI Grid & Bounding Box */}
      <group
        position={exhibits[3].offset as [number, number, number]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('brain-tumor-detection');
        }}
      >
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.9, 1.0, 0.6, 24]} />
          <meshStandardMaterial
            color={selectedProjectId === 'brain-tumor-detection' ? '#dfc070' : '#141824'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* MRI Scan Plane Grid */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.95, 0.95]} />
          <meshBasicMaterial color="#1e293b" wireframe />
        </mesh>

        {/* Target Bounding Box Locator (YOLO Detection) */}
        <group ref={tumorBoxRef} position={[0.12, 0.25, 0.08]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.42, 0.36, 0.1)]} />
            <lineBasicMaterial color="#dfc070" linewidth={2} />
          </lineSegments>
          {/* Detected Tumor Focal Point */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
          </mesh>
        </group>
      </group>

      {/* EXHIBIT 4: ENTERPRISE MICROSERVICES - Cluster & API Gateway Hub */}
      <group
        position={exhibits[4].offset as [number, number, number]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('healthcare-management');
        }}
      >
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.9, 1.0, 0.6, 24]} />
          <meshStandardMaterial
            color={selectedProjectId === 'healthcare-management' ? '#dfc070' : '#141824'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Central API Gateway Cube */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.8}
            roughness={0.2}
            emissive="#795b16"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* 11 Microservices Orbiting Cluster */}
        <group ref={microserviceRef} position={[0, 0.2, 0]}>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 6;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.72, Math.sin(angle * 2) * 0.15, Math.sin(angle) * 0.72]}>
                <boxGeometry args={[0.12, 0.12, 0.12]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0369a1" emissiveIntensity={0.7} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
}
