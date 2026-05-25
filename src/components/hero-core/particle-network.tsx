"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const NODE_COUNT = 42;
const CONNECT_DIST = 1.45;

function seededPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const r = s - Math.floor(s);
    const s2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 419.2 + 71.9) * 43758.5453;
    const r3 = s3 - Math.floor(s3);
    const radius = 1.2 + r * 1.8;
    const theta = r2 * Math.PI * 2;
    const phi = (r3 - 0.5) * Math.PI * 0.85;
    pos[i * 3] = Math.cos(theta) * Math.cos(phi) * radius;
    pos[i * 3 + 1] = Math.sin(phi) * radius * 0.7 + 0.25;
    pos[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * radius;
  }
  return pos;
}

export function ParticleNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  const { pointGeo, lineGeo } = useMemo(() => {
    const positions = seededPositions(NODE_COUNT);
    const linePoints: number[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECT_DIST) {
          linePoints.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2],
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          );
        }
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePoints, 3)
    );

    return { pointGeo, lineGeo };
  }, []);

  useFrame((_, delta) => {
    time.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = time.current * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points geometry={pointGeo}>
        <pointsMaterial
          color={NEXUS.cyan}
          size={0.045}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
