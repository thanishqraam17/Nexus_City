"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const STREAMS = 8;

export function DataStreams() {
  const dots = useRef<THREE.Mesh[]>([]);
  const offsets = useRef<number[]>(Array.from({ length: STREAMS }, (_, i) => i / STREAMS));

  const streams = useMemo(() => {
    return Array.from({ length: STREAMS }, (_, i) => {
      const angle = (i / STREAMS) * Math.PI * 2;
      const x = Math.cos(angle) * 1.8;
      const z = Math.sin(angle) * 1.8;
      const points = [x, -1.2, z, x * 0.25, 2.4, z * 0.25];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      return { geo, x, z, topX: x * 0.25, topZ: z * 0.25 };
    });
  }, []);

  useFrame((_, delta) => {
    offsets.current = offsets.current.map((o) => (o + delta * 0.14) % 1);
    dots.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = offsets.current[i];
      const s = streams[i];
      mesh.position.set(
        THREE.MathUtils.lerp(s.x, s.topX, t),
        THREE.MathUtils.lerp(-1.2, 2.4, t),
        THREE.MathUtils.lerp(s.z, s.topZ, t)
      );
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * Math.PI) * 0.55;
    });
  });

  return (
    <group>
      {streams.map((s, i) => (
        <group key={i}>
          <lineSegments geometry={s.geo}>
            <lineBasicMaterial
              color={i % 2 === 0 ? NEXUS.lime : NEXUS.cyan}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
          <mesh
            ref={(el) => {
              if (el) dots.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? NEXUS.lime : NEXUS.cyan}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
