"use client";

/**
 * Lighting-only 3D environment — atmosphere lives in CSS compositing layers.
 * No fog, no solid fills, no background geometry that reads as an opaque panel.
 */
import { NEXUS } from "@/components/hero-core/colors";

export function NeuralMapEnvironment() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <hemisphereLight
        args={[NEXUS.cyan, "#000000", 0.18]}
        position={[0, 4, 0]}
      />
      <pointLight position={[4, 5, 6]} intensity={1.8} color={NEXUS.lime} distance={24} />
      <pointLight position={[-5, 2, 4]} intensity={1.2} color={NEXUS.cyan} distance={20} />
      <pointLight position={[0, 1.5, 0]} intensity={0.6} color={NEXUS.cyan} distance={12} />
    </>
  );
}
