"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const STREAM_COUNT = 64;

export function ParticleStreams() {
  const points = useRef<THREE.Points>(null);
  const offsets = useRef<Float32Array>(
    new Float32Array(STREAM_COUNT).map((_, i) => i / STREAM_COUNT)
  );

  const { geometry, basePositions } = useMemo(() => {
    const positions = new Float32Array(STREAM_COUNT * 3);
    for (let i = 0; i < STREAM_COUNT; i++) {
      const s = Math.sin(i * 73.2) * 43758.5453;
      const r = s - Math.floor(s);
      const angle = (i / STREAM_COUNT) * Math.PI * 2 + r * 0.5;
      const radius = 2.5 + r * 1.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (r - 0.5) * 3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, basePositions: positions };
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < STREAM_COUNT; i++) {
      offsets.current[i] = (offsets.current[i] + delta * (0.08 + (i % 5) * 0.01)) % 1;
      const t = offsets.current[i];
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      arr[i * 3] = bx * (1 - t * 0.75) + 0.4 * t;
      arr[i * 3 + 1] = THREE.MathUtils.lerp(by, 0.35, t);
      arr[i * 3 + 2] = bz * (1 - t * 0.75);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color={NEXUS.lime}
        size={0.035}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
