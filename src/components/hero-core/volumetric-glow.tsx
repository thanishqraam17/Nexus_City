"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const BLOBS = [
  { pos: [0.4, 0.35, 0] as const, scale: 2.8, color: NEXUS.lime, speed: 0.35 },
  { pos: [0.55, 0.1, -0.3] as const, scale: 3.2, color: NEXUS.cyan, speed: 0.28 },
  { pos: [0.25, -0.2, 0.4] as const, scale: 2.4, color: NEXUS.cyan, speed: 0.42 },
];

export function VolumetricGlow() {
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const b = BLOBS[i];
      const pulse = 1 + Math.sin(t * b.speed + i) * 0.08;
      mesh.scale.setScalar(b.scale * pulse);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * b.speed * 1.2 + i) * 0.02;
    });
  });

  return (
    <group>
      {BLOBS.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={b.pos}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color={b.color}
            transparent
            opacity={0.05}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
