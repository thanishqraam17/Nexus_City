"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig } from "./camera-rig";
import { SceneLights } from "./scene-lights";
import { CityGrid } from "./city-grid";
import { WireframeCore } from "./wireframe-core";
import { ParticleNetwork } from "./particle-network";
import { PulseRings } from "./pulse-rings";
import { OrbitNodes } from "./orbit-nodes";
import { TrafficLines } from "./traffic-lines";
import { DataStreams } from "./data-streams";
import { ScanLayer } from "./scan-layer";
import { NEXUS } from "./colors";

export function NeuralCoreScene() {
  const sceneRoot = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sceneRoot.current) {
      sceneRoot.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 5, 16]} />
      <SceneLights />
      <CameraRig />

      <group ref={sceneRoot}>
        <CityGrid />
        <TrafficLines />
        <PulseRings />
        <WireframeCore />
        <ParticleNetwork />
        <OrbitNodes />
        <DataStreams />
        <ScanLayer />
      </group>
    </>
  );
}
