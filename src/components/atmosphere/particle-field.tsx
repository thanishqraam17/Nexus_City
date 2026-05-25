"use client";

import { useEffect, useRef } from "react";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  hue: "lime" | "cyan";
}

function seedParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const r = s - Math.floor(s);
    const s2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    particles.push({
      x: r,
      y: r2,
      z: 0.2 + (r * 0.8),
      vx: (r - 0.5) * 0.00015,
      vy: -0.0002 - r2 * 0.0003,
      size: 0.5 + r * 1.5,
      hue: i % 3 === 0 ? "lime" : "cyan",
    });
  }
  return particles;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ready = useAtmosphereReady();
  const particlesRef = useRef<Particle[]>(seedParticles(90));
  const mouseRef = useRef({ nx: 0, ny: 0 });

  useEffect(() => {
    if (!ready) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        nx: e.clientX / window.innerWidth - 0.5,
        ny: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;

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

      const { nx, ny } = mouseRef.current;

      for (const p of particlesRef.current) {
        p.x += p.vx + nx * 0.00008 * p.z;
        p.y += p.vy + ny * 0.00006 * p.z;

        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = (p.x + 0.37) % 1;
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;

        const px = p.x * w;
        const py = p.y * h;
        const alpha = 0.15 + p.z * 0.35;
        const color =
          p.hue === "lime"
            ? `rgba(212, 255, 0, ${alpha})`
            : `rgba(0, 240, 255, ${alpha * 0.85})`;

        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.5 + p.z), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (p.z > 0.6) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - nx * 12 * p.z, py - ny * 8 * p.z);
          ctx.strokeStyle = color.replace(String(alpha), String(alpha * 0.3));
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 opacity-80 mix-blend-screen"
      aria-hidden
    />
  );
}
