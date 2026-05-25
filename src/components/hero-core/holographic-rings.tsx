"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const RINGS = [
  { r: 1.35, tube: 0.006, tilt: [0.55, 0, 0.2], speed: 0.22, color: NEXUS.cyan },
  { r: 1.75, tube: 0.005, tilt: [0.35, 0.4, 0.1], speed: -0.18, color: NEXUS.lime },
  { r: 2.15, tube: 0.004, tilt: [0.2, 0.15, 0.35], speed: 0.14, color: NEXUS.cyan },
  { r: 2.55, tube: 0.003, tilt: [0.6, -0.2, 0.15], speed: -0.12, color: NEXUS.lime },
  { r: 2.95, tube: 0.003, tilt: [0.1, 0.5, -0.1], speed: 0.1, color: NEXUS.orange },
];

export function HolographicRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.rotation.x = RINGS[i].tilt[0] + Math.sin(t * 0.2 + i) * 0.05;
      child.rotation.y = t * RINGS[i].speed + RINGS[i].tilt[1];
      child.rotation.z = RINGS[i].tilt[2];
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.2 + Math.sin(t * 0.8 + i * 0.7) * 0.1;
    });
  });

  return (
    <group ref={group}>
      {RINGS.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.r, ring.tube, 12, 128]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.38}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
