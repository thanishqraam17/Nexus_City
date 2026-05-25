"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const MARKERS: {
  pos: [number, number, number];
  color: string;
  phase: number;
}[] = [
  { pos: [2.1, 0.8, 0.6], color: NEXUS.lime, phase: 0 },
  { pos: [-1.4, 1.1, 1.2], color: NEXUS.cyan, phase: 1.2 },
  { pos: [1.8, -0.6, -1.5], color: NEXUS.cyan, phase: 2.1 },
  { pos: [-2.2, 0.3, -0.8], color: NEXUS.lime, phase: 3.4 },
  { pos: [0.2, 1.6, -1.8], color: NEXUS.orange, phase: 4.2 },
  { pos: [2.8, -0.2, -0.4], color: NEXUS.lime, phase: 5.5 },
];

export function FloatingMarkers() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const m = MARKERS[i];
      child.position.set(
        m.pos[0] + Math.sin(t * 0.5 + m.phase) * 0.06,
        m.pos[1] + Math.cos(t * 0.45 + m.phase) * 0.08,
        m.pos[2] + Math.sin(t * 0.38 + m.phase) * 0.06
      );
    });
  });

  return (
    <group ref={group}>
      {MARKERS.map((m, i) => (
        <group key={i} position={m.pos}>
          <mesh>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial
              color={m.color}
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshBasicMaterial
              color={m.color}
              wireframe
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
