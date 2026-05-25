"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEXUS } from "./colors";

const LAYERS = [
  { speed: 0.28, yRange: [-1.4, 2.6] as const, radius: 2.6, color: NEXUS.lime },
  { speed: 0.22, yRange: [-1.2, 2.4] as const, radius: 3.1, color: NEXUS.cyan, offset: 0.35 },
  { speed: 0.32, yRange: [-1.6, 2.8] as const, radius: 2.2, color: NEXUS.lime, offset: 0.7 },
];

export function ScanLayers() {
  const refs = useRef<THREE.Mesh[]>([]);
  const phases = useRef(LAYERS.map((l) => l.offset ?? 0));

  useFrame((_, delta) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const layer = LAYERS[i];
      phases.current[i] = (phases.current[i] + delta * layer.speed) % 1;
      const t = phases.current[i];
      mesh.position.y = THREE.MathUtils.lerp(layer.yRange[0], layer.yRange[1], t);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * Math.PI) * 0.14;
    });
  });

  return (
    <group>
      {LAYERS.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[layer.radius, layer.radius + 0.04, 80]} />
          <meshBasicMaterial
            color={layer.color}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
