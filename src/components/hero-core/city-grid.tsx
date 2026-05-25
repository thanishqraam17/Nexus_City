"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const GRID_SIZE = 14;
const SPACING = 0.55;

export function CityGrid() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef(0);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const half = (GRID_SIZE * SPACING) / 2;

    for (let i = 0; i <= GRID_SIZE; i++) {
      const o = i * SPACING - half;
      points.push(-half, 0, o, half, 0, o);
      points.push(o, 0, -half, o, 0, half);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    return geo;
  }, []);

  useFrame((_, delta) => {
    pulseRef.current += delta;
    if (linesRef.current) {
      const m = linesRef.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.22 + Math.sin(pulseRef.current * 1.2) * 0.08;
    }
  });

  return (
    <group position={[0, -0.85, 0]}>
      <lineSegments ref={linesRef} geometry={geometry}>
        <lineBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[GRID_SIZE * SPACING, GRID_SIZE * SPACING]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
