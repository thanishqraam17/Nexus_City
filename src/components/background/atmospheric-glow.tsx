"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { useParallaxMouse } from "@/lib/motion/hooks";

function StaticGlow() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <div className="absolute -right-[20%] top-[10%] h-[50vh] w-[50vw] rounded-full bg-nexus-cyan/10 blur-[120px]" />
      <div className="absolute -left-[15%] bottom-[5%] h-[45vh] w-[45vw] rounded-full bg-nexus-lime/8 blur-[100px]" />
      <div className="absolute left-[40%] top-[45%] h-[30vh] w-[30vw] rounded-full bg-nexus-orange/8 blur-[60px]" />
    </div>
  );
}

export function AtmosphericGlow() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const { x, y } = useParallaxMouse(0.025);

  if (!mounted || reduceMotion) {
    return <StaticGlow />;
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
      style={{ x, y }}
    >
      <motion.div
        className="absolute -right-[25%] top-[5%] h-[55vh] w-[55vw] rounded-full bg-nexus-cyan/18 blur-[80px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-[20%] bottom-0 h-[50vh] w-[50vw] rounded-full bg-nexus-lime/12 blur-[90px]"
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute left-[40%] top-[45%] h-[30vh] w-[30vw] rounded-full bg-nexus-orange/8 blur-[60px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
