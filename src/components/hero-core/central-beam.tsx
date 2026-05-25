"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

export function CentralBeam() {
  const beam = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.85 + Math.sin(t * 1.8) * 0.15;
    if (beam.current) {
      const mat = beam.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 * pulse;
    }
    if (glow.current) {
      glow.current.scale.set(1, 1 + Math.sin(t * 1.2) * 0.05, 1);
    }
  });

  return (
    <group position={[0.35, 0.2, 0]}>
      <mesh ref={glow} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.25, 3.2, 16, 1, true]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={beam} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 3.5, 8]} />
        <meshBasicMaterial
          color={NEXUS.limeBright}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
