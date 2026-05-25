"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

const BARS = 12;

export function AmbientPulse() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();

  if (!mounted || reduceMotion) return null;

  return (
    <div
      className="ambient-pulse pointer-events-none fixed bottom-0 left-0 right-0 z-[15] flex justify-center gap-1 pb-2 opacity-40"
      aria-hidden
    >
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          className="ambient-pulse-bar w-px bg-nexus-lime/50"
          style={{
            animationDelay: `${i * 0.12}s`,
            height: `${8 + (i % 5) * 3}px`,
          }}
        />
      ))}
    </div>
  );
}
