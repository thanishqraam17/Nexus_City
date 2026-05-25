"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const RINGS = [
  { radius: 1.45, speed: 0.9, color: NEXUS.cyan, y: 0.05, tilt: 0.12 },
  { radius: 1.85, speed: 0.7, color: NEXUS.lime, y: -0.08, tilt: -0.08 },
  { radius: 2.25, speed: 0.55, color: NEXUS.cyan, y: 0.1, tilt: 0.05 },
  { radius: 2.65, speed: 0.42, color: NEXUS.lime, y: -0.12, tilt: 0.15 },
];

export function PulseRings() {
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const cfg = RINGS[i];
      const pulse = 1 + Math.sin(t * cfg.speed + i) * 0.04;
      mesh.scale.set(pulse, pulse, 1);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(t * cfg.speed * 1.3 + i * 0.8) * 0.08;
    });
  });

  return (
    <group>
      {RINGS.map((ring, i) => (
        <mesh
          key={ring.radius}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={[0, ring.y, 0]}
          rotation={[-Math.PI / 2 + ring.tilt, 0, 0]}
        >
          <torusGeometry args={[ring.radius, 0.008, 8, 96]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
