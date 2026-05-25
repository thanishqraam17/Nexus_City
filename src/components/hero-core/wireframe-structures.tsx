"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const STRUCTURES = [
  { pos: [-2.5, 0.5, -1.2] as const, scale: 0.5, rot: 0.3 },
  { pos: [2.8, -0.3, 1.5] as const, scale: 0.45, rot: 0.8 },
  { pos: [0.5, -1.2, 2.4] as const, scale: 0.6, rot: 1.4 },
  { pos: [-1.8, 1.4, 1.8] as const, scale: 0.35, rot: 2.1 },
];

export function WireframeStructures() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.rotation.y = t * 0.15 + STRUCTURES[i].rot;
      child.rotation.x = Math.sin(t * 0.2 + i) * 0.1;
    });
  });

  return (
    <group ref={group}>
      {STRUCTURES.map((s, i) => (
        <group key={i} position={s.pos} scale={s.scale}>
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color={NEXUS.cyan}
              wireframe
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
            <meshBasicMaterial
              color={NEXUS.lime}
              wireframe
              transparent
              opacity={0.28}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
