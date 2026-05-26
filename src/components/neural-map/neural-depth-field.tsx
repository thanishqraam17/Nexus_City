"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEURAL_ORBIT_RADII } from "@/lib/system/neural-layout";
import { neuralPulse } from "@/lib/system/neural-sync";
import { NEXUS } from "@/components/hero-core/colors";

const FAR_COUNT = 36;

function buildFarField(): Float32Array {
  const pos = new Float32Array(FAR_COUNT * 3);
  for (let i = 0; i < FAR_COUNT; i++) {
    const s = Math.sin(i * 53.1) * 43758.5453;
    const r = s - Math.floor(s);
    const s2 = Math.sin(i * 29.7) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const radius = NEURAL_ORBIT_RADII.outer + 2.5 + r * 4;
    const theta = r2 * Math.PI * 2;
    pos[i * 3] = Math.cos(theta) * radius;
    pos[i * 3 + 1] = (r - 0.5) * 0.6;
    pos[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return pos;
}

/** Distant infrastructure lights + depth atmosphere */
export function NeuralDepthField() {
  const pointsRef = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(buildFarField(), 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = neuralPulse(t, 1.2);

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.008;
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.12 + pulse * 0.06;
    }
  });

  return (
  <>
      <fog attach="fog" args={[NEXUS.void, 18, 48]} />
      <points ref={pointsRef} geometry={geo} renderOrder={0}>
        <pointsMaterial
          color={NEXUS.cyan}
          size={0.02}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}
