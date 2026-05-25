"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useAtmosphere } from "@/context/atmosphere-context";

export function CameraRig() {
  const { camera } = useThree();
  const { pointerNX, pointerNY, ready } = useAtmosphere();
  const drift = useRef({ t: 0 });

  useFrame((_, delta) => {
    drift.current.t += delta;
    const t = drift.current.t;

    const targetX = ready ? pointerNX * 0.65 : 0;
    const targetY = ready ? 2.2 + pointerNY * 0.25 : 2.2;
    const orbitX = Math.sin(t * 0.12) * 0.35;
    const orbitZ = 7.8 + Math.cos(t * 0.1) * 0.4;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + orbitX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, orbitZ, 0.03);
    camera.lookAt(0, 0.15, 0);
  });

  return null;
}
