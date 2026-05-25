"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import {
  NEURAL_HUB_POSITION,
  NEURAL_RELAY_POSITIONS,
  NEURAL_SECTOR_POSITIONS,
  buildNeuralConnections,
  getNeuralNodePosition,
} from "@/lib/system/neural-layout";
import { NEXUS } from "@/components/hero-core/colors";

interface NeuralMapSceneProps {
  activeSector: NeuralSectorId | null;
  onSectorHover: (id: NeuralSectorId | null) => void;
  onSectorSelect: (id: NeuralSectorId) => void;
}

export function NeuralMapScene({
  activeSector,
  onSectorHover,
  onSectorSelect,
}: NeuralMapSceneProps) {
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const pulseMat = useRef<THREE.LineBasicMaterial>(null);
  const hubMat = useRef<THREE.MeshStandardMaterial>(null);
  const { lineGeo } = useMemo(() => {
    const connections = buildNeuralConnections();
    const linePoints: number[] = [];

    connections.forEach(([a, b]) => {
      const pa = getNeuralNodePosition(a);
      const pb = getNeuralNodePosition(b);
      if (!pa || !pb) return;
      linePoints.push(pa[0], pa[1], pa[2], pb[0], pb[1], pb[2]);
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePoints, 3)
    );

    return { lineGeo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const focus = activeSector;

    if (lineMat.current) {
      lineMat.current.opacity = 0.14 + Math.sin(t * 0.9) * 0.04;
    }
    if (pulseMat.current) {
      pulseMat.current.opacity = 0.06 + ((Math.sin(t * 1.6) + 1) * 0.5) * 0.14;
    }
    if (hubMat.current) {
      hubMat.current.emissiveIntensity = focus ? 1.8 : 1.2;
    }
  });

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 10, 24]} />
      <ambientLight intensity={0.22} />
      <pointLight position={[2, 3, 4]} intensity={2.2} color={NEXUS.lime} />
      <pointLight position={[-3, -1, 2]} intensity={1.4} color={NEXUS.cyan} />
      {activeSector && (
        <pointLight
          position={NEURAL_SECTOR_POSITIONS[activeSector]}
          intensity={2.5}
          color={NEXUS.limeBright}
          distance={5}
        />
      )}

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.45}
        zoomSpeed={0.6}
        minDistance={5}
        maxDistance={9.5}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.62}
        target={[0, 0.1, 0]}
      />

      <mesh position={NEURAL_HUB_POSITION}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          ref={hubMat}
          color={NEXUS.cyan}
          emissive={NEXUS.cyan}
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>

      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          ref={lineMat}
          color={NEXUS.cyan}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <lineSegments geometry={lineGeo} scale={1.001}>
        <lineBasicMaterial
          ref={pulseMat}
          color={NEXUS.lime}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {NEURAL_RELAY_POSITIONS.map((pos, i) => (
        <mesh key={`relay-${i}`} position={pos}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial
            color={NEXUS.cyan}
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {NEURAL_SECTORS.map((sector) => {
        const pos = NEURAL_SECTOR_POSITIONS[sector.id];
        const isActive = activeSector === sector.id;
        return (
          <group key={sector.id} position={pos}>
            {isActive && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.28, 48]} />
                <meshBasicMaterial
                  color={NEXUS.lime}
                  transparent
                  opacity={0.4}
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
              onPointerOut={() => {
                onSectorHover(null);
                document.body.style.cursor = "";
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSectorSelect(sector.id);
              }}
            >
              <sphereGeometry args={[isActive ? 0.16 : 0.13, 20, 20]} />
              <meshStandardMaterial
                color={isActive ? NEXUS.limeBright : NEXUS.cyan}
                emissive={isActive ? NEXUS.lime : NEXUS.cyan}
                emissiveIntensity={isActive ? 2.4 : 1.1}
                transparent
                opacity={0.95}
                toneMapped={false}
              />
            </mesh>
            <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
              <span
                className={`neural-sector-label ${isActive ? "neural-sector-label--active" : ""}`}
              >
                {sector.id}
              </span>
            </Html>
          </group>
        );
      })}
    </>
  );
}
