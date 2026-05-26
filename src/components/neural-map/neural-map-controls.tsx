"use client";

import { useEffect, useRef } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/** Drag orbit only — wheel zoom disabled; idle target drift for cinematic feel */
export function NeuralMapControls() {
  const ref = useRef<OrbitControlsImpl>(null);
  const interacting = useRef(false);
  const idleBlend = useRef(1);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.2, 15);
    camera.lookAt(0, 0, 0);
    if (ref.current) {
      ref.current.target.set(0, 0, 0);
      ref.current.update();
    }
  }, [camera]);

  const onInteractionStart = () => {
    interacting.current = true;
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
  };

  const onInteractionEnd = () => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    releaseTimer.current = setTimeout(() => {
      interacting.current = false;
    }, 2600);
  };

  useFrame((state, delta) => {
    const controls = ref.current;
    if (!controls) return;

    const targetIdle = interacting.current ? 0 : 1;
    idleBlend.current += (targetIdle - idleBlend.current) * Math.min(1, delta * 2.2);

    if (idleBlend.current < 0.03) {
      controls.target.set(0, 0, 0);
      return;
    }

    const t = state.clock.elapsedTime;
    const b = idleBlend.current;
    controls.target.set(
      Math.sin(t * 0.13) * 0.11 * b,
      Math.sin(t * 0.1 + 0.5) * 0.055 * b,
      0
    );
    controls.update();
  });

  useEffect(() => {
    return () => {
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, []);

  return (
    <DreiOrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      minPolarAngle={Math.PI * 0.08}
      maxPolarAngle={Math.PI * 0.92}
      autoRotate={false}
      onStart={onInteractionStart}
      onEnd={onInteractionEnd}
    />
  );
}
