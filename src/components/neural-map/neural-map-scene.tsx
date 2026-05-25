"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import { NEXUS } from "@/components/hero-core/colors";

const NODE_COUNT = 28;
const CONNECT_DIST = 1.35;

function seededPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const r = s - Math.floor(s);
    const s2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
    const r2 = s2 - Math.floor(s);
    const s3 = Math.sin(i * 419.2 + 71.9) * 43758.5453;
    const r3 = s3 - Math.floor(s3);
    const radius = 1.4 + r * 1.6;
    const theta = r2 * Math.PI * 2;
    const phi = (r3 - 0.5) * Math.PI * 0.7;
    pos[i * 3] = Math.cos(theta) * Math.cos(phi) * radius;
    pos[i * 3 + 1] = Math.sin(phi) * radius * 0.6;
    pos[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * radius;
  }
  return pos;
}

interface NeuralMapSceneProps {
  activeSector: NeuralSectorId | null;
  onSectorHover: (id: NeuralSectorId | null) => void;
}

export function NeuralMapScene({
  activeSector,
  onSectorHover,
}: NeuralMapSceneProps) {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);
  const [hovered, setHovered] = useState<NeuralSectorId | null>(null);

  const { pointGeo, lineGeo } = useMemo(() => {
    const positions = seededPositions(NODE_COUNT);
    const linePoints: number[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECT_DIST) {
          linePoints.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2],
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          );
        }
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePoints, 3)
    );

    return { pointGeo, lineGeo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pulseRef.current = t;
    if (group.current) {
      group.current.rotation.y = t * 0.04;
    }
  });

  const sectorWorld = (x: number, y: number) => [
    (x - 0.5) * 3.2,
    (0.5 - y) * 1.8,
    0,
  ] as const;

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 8, 22]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 2]} intensity={2.5} color={NEXUS.lime} />
      <pointLight position={[-2, -1, 1]} intensity={1.5} color={NEXUS.cyan} />

      <group ref={group}>
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial
            color={NEXUS.cyan}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
        <points geometry={pointGeo}>
          <pointsMaterial
            color={NEXUS.lime}
            size={0.055}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>

        {NEURAL_SECTORS.map((sector) => {
          const pos = sectorWorld(sector.x, sector.y);
          const isActive =
            activeSector === sector.id || hovered === sector.id;
          return (
            <group key={sector.id} position={pos}>
              <mesh
                onPointerOver={() => {
                  setHovered(sector.id);
                  onSectorHover(sector.id);
                }}
                onPointerOut={() => {
                  setHovered(null);
                  onSectorHover(null);
                }}
              >
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial
                  color={isActive ? NEXUS.limeBright : NEXUS.cyan}
                  emissive={isActive ? NEXUS.lime : NEXUS.cyan}
                  emissiveIntensity={isActive ? 2.2 : 1}
                  transparent
                  opacity={0.9}
                  toneMapped={false}
                />
              </mesh>
              <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
                <span
                  className={`neural-sector-label ${isActive ? "neural-sector-label--active" : ""}`}
                >
                  {sector.id}
                </span>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
