"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";

const GRID_GRADIENT_CLASS = "animated-grid-gradients";
const GRID_STATIC_CLASS = "animated-grid-static";
const GRID_NOISE_CLASS = "animated-grid-noise";

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const showCanvas = useMemo(
    () => mounted && !reduceMotion,
    [mounted, reduceMotion]
  );

  useEffect(() => {
    if (!showCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const spacing = 56;
      const offsetX = (time * 12) % spacing;
      const offsetY = (time * 8) % spacing;

      ctx.lineWidth = 1;

      for (let x = -spacing + offsetX; x < w + spacing; x += spacing) {
        const alpha = 0.04 + Math.sin(x * 0.01 + time) * 0.02;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      for (let y = -spacing + offsetY; y < h + spacing; y += spacing) {
        const alpha = 0.04 + Math.cos(y * 0.01 + time * 1.2) * 0.02;
        ctx.strokeStyle = `rgba(212, 255, 0, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const pulseCount = 6;
      for (let i = 0; i < pulseCount; i++) {
        const px = (i * 137 + time * 40) % w;
        const py = (i * 89 + time * 25) % h;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 120);
        grad.addColorStop(0, "rgba(212, 255, 0, 0.08)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(px - 120, py - 120, 240, 240);
      }

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [showCanvas]);

  useEffect(() => {
    if (!showCanvas) return;
    const tween = gsap.to(".grid-scan-line", {
      y: "100vh",
      duration: 8,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [showCanvas]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-void" />
      <div className={`absolute inset-0 opacity-40 ${GRID_GRADIENT_CLASS}`} />
      <div className={`absolute inset-0 opacity-30 ${GRID_STATIC_CLASS}`} />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full mix-blend-screen ${
          showCanvas ? "opacity-70" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showCanvas}
      />
      {mounted && !reduceMotion ? (
        <motion.div
          className="grid-scan-line absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lime/40 to-transparent shadow-[0_0_24px_rgba(212,255,0,0.5)]"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <div className="grid-scan-line absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lime/40 to-transparent opacity-60 shadow-[0_0_24px_rgba(212,255,0,0.5)]" />
      )}
      <div className={`absolute inset-0 opacity-50 mix-blend-overlay ${GRID_NOISE_CLASS}`} />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
