"use client";

import { NEXUS } from "@/components/hero-core/colors";

/** Lighting + depth fog for route atmospheric perspective */
export function NeuralMapEnvironment() {
  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 11, 26]} />
      <ambientLight intensity={0.14} />
      <hemisphereLight
        args={[NEXUS.cyan, NEXUS.voidDeep, 0.22]}
        position={[0, 4, 0]}
      />
      <pointLight position={[4, 5, 6]} intensity={2} color={NEXUS.lime} distance={26} />
      <pointLight position={[-5, 2, 4]} intensity={1.35} color={NEXUS.cyan} distance={22} />
      <pointLight position={[0, 1.5, 0]} intensity={0.85} color={NEXUS.limeBright} distance={14} />
    </>
  );
}
