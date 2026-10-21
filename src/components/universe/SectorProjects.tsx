import { useRef, useMemo } from 'react';
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
  const heartbeatRingRef = useRef<THREE.Mesh>(null);
  const retailScannerRef = useRef<THREE.Mesh>(null);
  const ragQueryRef = useRef<THREE.Mesh>(null);
  const tumorBoxRef = useRef<THREE.LineSegments>(null);
  const tumorScannerRef = useRef<THREE.Mesh>(null);
  const microserviceOrbitRef = useRef<THREE.Group>(null);

  // Exhibit local offsets relative to group [-26, 0, -4]
  const exhibits = [
    { id: 'sitewatch', offset: [-7.5, 0, 0] as [number, number, number] },
    { id: 'retail-management', offset: [-3.8, 0, 1.2] as [number, number, number] },
    { id: 'thirukural-rag', offset: [0, 0, 1.8] as [number, number, number] },
    { id: 'brain-tumor-detection', offset: [3.8, 0, 1.2] as [number, number, number] },
    { id: 'healthcare-management', offset: [7.5, 0, 0] as [number, number, number] },
  ];

  // RAG Dynamic vector retrieval lines
  const ragLinesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];
    // 6 couplet vector nodes
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * 1.5;
      const z = Math.sin(angle) * 1.5;
      points.push(0, 0.8, 0); // Origin at query vector
      points.push(x, 0.4 + (i % 2) * 0.3, z);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // 1. SiteWatch radar dish sweep
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.6;
    }
    // Heartbeat ring periodic expansion
    if (heartbeatRingRef.current) {
      const cycle = (t * 0.8) % 1;
      const scale = 0.6 + cycle * 1.6;
      heartbeatRingRef.current.scale.set(scale, scale, scale);
      const mat = heartbeatRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (1 - cycle) * 0.8;
      }
    }

    // 2. Retail scanner laser vertical motion
    if (retailScannerRef.current) {
      retailScannerRef.current.position.y = 0.5 + Math.sin(t * 2.8) * 0.65;
    }

    // 3. RAG Query vector rotation and pulsing
    if (ragQueryRef.current) {
      ragQueryRef.current.rotation.y += delta * 0.8;
      ragQueryRef.current.rotation.x = Math.sin(t * 1.5) * 0.2;
    }

    // 4. Brain tumor detection bounding box pulse & slice scan
    if (tumorBoxRef.current) {
      const pulse = 1 + Math.sin(t * 3.5) * 0.04;
      tumorBoxRef.current.scale.set(pulse, pulse, pulse);
    }
    if (tumorScannerRef.current) {
      tumorScannerRef.current.position.z = Math.sin(t * 2.2) * 0.55;
    }

    // 5. Enterprise microservice satellites orbit
    if (microserviceOrbitRef.current) {
      microserviceOrbitRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[-26, 0, -4]}>
      {/* Semicircular Curved Gallery Architectural Deck */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[11, 11.5, 0.35, 64, 1, false, -Math.PI / 2.6, (2 * Math.PI) / 2.6]} />
        <meshStandardMaterial color="#0c0f16" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Embedded Runway Accent Line */}
      <mesh position={[0, -1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[10.6, 0.025, 16, 64, Math.PI * 0.78]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* =========================================================================
          INSTALLATION 1: SITEWATCH - Uptime, TLS & Domain Expiry Monitoring
          ========================================================================= */}
      <group
        position={exhibits[0].offset}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('sitewatch');
        }}
      >
        {/* Foundation Plinth */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[1.2, 1.35, 0.65, 32]} />
          <meshStandardMaterial
            color={selectedProjectId === 'sitewatch' ? '#dfc070' : '#131824'}
            emissive={selectedProjectId === 'sitewatch' ? '#795b16' : '#000000'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Pulsing 5-Minute Heartbeat Ring */}
        <mesh ref={heartbeatRingRef} position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.025, 16, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>

        {/* Towering Hexagonal Monitoring Spire */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.25, 0.45, 2.8, 6]} />
          <meshStandardMaterial color="#1a2233" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Rotating Radar Dish & Receiver Needle */}
        <group ref={radarRef} position={[0, 1.9, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <sphereGeometry args={[0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#dfc070"
              metalness={0.95}
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.25, 0.15]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* 3 Satellite Checkpoint Pylons (Uptime, TLS, Domain) */}
        {[
          [-0.85, 0.5],
          [0.85, 0.5],
          [0, -0.9],
        ].map(([cx, cz], i) => (
          <group key={i} position={[cx, -0.8, cz]}>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.18, 0.8, 0.18]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color={i === 0 ? '#10b981' : '#38bdf8'} />
            </mesh>
          </group>
        ))}

        {/* Alert Status Top Beacon */}
        <mesh position={[0, 2.25, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {selectedProjectId === 'sitewatch' && (
          <pointLight color="#dfc070" intensity={3} distance={5} />
        )}
      </group>

      {/* =========================================================================
          INSTALLATION 2: RETAIL MANAGEMENT & BILLING PLATFORM
          ========================================================================= */}
      <group
        position={exhibits[1].offset}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('retail-management');
        }}
      >
        {/* Foundation Plinth */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[1.2, 1.35, 0.65, 32]} />
          <meshStandardMaterial
            color={selectedProjectId === 'retail-management' ? '#dfc070' : '#131824'}
            emissive={selectedProjectId === 'retail-management' ? '#795b16' : '#000000'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Retail Inventory Rack Monolith */}
        <mesh position={[0, 0.4, -0.2]}>
          <boxGeometry args={[1.5, 2.4, 0.35]} />
          <meshStandardMaterial color="#0e131d" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Illuminated Barcode & SKU Grid Rows */}
        {[-0.6, -0.2, 0.2, 0.6, 1.0].map((ry, idx) => (
          <mesh key={idx} position={[0, ry, -0.01]}>
            <boxGeometry args={[1.35, 0.08, 0.02]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#dfc070' : '#38bdf8'}
              emissive={idx % 2 === 0 ? '#dfc070' : '#38bdf8'}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}

        {/* Vertical Scanning Laser Plane */}
        <mesh ref={retailScannerRef} position={[0, 0.5, 0.05]}>
          <boxGeometry args={[1.45, 0.03, 0.4]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.75} />
        </mesh>

        {/* Front Checkout POS Terminal & Floating Holographic Receipt */}
        <group position={[0, -0.5, 0.6]}>
          <mesh>
            <boxGeometry args={[0.5, 0.8, 0.4]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 6, 0, 0]}>
            <planeGeometry args={[0.35, 0.45]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {selectedProjectId === 'retail-management' && (
          <pointLight color="#dfc070" intensity={3} distance={5} />
        )}
      </group>

      {/* =========================================================================
          INSTALLATION 3: THIRUKURAL RAG - Semantic Vector Search
          ========================================================================= */}
      <group
        position={exhibits[2].offset}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('thirukural-rag');
        }}
      >
        {/* Foundation Plinth */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[1.2, 1.35, 0.65, 32]} />
          <meshStandardMaterial
            color={selectedProjectId === 'thirukural-rag' ? '#dfc070' : '#131824'}
            emissive={selectedProjectId === 'thirukural-rag' ? '#795b16' : '#000000'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Concentric Vector Similarity Threshold Rings */}
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.015, 16, 48]} />
          <meshBasicMaterial color="#dfc070" />
        </mesh>
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.015, 16, 48]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Central Floating Query Embedding Vector Nucleus */}
        <mesh ref={ragQueryRef} position={[0, 0.8, 0]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#dfc070"
            emissive="#b8933b"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Dynamic Vector Retrieval Beams */}
        <lineSegments geometry={ragLinesGeometry}>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </lineSegments>

        {/* 6 Surrounding Couplet Knowledge Nodes */}
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const angle = (idx * Math.PI * 2) / 6;
          const x = Math.cos(angle) * 1.5;
          const z = Math.sin(angle) * 1.5;
          const y = 0.4 + (idx % 2) * 0.3;

          return (
            <group key={idx} position={[x, y, z]}>
              <mesh>
                <boxGeometry args={[0.22, 0.32, 0.08]} />
                <meshStandardMaterial
                  color="#1e293b"
                  emissive="#0284c7"
                  emissiveIntensity={0.4}
                  metalness={0.8}
                />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshBasicMaterial color="#dfc070" />
              </mesh>
            </group>
          );
        })}

        {selectedProjectId === 'thirukural-rag' && (
          <pointLight color="#dfc070" intensity={3} distance={5} />
        )}
      </group>

      {/* =========================================================================
          INSTALLATION 4: BRAIN TUMOR DETECTION & LOCALIZATION (YOLOv8)
          ========================================================================= */}
      <group
        position={exhibits[3].offset}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('brain-tumor-detection');
        }}
      >
        {/* Foundation Plinth */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[1.2, 1.35, 0.65, 32]} />
          <meshStandardMaterial
            color={selectedProjectId === 'brain-tumor-detection' ? '#dfc070' : '#131824'}
            emissive={selectedProjectId === 'brain-tumor-detection' ? '#795b16' : '#000000'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Volumetric MRI Stack (4 Axial Slices) */}
        {[-0.45, -0.15, 0.15, 0.45].map((sz, sIdx) => (
          <mesh key={sIdx} position={[0, 0.5, sz]}>
            <boxGeometry args={[1.5, 1.8, 0.03]} />
            <meshStandardMaterial
              color="#0d1424"
              transparent
              opacity={0.35 + sIdx * 0.15}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Localized Object-Detection Bounding Box in 3D */}
        <lineSegments
          ref={tumorBoxRef}
          position={[0.25, 0.75, 0.15]}
          geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.55, 0.55, 0.45))}
        >
          <lineBasicMaterial color="#38bdf8" linewidth={2} />
        </lineSegments>

        {/* Crosshair / Corner Brackets */}
        <mesh position={[0.25, 0.75, 0.15]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#dfc070" />
        </mesh>

        {/* Axial Laser Scanner Bar */}
        <mesh ref={tumorScannerRef} position={[0, 0.5, 0]}>
          <boxGeometry args={[1.65, 0.04, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {selectedProjectId === 'brain-tumor-detection' && (
          <pointLight color="#38bdf8" intensity={3} distance={5} />
        )}
      </group>

      {/* =========================================================================
          INSTALLATION 5: PROFESSIONAL PLATFORMS & LAB AUTOMATION (Younder Bots)
          ========================================================================= */}
      <group
        position={exhibits[4].offset}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectProject('healthcare-management');
        }}
      >
        {/* Foundation Plinth */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[1.2, 1.35, 0.65, 32]} />
          <meshStandardMaterial
            color={selectedProjectId === 'healthcare-management' ? '#dfc070' : '#131824'}
            emissive={selectedProjectId === 'healthcare-management' ? '#795b16' : '#000000'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Central API Gateway Monolith */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.65, 2.2, 0.65]} />
          <meshStandardMaterial
            color="#dfc070"
            metalness={0.9}
            roughness={0.15}
            emissive="#795b16"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Central Gateway Wireframe Armor */}
        <lineSegments
          position={[0, 0.5, 0]}
          geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 2.25, 0.7))}
        >
          <lineBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </lineSegments>

        {/* Orbiting Satellite Microservices (Lab Analyzer, Clinical, Pharmacy, Billing, AI) */}
        <group ref={microserviceOrbitRef} position={[0, 0.5, 0]}>
          {[
            { label: 'Analyzer QC', dist: 1.5, angle: 0, color: '#10b981' },
            { label: 'Clinical Flow', dist: 1.5, angle: (Math.PI * 2) / 5, color: '#38bdf8' },
            { label: 'Pharmacy/Billing', dist: 1.5, angle: (Math.PI * 4) / 5, color: '#dfc070' },
            { label: 'RBAC & Auth', dist: 1.5, angle: (Math.PI * 6) / 5, color: '#a855f7' },
            { label: 'Support AI', dist: 1.5, angle: (Math.PI * 8) / 5, color: '#38bdf8' },
          ].map((srv, sIdx) => {
            const sx = Math.cos(srv.angle) * srv.dist;
            const sz = Math.sin(srv.angle) * srv.dist;
            return (
              <group key={sIdx} position={[sx, Math.sin(srv.angle * 2) * 0.35, sz]}>
                <mesh>
                  <boxGeometry args={[0.26, 0.26, 0.26]} />
                  <meshStandardMaterial
                    color={srv.color}
                    emissive={srv.color}
                    emissiveIntensity={0.6}
                    metalness={0.8}
                  />
                </mesh>
                <mesh position={[0, 0.2, 0]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            );
          })}
        </group>

        {selectedProjectId === 'healthcare-management' && (
          <pointLight color="#dfc070" intensity={3} distance={5} />
        )}
      </group>
    </group>
  );
}
