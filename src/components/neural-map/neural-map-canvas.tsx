"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, memo } from "react";
import type { NeuralSectorId } from "@/lib/system/city-data";
import { NeuralMapScene } from "./neural-map-scene";

interface NeuralMapCanvasProps {
  hoveredSector: NeuralSectorId | null;
  selectedSector: NeuralSectorId | null;
  onSectorHover: (id: NeuralSectorId | null) => void;
  onSectorSelect: (id: NeuralSectorId) => void;
}

function NeuralMapCanvasInner({
  hoveredSector,
  selectedSector,
  onSectorHover,
  onSectorSelect,
}: NeuralMapCanvasProps) {
  return (
    <Canvas
      className="neural-map-canvas h-full w-full"
      dpr={[1, 1.25]}
      camera={{ position: [0.4, 1.1, 9.2], fov: 34, near: 0.1, far: 45 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent", touchAction: "none" }}
      frameloop="always"
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <NeuralMapScene
          hoveredSector={hoveredSector}
          selectedSector={selectedSector}
          onSectorHover={onSectorHover}
          onSectorSelect={onSectorSelect}
        />
      </Suspense>
    </Canvas>
  );
}

export default memo(NeuralMapCanvasInner);
