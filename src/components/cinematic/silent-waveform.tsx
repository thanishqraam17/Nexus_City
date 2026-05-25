"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

const WAVE_POINTS = 24;

export function SilentWaveform({ className }: { className?: string }) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();

  if (!mounted || reduceMotion) return null;

  return (
    <svg
      className={className}
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden
    >
      <path
        className="silent-waveform-path"
        d="M0 12 Q15 4 30 12 T60 12 T90 12 T120 12"
        stroke="rgba(0, 240, 255, 0.35)"
        strokeWidth="1"
      />
      {Array.from({ length: WAVE_POINTS }).map((_, i) => (
        <line
          key={i}
          x1={i * 5}
          y1={12}
          x2={i * 5}
          y2={12}
          className="silent-waveform-bar"
          stroke="rgba(212, 255, 0, 0.25)"
          strokeWidth="1"
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </svg>
  );
}
