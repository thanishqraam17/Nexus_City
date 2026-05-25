"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

export function WireframeCore() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outer.current) outer.current.rotation.y += delta * 0.35;
    if (inner.current) inner.current.rotation.x -= delta * 0.25;
    if (inner.current) inner.current.rotation.z += delta * 0.18;
  });

  return (
    <group position={[0.35, 0.15, 0]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.15, 2]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          wireframe
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          wireframe
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={NEXUS.lime}
          emissive={NEXUS.lime}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={NEXUS.lime} intensity={4} distance={6} />
      <pointLight color={NEXUS.cyan} intensity={2.5} distance={5} position={[0, 0, 0]} />
    </group>
  );
}
