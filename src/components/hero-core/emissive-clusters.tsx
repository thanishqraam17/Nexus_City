"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const CLUSTER_COUNT = 28;

export function EmissiveClusters() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: CLUSTER_COUNT }, (_, i) => {
      const s = Math.sin(i * 91.3) * 43758.5453;
      const r = s - Math.floor(s);
      const angle = (i / CLUSTER_COUNT) * Math.PI * 2;
      return {
        x: Math.cos(angle) * (0.9 + r * 0.5),
        y: (r - 0.5) * 0.8,
        z: Math.sin(angle) * (0.9 + r * 0.5),
        color: i % 2 === 0 ? NEXUS.lime : NEXUS.cyan,
        phase: r * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const n = nodes[i];
      const pulse = 1 + Math.sin(t * 2 + n.phase) * 0.25;
      child.scale.setScalar(pulse);
      child.position.y = n.y + Math.sin(t * 0.6 + n.phase) * 0.05;
    });
  });

  return (
    <group ref={group} position={[0.4, 0.25, 0]}>
      {nodes.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={1.5 + (i % 3) * 0.5}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
