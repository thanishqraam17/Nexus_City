"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { NeuralCoreScene } from "./neural-core-scene";

export default function HeroCoreCanvas() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 1.5]}
      camera={{ position: [0.5, 2.2, 7.6], fov: 42, near: 0.1, far: 36 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
        premultipliedAlpha: true,
      }}
      performance={{ min: 0.55 }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <NeuralCoreScene />
      </Suspense>
    </Canvas>
  );
}
