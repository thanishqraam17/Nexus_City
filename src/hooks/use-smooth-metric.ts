"use client";

import { useSpring } from "framer-motion";
import { useEffect } from "react";

const SPRING_CFG = {
  stiffness: 90,
  damping: 28,
  mass: 0.85,
};

/**
 * Smoothly interpolates toward `target` after mount.
 * Returns the spring motion value (subscribe via useTransform / motion span).
 */
export function useSmoothMetric(target: number, enabled: boolean) {
  const spring = useSpring(target, SPRING_CFG);

  useEffect(() => {
    if (!enabled) {
      spring.jump(target);
      return;
    }
    spring.set(target);
  }, [target, enabled, spring]);

  return spring;
}
