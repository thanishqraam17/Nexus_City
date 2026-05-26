"use client";

import { useEffect, useRef } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/** Drag-only orbit — no wheel zoom (page scroll stays stable) */
export function NeuralMapControls() {
  const ref = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    camera.position.set(0, 0.12, 13.4);
    camera.lookAt(0, 0, 0);
    if (ref.current) {
      ref.current.target.set(0, 0, 0);
      ref.current.update();
    }
  }, [camera]);

  const scheduleIdle = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (ref.current) ref.current.autoRotate = false;

    idleTimer.current = setTimeout(() => {
      if (ref.current) ref.current.autoRotate = true;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <DreiOrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.55}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.88}
      autoRotate
      autoRotateSpeed={0.2}
      onStart={scheduleIdle}
      onEnd={scheduleIdle}
    />
  );
}
