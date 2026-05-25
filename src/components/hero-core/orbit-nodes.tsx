"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const ORBITS = [
  { radius: 2.35, speed: 0.45, y: 0.35, color: NEXUS.lime, phase: 0 },
  { radius: 2.75, speed: -0.32, y: -0.25, color: NEXUS.cyan, phase: 1.2 },
  { radius: 3.1, speed: 0.28, y: 0.55, color: NEXUS.orange, phase: 2.4 },
  { radius: 2.55, speed: -0.38, y: -0.45, color: NEXUS.lime, phase: 3.8 },
];

export function OrbitNodes() {
  const nodes = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    nodes.current.forEach((group, i) => {
      if (!group) return;
      const o = ORBITS[i];
      const angle = t * o.speed + o.phase;
      group.position.set(
        Math.cos(angle) * o.radius,
        o.y + Math.sin(t * 0.8 + i) * 0.08,
        Math.sin(angle) * o.radius
      );
    });
  });

  return (
    <group>
      {ORBITS.map((o, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) nodes.current[i] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
