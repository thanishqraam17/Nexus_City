"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
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

      ctx.strokeStyle = "rgba(0, 240, 255, 0.06)";
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
        const px = ((i * 137 + time * 40) % w);
        const py = ((i * 89 + time * 25) % h);
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
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    gsap.to(".grid-scan-line", {
      y: "100vh",
      duration: 8,
      repeat: -1,
      ease: "none",
    });
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-void" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(0, 240, 255, 0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 15% 80%, rgba(212, 255, 0, 0.08) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 107, 53, 0.04) 0%, transparent 45%)",
        }}
      />
      {!reduceMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-70 mix-blend-screen"
        />
      )}
      {reduceMotion && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      )}
      <motion.div
        className="grid-scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-lime/40 to-transparent"
        style={{ top: "-1px", boxShadow: "0 0 24px rgba(212, 255, 0, 0.5)" }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')] opacity-50 mix-blend-overlay" />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
