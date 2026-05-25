"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/** Page-wide scroll-linked atmospheric tint — descent into the OS */
export function ScrollEnvironment() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll();

  const cyan = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0.03, 0.08, 0.05, 0.07, 0.04]);
  const lime = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.05, 0.03, 0.08, 0.06]);
  const depth = useTransform(scrollYProgress, [0, 1], [0, 0.15]);

  if (!mounted || reduceMotion) return null;

  return (
    <div className="scroll-environment pointer-events-none fixed inset-0 z-[4]" aria-hidden>
      <motion.div className="scroll-environment-cyan absolute inset-0" style={{ opacity: cyan }} />
      <motion.div className="scroll-environment-lime absolute inset-0" style={{ opacity: lime }} />
      <motion.div
        className="scroll-environment-depth absolute inset-0"
        style={{ opacity: depth }}
      />
    </div>
  );
}
