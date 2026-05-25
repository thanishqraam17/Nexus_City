"use client";

import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";
import { FogLayer } from "./fog-layer";
import { ParticleField } from "./particle-field";
import { Scanlines } from "./scanlines";
import { LightSweeps } from "./light-sweeps";
import { DataStreams } from "./data-streams";
import { HoloOverlay } from "./holo-overlay";
import { AmbientReflections } from "./ambient-reflections";

function AtmosphereStaticShell() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      <div className="atmo-fog-blob atmo-fog-cyan absolute -left-[10%] top-[15%] h-[55vh] w-[55vw] opacity-60" />
      <div className="atmo-fog-blob atmo-fog-lime absolute -right-[15%] top-[40%] h-[50vh] w-[50vw] opacity-50" />
      <div className="atmo-scanlines absolute inset-0 opacity-[0.05]" />
      <div className="atmo-noise-drift absolute inset-0 opacity-[0.04]" />
    </div>
  );
}

export function CinematicAtmosphere() {
  const ready = useAtmosphereReady();

  if (!ready) {
    return <AtmosphereStaticShell />;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
      aria-hidden
    >
      <FogLayer />
      <LightSweeps />
      <AmbientReflections />
      <ParticleField />
      <DataStreams />
      <Scanlines />
      <HoloOverlay />
      <div className="atmo-vignette-pulse absolute inset-0" />
    </div>
  );
}
