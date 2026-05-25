"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, memo } from "react";
import type { NeuralSectorId } from "@/lib/system/city-data";
import { NeuralMapScene } from "./neural-map-scene";

interface NeuralMapCanvasProps {
  activeSector: NeuralSectorId | null;
  onSectorHover: (id: NeuralSectorId | null) => void;
}

function NeuralMapCanvasInner({
  activeSector,
  onSectorHover,
}: NeuralMapCanvasProps) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 1.25]}
      camera={{ position: [0, 1.2, 6.5], fov: 42, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      frameloop="always"
      performance={{ min: 0.55 }}
    >
      <Suspense fallback={null}>
        <NeuralMapScene
          activeSector={activeSector}
          onSectorHover={onSectorHover}
        />
      </Suspense>
    </Canvas>
  );
}

export default memo(NeuralMapCanvasInner);
