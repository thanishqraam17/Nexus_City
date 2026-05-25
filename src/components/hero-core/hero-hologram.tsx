"use client";

import dynamic from "next/dynamic";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";
import { cn } from "@/lib/utils";

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
      <div className="hero-core-bleed hero-core-bleed-lime" />
      <div className="hero-core-bleed hero-core-bleed-cyan" />

      <div className="hero-core-canvas-wrap">
        {ready ? <HeroCoreCanvas /> : <HeroCoreFallback />}
      </div>

      <div className="hero-core-feather" />
      <div className="hero-core-depth-fade hero-core-depth-fade-left" />
      <div className="hero-core-depth-fade hero-core-depth-fade-right" />
      <div className="hero-core-depth-fade hero-core-depth-fade-bottom" />
      <div className="hero-core-chromatic" />
    </div>
  );
}

/** Wraps hero UI that should pick up core environmental light */
export function HeroCoreAdjacent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("hero-core-adjacent", className)}>{children}</div>;
}
