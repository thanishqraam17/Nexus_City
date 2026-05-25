"use client";

import { useAtmosphere } from "@/context/atmosphere-context";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";

/** Subtle mouse-reactive environmental glow. */
export function CursorGlow() {
  const ready = useAtmosphereReady();
  const { pointerX, pointerY } = useAtmosphere();

  if (!ready) return null;

  return (
    <div
      className="os-cursor-glow pointer-events-none fixed z-[4] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: pointerX,
        top: pointerY,
        background:
          "radial-gradient(circle, rgba(0,240,255,0.06) 0%, rgba(212,255,0,0.03) 35%, transparent 68%)",
      }}
      aria-hidden
    />
  );
}
