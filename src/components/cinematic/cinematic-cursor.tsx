"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/context/cursor-context";

const TRAIL_LEN = 10;
const TRAIL_SMOOTH = 0.22;

export function CinematicCursor() {
  const { x, y, smoothX, smoothY, ready, reducedMotion } = useCursor();
  const trailRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LEN }, () => ({ x: 0, y: 0 }))
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!ready || reducedMotion) return;

    const tick = () => {
      const trail = trailRef.current;
      const head = trail[0];
      head.x += (x - head.x) * TRAIL_SMOOTH;
      head.y += (y - head.y) * TRAIL_SMOOTH;

      for (let i = 1; i < TRAIL_LEN; i++) {
        const prev = trail[i - 1];
        const curr = trail[i];
        curr.x += (prev.x - curr.x) * TRAIL_SMOOTH;
        curr.y += (prev.y - curr.y) * TRAIL_SMOOTH;
      }

      trail.forEach((p, i) => {
        const el = document.getElementById(`cursor-trail-${i}`);
        if (el) {
          const fade = Math.pow(0.72, i);
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${1 - i * 0.04})`;
          el.style.opacity = String(0.28 * fade);
        }
      });

      const glow = document.getElementById("cursor-glow-main");
      const core = document.getElementById("cursor-core-main");
      if (glow) {
        glow.style.transform = `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%)`;
      }
      if (core) {
        core.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [x, y, smoothX, smoothY, ready, reducedMotion]);

  if (!ready || reducedMotion) return null;

  return (
    <div className="cinematic-cursor pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {Array.from({ length: TRAIL_LEN }).map((_, i) => (
        <span key={i} id={`cursor-trail-${i}`} className="cinematic-cursor-trail" />
      ))}
      <span id="cursor-glow-main" className="cinematic-cursor-glow" />
      <span id="cursor-core-main" className="cinematic-cursor-core" />
      <span className="cinematic-cursor-persistence" style={{ transform: `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%)` }} />
    </div>
  );
}
