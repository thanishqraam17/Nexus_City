"use client";

import { NEXUS } from "./colors";

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={0.35}
        color={NEXUS.cyan}
      />
      <directionalLight
        position={[-5, 2, -3]}
        intensity={0.2}
        color={NEXUS.lime}
      />
      <spotLight
        position={[0, 8, 2]}
        angle={0.45}
        penumbra={0.8}
        intensity={0.6}
        color="#ffffff"
        castShadow={false}
      />
    </>
  );
}
