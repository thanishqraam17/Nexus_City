"use client";

import dynamic from "next/dynamic";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";
import { cn } from "@/lib/utils";

const HeroCoreCanvas = dynamic(() => import("./hero-core-canvas"), {
  ssr: false,
  loading: () => <HeroHologramFallback />,
});

function HeroHologramFallback() {
  return (
    <div className="hero-hologram-fallback absolute inset-0" aria-hidden>
      <div className="hero-hologram-fallback-core" />
      <div className="hero-hologram-fallback-ring hero-hologram-fallback-ring-1" />
      <div className="hero-hologram-fallback-ring hero-hologram-fallback-ring-2" />
    </div>
  );
}

export function HeroHologram({ className }: { className?: string }) {
  const ready = useAtmosphereReady();

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 z-[6] w-full max-w-[920px] -translate-x-1/2",
        className
      )}
      aria-hidden
    >
      <div className="hero-hologram-vignette relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[16/10]">
        {ready ? <HeroCoreCanvas /> : <HeroHologramFallback />}
        <div className="hero-hologram-mask absolute inset-0" />
        <div className="hero-hologram-glow absolute inset-0" />
      </div>
    </div>
  );
}
