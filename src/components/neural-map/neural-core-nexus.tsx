"use client";

import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEURAL_HUB_META } from "@/lib/system/neural-data";
import { NEURAL_ORBIT_RADII } from "@/lib/system/neural-layout";
import { neuralPhase, neuralPulse } from "@/lib/system/neural-sync";
import { NEXUS } from "@/components/hero-core/colors";

interface NeuralCoreNexusProps {
  focusBoost: number;
  cursorBoost: number;
}

/** Central AI nexus — focal intelligence hub for the mesh */
export function NeuralCoreNexus({ focusBoost, cursorBoost }: NeuralCoreNexusProps) {
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const shellMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = neuralPulse(t, 0);
    const boost = 1 + focusBoost * 0.8 + cursorBoost * 0.5;

    if (coreMat.current) {
      coreMat.current.emissiveIntensity = (1.4 + pulse * 0.5) * boost;
      coreMat.current.opacity = 0.72 + pulse * 0.12;
    }
    if (shellMat.current) {
      shellMat.current.opacity = 0.06 + pulse * 0.04 + focusBoost * 0.04;
    }
    if (ringA.current) ringA.current.rotation.z = neuralPhase(t, 0, 1);
    if (ringB.current) ringB.current.rotation.z = -neuralPhase(t, 0.3, 1.2);
    if (ringC.current) {
      ringC.current.rotation.x = Math.PI / 2;
      ringC.current.rotation.z = neuralPhase(t, 0.6, 0.8);
      const s = 1 + pulse * 0.04;
      ringC.current.scale.set(s, s, 1);
    }
  });

  return (
    <group>
      <pointLight
        position={[0, 0.2, 0]}
        intensity={2.2 + focusBoost * 2 + cursorBoost * 1.2}
        color={NEXUS.limeBright}
        distance={14}
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={1.4 + focusBoost}
        color={NEXUS.cyan}
        distance={10}
      />

      <mesh renderOrder={2}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial
          ref={shellMat}
          color={NEXUS.cyan}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={ringC} renderOrder={2}>
        <torusGeometry args={[0.28, 0.004, 8, 64]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.2, 0.2, 0]} renderOrder={2}>
        <torusGeometry args={[0.34, 0.003, 6, 48]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ringB} rotation={[Math.PI / 1.8, -0.15, 0]} renderOrder={2}>
        <torusGeometry args={[0.42, 0.0025, 6, 48]} />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh renderOrder={4}>
        <sphereGeometry args={[0.12, 28, 28]} />
        <meshStandardMaterial
          ref={coreMat}
          color={NEXUS.limeBright}
          emissive={NEXUS.lime}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
        <ringGeometry args={[NEURAL_ORBIT_RADII.hub, 0.38, 48]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Html center distanceFactor={12} pointerEvents="none">
        <div className="neural-node-label neural-node-label--hub">
          <span className="neural-node-label__id">{NEURAL_HUB_META.districtId}</span>
          <span className="neural-node-label__name">{NEURAL_HUB_META.systemName}</span>
        </div>
      </Html>
    </group>
  );
}
