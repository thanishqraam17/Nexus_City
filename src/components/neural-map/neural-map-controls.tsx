"use client";

import { useEffect, useRef } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/** Premium orbit — no camera rig fighting; damping + soft auto-rotate when idle */
export function NeuralMapControls() {
  const ref = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    camera.position.set(0.4, 1.1, 9.2);
    camera.lookAt(0, 0.05, 0);
    if (ref.current) {
      ref.current.target.set(0, 0.05, 0);
      ref.current.update();
    }
  }, [camera]);

  const scheduleIdle = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (ref.current) ref.current.autoRotate = false;

    idleTimer.current = setTimeout(() => {
      if (ref.current) ref.current.autoRotate = true;
    }, 3200);
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
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.65}
      zoomSpeed={0.7}
      minDistance={7}
      maxDistance={12.5}
      minPolarAngle={Math.PI * 0.35}
      maxPolarAngle={Math.PI * 0.55}
      minAzimuthAngle={-Math.PI * 0.45}
      maxAzimuthAngle={Math.PI * 0.45}
      autoRotate
      autoRotateSpeed={0.28}
      onStart={scheduleIdle}
      onEnd={scheduleIdle}
    />
  );
}
