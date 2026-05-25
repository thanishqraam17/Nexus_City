"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

type AxisPath =
  | { axis: "z"; z: number; start: number; end: number }
  | { axis: "x"; x: number; start: number; end: number };

const PATHS: AxisPath[] = [
  { axis: "z", z: -2, start: -3, end: 3 },
  { axis: "z", z: 0, start: 3, end: -3 },
  { axis: "z", z: 2, start: -2.5, end: 2.5 },
  { axis: "x", x: -2, start: -3, end: 3 },
  { axis: "x", x: 2, start: 3, end: -3 },
];

export function TrafficLines() {
  const dots = useRef<THREE.Group>(null);
  const progress = useRef<number[]>(PATHS.map((_, i) => i * 0.2));

  const trails = useMemo(() => {
    return PATHS.map((p) => {
      const points: number[] = [];
      if (p.axis === "z") {
        points.push(p.start, -0.82, p.z, p.end, -0.82, p.z);
      } else {
        points.push(p.x, -0.82, p.start, p.x, -0.82, p.end);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      return geo;
    });
  }, []);

  useFrame((_, delta) => {
    if (!dots.current) return;
    progress.current = progress.current.map(
      (val, i) => (val + delta * (0.15 + i * 0.03)) % 1
    );

    dots.current.children.forEach((child, i) => {
      const t = progress.current[i];
      const path = PATHS[i];
      if (path.axis === "z") {
        child.position.set(
          THREE.MathUtils.lerp(path.start, path.end, t),
          -0.8,
          path.z
        );
      } else {
        child.position.set(
          path.x,
          -0.8,
          THREE.MathUtils.lerp(path.start, path.end, t)
        );
      }
    });
  });

  return (
    <group>
      {trails.map((geo, idx) => (
        <lineSegments key={idx} geometry={geo}>
          <lineBasicMaterial
            color={NEXUS.cyan}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      ))}
      <group ref={dots}>
        {PATHS.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? NEXUS.lime : NEXUS.cyan}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
