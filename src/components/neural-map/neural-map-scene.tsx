"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useCursor } from "@/context/cursor-context";
import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import {
  NEURAL_HUB_POSITION,
  NEURAL_RELAY_POSITIONS,
  NEURAL_SECTOR_POSITIONS,
  buildNeuralConnections,
  getRelatedNodeIds,
} from "@/lib/system/neural-layout";
import { cursorProximity01 } from "@/lib/system/neural-cursor-influence";
import { neuralPhase } from "@/lib/system/neural-sync";
import { NEURAL_SECTOR_META, NEURAL_RELAY_META } from "@/lib/system/neural-data";
import { NEXUS } from "@/components/hero-core/colors";
import { NeuralMapEnvironment } from "./neural-map-environment";
import { NeuralMapControls } from "./neural-map-controls";
import { NeuralSignalFlow } from "./neural-signal-flow";
import { NeuralOrbitRings } from "./neural-orbit-rings";
import { NeuralCoreNexus } from "./neural-core-nexus";
import { NeuralDepthField } from "./neural-depth-field";

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
  const sectorMats = useRef<Record<string, THREE.MeshStandardMaterial>>({});
  const relayMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const worldRef = useRef<THREE.Group>(null);
  const connections = useMemo(() => buildNeuralConnections(), []);
  const { camera, size } = useThree();
  const { smoothX, smoothY, ready: cursorReady, reducedMotion } = useCursor();
  const [cursorBoost, setCursorBoost] = useState(0);

  const focusId = hoveredSector ?? selectedSector;
  const analysisId = selectedSector;
  const relatedIds = useMemo(
    () => getRelatedNodeIds(analysisId ?? focusId),
    [analysisId, focusId]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (worldRef.current) {
      worldRef.current.position.y = Math.sin(neuralPhase(t, 0, 1)) * 0.02;
    }

    let maxProx = 0;
    if (cursorReady && !reducedMotion && worldRef.current) {
      const proxHub = cursorProximity01(
        NEURAL_HUB_POSITION[0],
        NEURAL_HUB_POSITION[1],
        NEURAL_HUB_POSITION[2],
        worldRef.current,
        camera,
        size,
        smoothX,
        smoothY,
        220
      );
      maxProx = proxHub;

      NEURAL_SECTORS.forEach((sector) => {
        const pos = NEURAL_SECTOR_POSITIONS[sector.id];
        const prox = cursorProximity01(
          pos[0],
          pos[1],
          pos[2],
          worldRef.current,
          camera,
          size,
          smoothX,
          smoothY,
          200
        );
        maxProx = Math.max(maxProx, prox);

        const mat = sectorMats.current[sector.id];
        if (!mat) return;
        const isFocus = sector.id === hoveredSector || sector.id === selectedSector;
        const dimmed =
          analysisId !== null && !relatedIds.has(sector.id) && !isSelected(sector.id);
        if (!isFocus && !dimmed) {
          mat.emissiveIntensity = 1.2 + prox * 1.4;
          mat.opacity = 0.72 + prox * 0.12;
        }
      });

      relayMats.current.forEach((mat, i) => {
        const pos = NEURAL_RELAY_POSITIONS[i];
        if (!mat || !pos) return;
        const prox = cursorProximity01(
          pos[0],
          pos[1],
          pos[2],
          worldRef.current,
          camera,
          size,
          smoothX,
          smoothY,
          180
        );
        maxProx = Math.max(maxProx, prox);
        mat.opacity = 0.45 + prox * 0.35;
      });
    }

    setCursorBoost((prev) => prev + (maxProx - prev) * 0.12);

    Object.entries(sectorMats.current).forEach(([id, mat]) => {
      const isFocus = id === hoveredSector || id === selectedSector;
      if (isFocus) {
        mat.emissiveIntensity = 2.6 + Math.sin(t * 2.2) * 0.35;
      } else if (analysisId && !relatedIds.has(id) && id !== selectedSector) {
        mat.emissiveIntensity = 0.4;
      }
    });
  });

  function isSelected(id: string) {
    return selectedSector === id;
  }

  const focusBoost = focusId ? 1 : 0;

  return (
    <>
      <NeuralDepthField />
      <NeuralMapEnvironment />
      <NeuralMapControls />

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
          cursorBoost={cursorBoost}
        />

        <group position={NEURAL_HUB_POSITION}>
          <NeuralCoreNexus focusBoost={focusBoost} cursorBoost={cursorBoost} />
        </group>

        {NEURAL_RELAY_POSITIONS.map((pos, i) => {
          const meta = NEURAL_RELAY_META[i];
          if (!meta) return null;
          const dimmed = analysisId !== null && !relatedIds.has(meta.id);
          return (
            <group key={meta.id} position={pos}>
              <mesh renderOrder={3}>
                <sphereGeometry args={[0.05, 10, 10]} />
                <meshBasicMaterial
                  ref={(m) => {
                    if (m) relayMats.current[i] = m;
                  }}
                  color={NEXUS.cyan}
                  transparent
                  opacity={dimmed ? 0.15 : 0.55}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          );
        })}

        {NEURAL_SECTORS.map((sector) => {
          const pos = NEURAL_SECTOR_POSITIONS[sector.id];
          const meta = NEURAL_SECTOR_META[sector.id];
          const isHovered = hoveredSector === sector.id;
          const isSelectedNode = selectedSector === sector.id;
          const isFocus = isHovered || isSelectedNode;
          const dimmed =
            analysisId !== null && !relatedIds.has(sector.id) && !isSelectedNode;

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
                  depthWrite={false}
                />
              </mesh>

              {isFocus && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.32, 0.38, 48]} />
                  <meshBasicMaterial
                    color={NEXUS.lime}
                    transparent
                    opacity={isSelectedNode ? 0.55 : 0.3}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
              )}

              <mesh
                renderOrder={3}
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
                  args={[isSelectedNode ? 0.18 : isHovered ? 0.16 : 0.14, 24, 24]}
                />
                <meshStandardMaterial
                  ref={(m) => {
                    if (m) sectorMats.current[sector.id] = m;
                  }}
                  color={isFocus ? NEXUS.limeBright : NEXUS.cyan}
                  emissive={isFocus ? NEXUS.lime : NEXUS.cyan}
                  emissiveIntensity={isFocus ? 2.8 : dimmed ? 0.4 : 1.2}
                  transparent
                  opacity={dimmed ? 0.28 : isFocus ? 0.82 : 0.72}
                  depthWrite={isFocus}
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
