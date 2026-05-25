"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

export function DataPlatform() {
  const ring = useRef<THREE.Mesh>(null);
  const disk = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring.current) ring.current.rotation.y = t * 0.35;
    if (disk.current) {
      const mat = disk.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.9) * 0.05;
    }
  });

  return (
    <group position={[0.35, -0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={disk}>
        <circleGeometry args={[2.4, 64]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.15, 0.012, 8, 128]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 128]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
