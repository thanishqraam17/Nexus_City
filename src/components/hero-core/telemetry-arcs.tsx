"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const ARCS = [
  { radius: 2.2, start: 0, length: Math.PI * 1.2, speed: 0.25, color: NEXUS.lime, y: 0.3 },
  { radius: 2.65, start: Math.PI * 0.4, length: Math.PI * 0.9, speed: -0.2, color: NEXUS.cyan, y: -0.15 },
  { radius: 3.05, start: Math.PI * 1.1, length: Math.PI * 1.4, speed: 0.16, color: NEXUS.lime, y: 0.5 },
];

function buildArcGeometry(
  radius: number,
  start: number,
  length: number,
  segments: number
) {
  const points: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = start + (length * i) / segments;
    points.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geo;
}

export function TelemetryArcs() {
  const group = useRef<THREE.Group>(null);

  const geometries = useMemo(
    () =>
      ARCS.map((a) => buildArcGeometry(a.radius, a.start, a.length, 64)),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.rotation.y = t * ARCS[i].speed;
      const line = child.children[0] as THREE.LineSegments | undefined;
      if (!line) return;
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 1.5 + i) * 0.15;
    });
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2.2, 0, 0]}>
      {geometries.map((geo, i) => (
        <group key={i} position={[0, ARCS[i].y, 0]}>
          <lineSegments geometry={geo}>
            <lineBasicMaterial
              color={ARCS[i].color}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
