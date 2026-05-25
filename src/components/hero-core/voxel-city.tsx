"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const BUILDINGS: { x: number; z: number; h: number; w: number }[] = [
  { x: -1.2, z: -0.8, h: 0.9, w: 0.35 },
  { x: -0.5, z: -1.1, h: 1.4, w: 0.4 },
  { x: 0.2, z: -0.6, h: 1.8, w: 0.45 },
  { x: 0.9, z: -0.9, h: 1.1, w: 0.38 },
  { x: 1.4, z: -0.2, h: 0.7, w: 0.32 },
  { x: -1.0, z: 0.3, h: 1.2, w: 0.36 },
  { x: -0.3, z: 0.6, h: 2.0, w: 0.5 },
  { x: 0.5, z: 0.4, h: 1.5, w: 0.42 },
  { x: 1.1, z: 0.7, h: 0.85, w: 0.34 },
  { x: 0, z: 0, h: 2.4, w: 0.55 },
  { x: -0.7, z: -0.2, h: 0.65, w: 0.3 },
  { x: 0.7, z: -0.35, h: 1.0, w: 0.38 },
];

export function VoxelCity() {
  const group = useRef<THREE.Group>(null);

  const boxes = useMemo(() => {
    return BUILDINGS.map((b, i) => ({
      ...b,
      key: i,
      depth: 0.3 + (i % 5) * 0.05,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.15) * 0.08 + t * 0.02;
    }
  });

  return (
    <group ref={group} position={[0.35, -0.55, 0]}>
      {boxes.map((b) => (
        <mesh key={b.key} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshStandardMaterial
            color={NEXUS.lime}
            emissive={NEXUS.lime}
            emissiveIntensity={0.8 + b.depth}
            transparent
            opacity={0.88}
            toneMapped={false}
            wireframe={false}
          />
        </mesh>
      ))}
      {boxes.map((b) => (
        <lineSegments key={`w-${b.key}`} position={[b.x, b.h / 2, b.z]}>
          <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.w)]} />
          <lineBasicMaterial
            color={NEXUS.limeBright}
            transparent
            opacity={0.72}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      ))}
    </group>
  );
}
