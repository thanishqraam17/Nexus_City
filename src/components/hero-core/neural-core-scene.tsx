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
import { VolumetricGlow } from "./volumetric-glow";
import { HolographicRings } from "./holographic-rings";
import { TelemetryArcs } from "./telemetry-arcs";
import { ParticleStreams } from "./particle-streams";
import { FloatingMarkers } from "./floating-markers";
import { WireframeStructures } from "./wireframe-structures";
import { EmissiveClusters } from "./emissive-clusters";
import { ScanLayers } from "./scan-layers";
import { NEXUS } from "./colors";

export function NeuralCoreScene() {
  const shell = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shell.current) shell.current.rotation.y = t * 0.018;
    if (core.current) core.current.rotation.y = -t * 0.032;
    if (halo.current) {
      halo.current.rotation.x = Math.sin(t * 0.08) * 0.04;
      halo.current.rotation.z = Math.cos(t * 0.06) * 0.03;
    }
  });

  return (
    <>
      <fog attach="fog" args={[NEXUS.void, 4, 22]} />
      <SceneLights />
      <CameraRig />

      <group position={[0.5, 0.12, 0]}>
        <VolumetricGlow />

        <group ref={shell}>
          <CityGrid />
          <TrafficLines />
          <WireframeStructures />
          <FloatingMarkers />
          <TelemetryArcs />
        </group>

        <group ref={halo}>
          <HolographicRings />
          <PulseRings />
          <ScanLayers />
          <ParticleStreams />
          <DataStreams />
        </group>

        <group ref={core}>
          <WireframeCore />
          <ParticleNetwork />
          <EmissiveClusters />
          <OrbitNodes />
        </group>
      </group>
    </>
  );
}
