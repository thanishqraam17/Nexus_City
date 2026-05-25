"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEURAL_ORBIT_RADII } from "@/lib/system/neural-layout";
import { NEXUS } from "@/components/hero-core/colors";

const DUST_COUNT = 48;

function buildDust(): Float32Array {
  const pos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    const s = Math.sin(i * 97.3 + 12.1) * 43758.5453;
    const r = s - Math.floor(s);
    const s2 = Math.sin(i * 43.7 + 88.2) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 61.1 + 3.9) * 43758.5453;
    const r3 = s3 - Math.floor(s3);
    const radius = NEURAL_ORBIT_RADII.outer + 0.8 + r * 2.5;
    const theta = r2 * Math.PI * 2;
    const phi = (r3 - 0.5) * Math.PI * 0.35;
    pos[i * 3] = Math.cos(theta) * Math.cos(phi) * radius;
    pos[i * 3 + 1] = Math.sin(phi) * radius * 0.35 + (r3 - 0.5) * 0.4;
    pos[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * radius;
  }
  return pos;
}

export function NeuralMapEnvironment() {
  const dustRef = useRef<THREE.Points>(null);
  const hazeRef = useRef<THREE.Mesh>(null);
  const bloomRef = useRef<THREE.Mesh>(null);

  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(buildDust(), 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.02;
      const mat = dustRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.28 + Math.sin(t * 0.45) * 0.08;
    }

    if (hazeRef.current) {
      hazeRef.current.rotation.y = -t * 0.015;
      const mat = hazeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 0.7) * 0.015;
    }

    if (bloomRef.current) {
      const s = 1 + Math.sin(t * 0.5) * 0.04;
      bloomRef.current.scale.set(s, s, s);
    }
  });

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 12, 28]} />
      <ambientLight intensity={0.25} />
      <hemisphereLight
        args={[NEXUS.cyan, NEXUS.void, 0.35]}
        position={[0, 4, 0]}
      />

      <mesh ref={bloomRef} position={[0, 0, 0]}>
        <sphereGeometry args={[NEURAL_ORBIT_RADII.outer * 1.15, 24, 16]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.035}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={hazeRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            NEURAL_ORBIT_RADII.inner * 0.5,
            NEURAL_ORBIT_RADII.outer * 1.2,
            64,
          ]}
        />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <points ref={dustRef} geometry={dustGeo}>
        <pointsMaterial
          color={NEXUS.cyan}
          size={0.03}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}
