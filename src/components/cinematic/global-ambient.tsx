"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/** Site-wide living atmosphere — CSS-only, lightweight */
export function GlobalAmbient() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();

  if (!mounted || reduceMotion) return null;

  return (
    <div className="global-ambient pointer-events-none fixed inset-0 z-[2]" aria-hidden>
      <div className="global-ambient-pulse" />
      <div className="global-ambient-gradient" />
      <div className="global-ambient-scan" />
      <div className="global-ambient-bloom" />
    </div>
  );
}
