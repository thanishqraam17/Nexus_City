"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useOsRuntimeStore } from "@/store/os-runtime-store";

const BARS = 12;

export function AmbientPulse() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const load = useOsRuntimeStore((s) => s.infrastructureLoad);
  const syncPercent = useOsRuntimeStore((s) => s.syncPercent);

  if (!mounted || reduceMotion) return null;

  const intensity = 0.28 + load / 220 + (syncPercent - 97) / 80;

  return (
    <div
      className="ambient-pulse pointer-events-none fixed bottom-0 left-0 right-0 z-[15] flex justify-center gap-1 pb-2"
      style={{ opacity: Math.min(0.55, intensity) }}
      aria-hidden
    >
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          className="ambient-pulse-bar w-px bg-nexus-lime/50"
          style={{
            animationDelay: `${i * (0.14 - load / 800)}s`,
            animationDuration: `${1.8 + (i % 4) * 0.15 + load / 100}s`,
            height: `${6 + (i % 5) * 2 + Math.floor(load / 18)}px`,
          }}
        />
      ))}
    </div>
  );
}
