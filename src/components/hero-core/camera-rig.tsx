"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useAtmosphere } from "@/context/atmosphere-context";

const FOCUS = new THREE.Vector3(0.5, 0.18, 0);

export function CameraRig() {
  const { camera } = useThree();
  const { pointerNX, pointerNY, ready } = useAtmosphere();
  const drift = useRef({ t: 0 });

  useFrame((_, delta) => {
    drift.current.t += delta;
    const t = drift.current.t;

    const targetX = (ready ? pointerNX * 0.45 : 0) + 0.75 + Math.sin(t * 0.09) * 0.22;
    const targetY = (ready ? 2.05 + pointerNY * 0.18 : 2.05) + Math.cos(t * 0.11) * 0.06;
    const targetZ = 8.4 + Math.cos(t * 0.08) * 0.35;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.028);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.028);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.025);
    camera.lookAt(FOCUS);
  });

  return null;
}
