"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import {
  NEURAL_HUB_POSITION,
  NEURAL_RELAY_POSITIONS,
  NEURAL_SECTOR_POSITIONS,
  buildNeuralConnections,
  getRelatedNodeIds,
} from "@/lib/system/neural-layout";
import { NEURAL_HUB_META, NEURAL_SECTOR_META, NEURAL_RELAY_META } from "@/lib/system/neural-data";
import { NEXUS } from "@/components/hero-core/colors";
import { NeuralMapEnvironment } from "./neural-map-environment";
import { NeuralMapControls } from "./neural-map-controls";
import { NeuralSignalFlow } from "./neural-signal-flow";
import { NeuralOrbitRings } from "./neural-orbit-rings";

interface NeuralMapSceneProps {
  hoveredSector: NeuralSectorId | null;
  selectedSector: NeuralSectorId | null;
  onSectorHover: (id: NeuralSectorId | null) => void;
  onSectorSelect: (id: NeuralSectorId) => void;
}

export function NeuralMapScene({
  hoveredSector,
  selectedSector,
  onSectorHover,
  onSectorSelect,
}: NeuralMapSceneProps) {
  const hubMat = useRef<THREE.MeshStandardMaterial>(null);
  const sectorMats = useRef<Record<string, THREE.MeshStandardMaterial>>({});
  const worldRef = useRef<THREE.Group>(null);
  const connections = useMemo(() => buildNeuralConnections(), []);

  const focusId = hoveredSector ?? selectedSector;
  const analysisId = selectedSector;
  const relatedIds = useMemo(
    () => getRelatedNodeIds(analysisId ?? focusId),
    [analysisId, focusId]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (worldRef.current) {
      worldRef.current.position.y = Math.sin(t * 0.35) * 0.03;
    }

    if (hubMat.current) {
      hubMat.current.emissiveIntensity =
        1.2 + Math.sin(t * 1.1) * 0.2 + (focusId ? 1.2 : 0);
    }

    Object.entries(sectorMats.current).forEach(([id, mat]) => {
      const isFocus = id === hoveredSector || id === selectedSector;
      if (isFocus) {
        mat.emissiveIntensity = 2.6 + Math.sin(t * 2.2) * 0.35;
      }
    });
  });

  return (
    <>
      <NeuralMapEnvironment />
      <NeuralMapControls />

      <pointLight position={[4, 5, 6]} intensity={2.4} color={NEXUS.lime} />
      <pointLight position={[-5, 2, 4]} intensity={1.6} color={NEXUS.cyan} />
      {(analysisId || focusId) && focusId && focusId in NEURAL_SECTOR_POSITIONS && (
        <pointLight
          position={NEURAL_SECTOR_POSITIONS[focusId as NeuralSectorId]}
          intensity={3.5}
          color={NEXUS.limeBright}
          distance={8}
        />
      )}

      <group ref={worldRef}>
        <NeuralOrbitRings active={!!focusId} />

        <NeuralSignalFlow
          connections={connections}
          focusId={focusId}
          analysisId={analysisId}
        />

        {/* Hub */}
        <group position={NEURAL_HUB_POSITION}>
          <mesh>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial
              ref={hubMat}
              color={NEXUS.cyan}
              emissive={NEXUS.cyan}
              emissiveIntensity={1.2}
              transparent
              opacity={0.92}
              toneMapped={false}
            />
          </mesh>
          <Html center distanceFactor={12} pointerEvents="none">
            <div className="neural-node-label neural-node-label--hub">
              <span className="neural-node-label__id">{NEURAL_HUB_META.districtId}</span>
              <span className="neural-node-label__name">{NEURAL_HUB_META.systemName}</span>
            </div>
          </Html>
        </group>

        {/* Relays — mid-ring, between sectors */}
        {NEURAL_RELAY_POSITIONS.map((pos, i) => {
          const meta = NEURAL_RELAY_META[i];
          if (!meta) return null;
          const dimmed = analysisId !== null && !relatedIds.has(meta.id);
          return (
            <group key={meta.id} position={pos}>
              <mesh>
                <sphereGeometry args={[0.05, 10, 10]} />
                <meshBasicMaterial
                  color={NEXUS.cyan}
                  transparent
                  opacity={dimmed ? 0.15 : 0.55}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          );
        })}

        {/* Sectors — outer pentagon */}
        {NEURAL_SECTORS.map((sector) => {
          const pos = NEURAL_SECTOR_POSITIONS[sector.id];
          const meta = NEURAL_SECTOR_META[sector.id];
          const isHovered = hoveredSector === sector.id;
          const isSelected = selectedSector === sector.id;
          const isFocus = isHovered || isSelected;
          const dimmed =
            analysisId !== null && !relatedIds.has(sector.id) && !isSelected;

          return (
            <group key={sector.id} position={pos}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.26, 0.3, 48]} />
                <meshBasicMaterial
                  color={NEXUS.lime}
                  transparent
                  opacity={isFocus ? 0.35 : 0.08}
                  blending={THREE.AdditiveBlending}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {isFocus && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.32, 0.38, 48]} />
                  <meshBasicMaterial
                    color={NEXUS.lime}
                    transparent
                    opacity={isSelected ? 0.55 : 0.3}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}

              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  onSectorHover(sector.id);
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  onSectorHover(null);
                  document.body.style.cursor = "";
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSectorSelect(sector.id);
                }}
              >
                <sphereGeometry
                  args={[isSelected ? 0.18 : isHovered ? 0.16 : 0.14, 24, 24]}
                />
                <meshStandardMaterial
                  ref={(m) => {
                    if (m) sectorMats.current[sector.id] = m;
                  }}
                  color={isFocus ? NEXUS.limeBright : NEXUS.cyan}
                  emissive={isFocus ? NEXUS.lime : NEXUS.cyan}
                  emissiveIntensity={isFocus ? 2.8 : dimmed ? 0.4 : 1.2}
                  transparent
                  opacity={dimmed ? 0.3 : 0.96}
                  toneMapped={false}
                />
              </mesh>

              <Html center distanceFactor={12} pointerEvents="none">
                <div
                  className={`neural-node-label ${isFocus ? "neural-node-label--active" : ""} ${dimmed ? "neural-node-label--dim" : ""}`}
                >
                  <span className="neural-node-label__id">{meta.districtId}</span>
                  <span className="neural-node-label__name">{meta.systemName}</span>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
