"use client";

import dynamic from "next/dynamic";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";

const HeroCoreCanvas = dynamic(() => import("./hero-core-canvas"), {
  ssr: false,
  loading: () => <HeroCoreFallback />,
});

function HeroCoreFallback() {
  return (
    <div className="hero-core-fallback" aria-hidden>
      <div className="hero-core-fallback-orb" />
      <div className="hero-core-fallback-ring hero-core-fallback-ring-a" />
      <div className="hero-core-fallback-ring hero-core-fallback-ring-b" />
      <div className="hero-core-fallback-ring hero-core-fallback-ring-c" />
    </div>
  );
}

export function HeroHologram() {
  const ready = useAtmosphereReady();

  return (
    <div className="hero-core-field" aria-hidden>
      <div className="hero-core-atmo-sync" />
      <div className="hero-core-canvas-wrap">
        {ready ? <HeroCoreCanvas /> : <HeroCoreFallback />}
      </div>
      <div className="hero-core-feather" />
      <div className="hero-core-depth-fade hero-core-depth-fade-bottom" />
    </div>
  );
}
