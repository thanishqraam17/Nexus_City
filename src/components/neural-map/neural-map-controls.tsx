"use client";

import { useEffect, useRef } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/** Full horizontal orbit, controlled vertical arc, premium damping */
export function NeuralMapControls() {
  const ref = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    camera.position.set(0, 0.25, 12.5);
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
    }, 2800);
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
      dampingFactor={0.055}
      rotateSpeed={0.7}
      zoomSpeed={0.65}
      minDistance={7}
      maxDistance={15}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.88}
      autoRotate
      autoRotateSpeed={0.22}
      onStart={scheduleIdle}
      onEnd={scheduleIdle}
    />
  );
}
