"use client";

import { useEffect, useRef } from "react";
import {
  useAnimation,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";

export function useParallaxMouse(intensity = 0.04) {
  const mounted = useMounted();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 52, damping: 18, mass: 1.4 });
  const smoothY = useSpring(y, { stiffness: 52, damping: 18, mass: 1.4 });

  useEffect(() => {
    if (!mounted) return;
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x.set((e.clientX - cx) * intensity);
      y.set((e.clientY - cy) * intensity);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mounted, intensity, x, y]);

  return { x: smoothX, y: smoothY };
}

/** Multi-layer parallax: mouse + scroll depth */
export function useLayeredParallax(depth = 1) {
  const mounted = useMounted();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scroll = useScrollProgress();

  const springCfg = {
    stiffness: 40 + depth * 8,
    damping: 14 + depth * 2,
    mass: 1.6 + depth * 0.4,
  };

  const x = useSpring(mouseX, springCfg);
  const y = useSpring(mouseY, springCfg);
  const scrollY = useTransform(scroll, [0, 1], [0, -80 * depth]);
  const combinedY = useTransform([y, scrollY], ([my, sy]) => (my as number) + (sy as number));

  useEffect(() => {
    if (!mounted) return;
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(nx * 18 * depth);
      mouseY.set(ny * 14 * depth);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mounted, depth, mouseX, mouseY]);

  return { x, y: combinedY, scroll: scrollY };
}

export function useInViewAnimation(
  variants: Variants,
  options?: { once?: boolean; amount?: number }
) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.25,
  });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return { ref, controls, inView };
}

export function useScrollProgress() {
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const update = () => {
      const scroll =
        window.scrollY /
        Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.set(Math.min(1, Math.max(0, scroll)));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [progress]);

  return smooth;
}

export function useMotionBlurOnScroll(threshold = 0.02) {
  const progress = useScrollProgress();
  return useTransform(progress, [0, threshold, 1], ["blur(0px)", "blur(2px)", "blur(0px)"]);
}
