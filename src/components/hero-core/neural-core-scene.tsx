"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig } from "./camera-rig";
import { SceneLights } from "./scene-lights";
import { CityGrid } from "./city-grid";
import { DataPlatform } from "./data-platform";
import { WireframeCore } from "./wireframe-core";
import { VoxelCity } from "./voxel-city";
import { CentralBeam } from "./central-beam";
import { HoloLabels } from "./holo-labels";
import { ParticleNetwork } from "./particle-network";
import { HolographicRings } from "./holographic-rings";
import { TelemetryArcs } from "./telemetry-arcs";
import { OrbitNodes } from "./orbit-nodes";
import { WireframeStructures } from "./wireframe-structures";
import { TrafficLines } from "./traffic-lines";
import { ParticleStreams } from "./particle-streams";
import { ScanLayers } from "./scan-layers";
import { NEXUS } from "./colors";

export function NeuralCoreScene() {
  const core = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) core.current.rotation.y = t * 0.018;
    if (orbit.current) orbit.current.rotation.y = -t * 0.025;
  });

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 14, 34]} />
      <SceneLights />
      <CameraRig />

      <group position={[0.35, 0.02, 0]}>
        <CityGrid />
        <DataPlatform />

        <group ref={core}>
          <WireframeCore />
          <VoxelCity />
          <CentralBeam />
          <ParticleNetwork />
          <TrafficLines />
        </group>

        <group ref={orbit}>
          <HolographicRings />
          <TelemetryArcs />
          <OrbitNodes />
          <WireframeStructures />
          <ScanLayers />
          <ParticleStreams />
        </group>

        <HoloLabels />
      </group>
    </>
  );
}
