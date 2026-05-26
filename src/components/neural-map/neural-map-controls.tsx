"use client";

import { useEffect, useRef } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/** Drag orbit only — wheel zoom disabled so page scroll is unaffected */
export function NeuralMapControls() {
  const ref = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.2, 15);
    camera.lookAt(0, 0, 0);
    if (ref.current) {
      ref.current.target.set(0, 0, 0);
      ref.current.update();
    }
  }, [camera]);

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
    />
  );
}
