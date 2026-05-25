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

export function useParallaxMouse(intensity = 0.04) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x.set((e.clientX - cx) * intensity);
      y.set((e.clientY - cy) * intensity);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [intensity, x, y]);

  return { x: smoothX, y: smoothY };
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
