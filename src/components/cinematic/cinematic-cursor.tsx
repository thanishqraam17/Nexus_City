"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/context/cursor-context";

const TRAIL_LEN = 20;
const HEAD_SMOOTH = 0.28;
const CHAIN_SMOOTH = 0.36;

export function CinematicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LEN }, () => ({ x: 0, y: 0 }))
  );
  const rafRef = useRef<number>(0);
  const initRef = useRef(false);
  const { x, y, smoothX, smoothY, ready, reducedMotion } = useCursor();

  useEffect(() => {
    if (!ready || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

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

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      for (let i = TRAIL_LEN - 1; i >= 0; i--) {
        const p = trail[i];
        const fade = Math.pow(0.82, i);
        const radius = 5 + (TRAIL_LEN - i) * 0.35;
        const alpha = 0.08 * fade;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(212, 255, 0, ${alpha * 2.2})`);
        grad.addColorStop(0.45, `rgba(0, 240, 255, ${alpha})`);
        grad.addColorStop(1, "rgba(0, 240, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const glowGrad = ctx.createRadialGradient(
        smoothX,
        smoothY,
        0,
        smoothX,
        smoothY,
        28
      );
      glowGrad.addColorStop(0, "rgba(212, 255, 0, 0.22)");
      glowGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.08)");
      glowGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(smoothX, smoothY, 28, 0, Math.PI * 2);
      ctx.fill();

      const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, 6);
      coreGrad.addColorStop(0, "rgba(212, 255, 0, 0.95)");
      coreGrad.addColorStop(0.6, "rgba(212, 255, 0, 0.35)");
      coreGrad.addColorStop(1, "rgba(212, 255, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [x, y, smoothX, smoothY, ready, reducedMotion]);

  if (!ready || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="cinematic-cursor-canvas pointer-events-none fixed inset-0 z-[100]"
      aria-hidden
    />
  );
}
