"use client";

import { NEXUS } from "./colors";

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.22} color="#b8c4d4" />
      <hemisphereLight
        args={["#1a2030", NEXUS.void, 0.35]}
        position={[0, 12, 0]}
      />
      <directionalLight
        position={[5, 8, 4]}
        intensity={0.28}
        color={NEXUS.cyan}
      />
      <directionalLight
        position={[-4, 3, -2]}
        intensity={0.18}
        color={NEXUS.lime}
      />
      <pointLight
        position={[0.5, 0.4, 0]}
        intensity={3}
        color={NEXUS.lime}
        distance={8}
      />
      <pointLight
        position={[0.6, 1.2, -0.5]}
        intensity={2}
        color={NEXUS.cyan}
        distance={7}
      />
    </>
  );
}
