"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { NeuralCoreScene } from "./neural-core-scene";

export default function HeroCoreCanvas() {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.2, 7.8], fov: 42, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <NeuralCoreScene />
      </Suspense>
    </Canvas>
  );
}
