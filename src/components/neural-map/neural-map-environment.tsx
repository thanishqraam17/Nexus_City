"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NEURAL_ORBIT_RADII } from "@/lib/system/neural-layout";
import { NEXUS } from "@/components/hero-core/colors";

const DUST_COUNT = 40;
const TOWER_COUNT = 16;
const TRAFFIC_LANES = 5;

function buildDust(): Float32Array {
  const pos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    const s = Math.sin(i * 97.3 + 12.1) * 43758.5453;
    const r = s - Math.floor(s);
    const s2 = Math.sin(i * 43.7 + 88.2) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 61.1 + 3.9) * 43758.5453;
    const r3 = s3 - Math.floor(s3);
    const radius = NEURAL_ORBIT_RADII.outer + 1.2 + r * 3;
    const theta = r2 * Math.PI * 2;
    const phi = (r3 - 0.5) * Math.PI * 0.28;
    pos[i * 3] = Math.cos(theta) * Math.cos(phi) * radius;
    pos[i * 3 + 1] = Math.sin(phi) * radius * 0.3 + (r3 - 0.5) * 0.35;
    pos[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * radius;
  }
  return pos;
}

function buildTowers(): { pos: [number, number, number]; scale: [number, number, number] }[] {
  const towers: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
  for (let i = 0; i < TOWER_COUNT; i++) {
    const s = Math.sin(i * 41.2) * 43758.5453;
    const r = s - Math.floor(s);
    const angle = (i / TOWER_COUNT) * Math.PI * 2 + 0.2;
    const radius = NEURAL_ORBIT_RADII.outer + 2.8 + r * 1.5;
    const h = 0.4 + r * 1.8;
    towers.push({
      pos: [Math.cos(angle) * radius, -1.2 + r * 0.3, Math.sin(angle) * radius],
      scale: [0.04 + r * 0.03, h, 0.04 + r * 0.02],
    });
  }
  return towers;
}

function buildTrafficPaths(): THREE.Vector3[][] {
  const paths: THREE.Vector3[][] = [];
  for (let i = 0; i < TRAFFIC_LANES; i++) {
    const r = NEURAL_ORBIT_RADII.inner + 0.4 + i * 0.35;
    const y = -0.6 + i * 0.08;
    const pts: THREE.Vector3[] = [];
    for (let j = 0; j <= 24; j++) {
      const t = (j / 24) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
    }
    paths.push(pts);
  }
  return paths;
}

export function NeuralMapEnvironment() {
  const dustRef = useRef<THREE.Points>(null);
  const hazeRef = useRef<THREE.Mesh>(null);
  const bloomRef = useRef<THREE.Mesh>(null);
  const trafficRefs = useRef<THREE.Mesh[]>([]);

  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(buildDust(), 3));
    return g;
  }, []);

  const towers = useMemo(() => buildTowers(), []);
  const trafficPaths = useMemo(() => buildTrafficPaths(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.018;
      const mat = dustRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.26 + Math.sin(t * 0.4) * 0.07;
    }

    if (hazeRef.current) {
      hazeRef.current.rotation.y = -t * 0.012;
      const mat = hazeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.045 + Math.sin(t * 0.65) * 0.012;
    }

    if (bloomRef.current) {
      const s = 1 + Math.sin(t * 0.45) * 0.035;
      bloomRef.current.scale.set(s, s, s);
    }

    trafficRefs.current.forEach((mesh, lane) => {
      if (!mesh) return;
      const path = trafficPaths[lane];
      if (!path?.length) return;
      const speed = 0.12 + lane * 0.02;
      const idx = (t * speed + lane * 0.17) % 1;
      const seg = idx * (path.length - 1);
      const i0 = Math.floor(seg);
      const i1 = Math.min(i0 + 1, path.length - 1);
      const f = seg - i0;
      mesh.position.lerpVectors(path[i0], path[i1], f);
    });
  });

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 20, 52]} />
      <ambientLight intensity={0.22} />
      <hemisphereLight
        args={[NEXUS.cyan, NEXUS.void, 0.38]}
        position={[0, 5, 0]}
      />
      <directionalLight
        position={[6, 8, 4]}
        intensity={0.35}
        color={NEXUS.lime}
      />
      <pointLight position={[0, 2, 0]} intensity={0.8} color={NEXUS.cyan} distance={14} />

      <mesh ref={bloomRef} position={[0, 0, 0]}>
        <sphereGeometry args={[NEURAL_ORBIT_RADII.outer * 1.2, 24, 16]} />
        <meshBasicMaterial
          color={NEXUS.cyan}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={hazeRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[NEURAL_ORBIT_RADII.inner * 0.45, NEURAL_ORBIT_RADII.outer * 1.25, 72]}
        />
        <meshBasicMaterial
          color={NEXUS.lime}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Distant infrastructure — very subtle, no solid mass */}
      <group position={[0, -1.4, 0]}>
        {towers.map((tower, i) => (
          <mesh key={i} position={tower.pos} scale={tower.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? NEXUS.cyan : NEXUS.lime}
              transparent
              opacity={0.035 + (i % 5) * 0.008}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Orbital traffic pulses */}
      {trafficPaths.map((path, lane) => (
        <mesh
          key={`traffic-${lane}`}
          ref={(el) => {
            if (el) trafficRefs.current[lane] = el;
          }}
        >
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial
            color={NEXUS.limeBright}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <points ref={dustRef} geometry={dustGeo}>
        <pointsMaterial
          color={NEXUS.cyan}
          size={0.028}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}
