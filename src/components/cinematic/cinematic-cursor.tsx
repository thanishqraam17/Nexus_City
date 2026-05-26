"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/context/cursor-context";

const TRAIL_LEN = 14;
const HEAD_SMOOTH = 0.32;
const CHAIN_SMOOTH = 0.38;

export function CinematicCursor() {
  const { x, y, smoothX, smoothY, ready, reducedMotion } = useCursor();
  const trailRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LEN }, () => ({ x: 0, y: 0 }))
  );
  const rafRef = useRef<number>(0);
  const initRef = useRef(false);

  useEffect(() => {
    if (!ready || reducedMotion) return;

    if (!initRef.current && x > 0 && y > 0) {
      trailRef.current.forEach((p) => {
        p.x = x;
        p.y = y;
      });
      initRef.current = true;
    }

    const tick = () => {
      const trail = trailRef.current;
      const head = trail[0];
      head.x += (x - head.x) * HEAD_SMOOTH;
      head.y += (y - head.y) * HEAD_SMOOTH;

      for (let i = 1; i < TRAIL_LEN; i++) {
        const prev = trail[i - 1];
        const curr = trail[i];
        curr.x += (prev.x - curr.x) * CHAIN_SMOOTH;
        curr.y += (prev.y - curr.y) * CHAIN_SMOOTH;
      }

      trail.forEach((p, i) => {
        const el = document.getElementById(`cursor-trail-${i}`);
        if (!el) return;
        const fade = Math.pow(0.78, i);
        const size = 6 - i * 0.25;
        el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        el.style.opacity = String(0.42 * fade);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.filter = `blur(${0.5 + i * 0.45}px)`;
      });

      const glow = document.getElementById("cursor-glow-main");
      const glowOuter = document.getElementById("cursor-glow-outer");
      const core = document.getElementById("cursor-core-main");
      const persistence = document.getElementById("cursor-persistence-main");

      if (glow) {
        glow.style.transform = `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%)`;
      }
      if (glowOuter) {
        glowOuter.style.transform = `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%) scale(${1 + Math.sin(performance.now() * 0.002) * 0.04})`;
      }
      if (core) {
        core.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      if (persistence) {
        persistence.style.transform = `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%)`;
        persistence.style.opacity = String(0.55 + Math.sin(performance.now() * 0.003) * 0.15);
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
        <span
          key={i}
          id={`cursor-trail-${i}`}
          className={
            i < 4 ? "cinematic-cursor-trail cinematic-cursor-trail--bright" : "cinematic-cursor-trail"
          }
        />
      ))}
      <span id="cursor-glow-outer" className="cinematic-cursor-glow cinematic-cursor-glow--outer" />
      <span id="cursor-glow-main" className="cinematic-cursor-glow" />
      <span id="cursor-persistence-main" className="cinematic-cursor-persistence" />
      <span id="cursor-core-main" className="cinematic-cursor-core" />
    </div>
  );
}
