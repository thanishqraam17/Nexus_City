"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEURAL_ORBIT_RADII } from "@/lib/system/neural-layout";
import { NEXUS } from "@/components/hero-core/colors";

/** Rotating orbital rings + holographic scan pulse */
export function NeuralOrbitRings({ active }: { active: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) outerRef.current.rotation.y = t * 0.12;
    if (innerRef.current) innerRef.current.rotation.y = -t * 0.18;
    if (scanRef.current) {
      const pulse = 0.92 + Math.sin(t * 1.1) * 0.06;
      scanRef.current.scale.set(pulse, pulse, 1);
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.4) * 0.04 + (active ? 0.06 : 0);
    }
  });

  return (
    <group position={[0, 0.02, 0]}>
      <mesh ref={outerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[NEURAL_ORBIT_RADII.outer, 0.008, 8, 80]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[NEURAL_ORBIT_RADII.inner, 0.006, 8, 64]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[NEURAL_ORBIT_RADII.inner * 0.85, NEURAL_ORBIT_RADII.outer * 1.05, 64]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
