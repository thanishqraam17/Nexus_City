"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

export function ScanLayer() {
  const ring = useRef<THREE.Mesh>(null);
  const phase = useRef(0);

  useFrame((_, delta) => {
    phase.current = (phase.current + delta * 0.35) % 1;
    if (ring.current) {
      ring.current.position.y = THREE.MathUtils.lerp(-1.5, 2.5, phase.current);
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(phase.current * Math.PI) * 0.12;
    }
  });

  return (
    <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.8, 3.05, 64]} />
      <meshBasicMaterial
        color={NEXUS.lime}
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
