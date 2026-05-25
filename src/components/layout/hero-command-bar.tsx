"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { MicroLabel } from "@/components/ui/micro-label";

export function HeroCommandBar() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();

  return (
    <motion.div
      className="hero-command-bar pointer-events-none absolute bottom-6 left-0 right-0 z-20 flex items-end justify-between px-6 lg:px-12"
      initial={false}
      animate={mounted && !reduceMotion ? { opacity: 1 } : undefined}
      transition={{ delay: 1.6, duration: 1 }}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-nexus-lime shadow-[0_0_8px_rgba(168,240,0,0.8)]" />
        <MicroLabel accent="lime" className="text-[9px]">
          Sys Status: Optimal
        </MicroLabel>
      </div>

      <div className="flex flex-col items-center gap-2">
        <MicroLabel accent="muted" className="text-[8px]">
          Scroll to descend
        </MicroLabel>
        <motion.div
          className="flex h-8 w-5 items-start justify-center rounded-sm border border-white/10 bg-black/30"
          animate={
            mounted && !reduceMotion
              ? { opacity: [0.5, 1, 0.5] }
              : undefined
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="mt-1 block h-1.5 w-1 bg-nexus-lime/80" />
        </motion.div>
      </div>

      <MicroLabel accent="muted" className="text-[8px] tabular-nums">
        34.0522° N · 118.2437° W
      </MicroLabel>
    </motion.div>
  );
}
