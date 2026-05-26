"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { MicroLabel } from "@/components/ui/micro-label";
import { easeCinematic } from "@/lib/motion/transitions";

export function HeroCommandBar() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <motion.div
      className="hero-command-bar pointer-events-none absolute bottom-6 left-0 right-0 z-30 flex items-end justify-between px-6 lg:px-12"
      initial={{ opacity: 1, y: 0 }}
      animate={
        motionReady
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0 }
      }
      transition={easeCinematic}
    >
      <div className="hero-command-bar__side flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-nexus-lime shadow-[0_0_8px_rgba(168,240,0,0.8)]" />
        <MicroLabel accent="lime" className="text-[9px]">
          Sys Status: Optimal
        </MicroLabel>
      </div>

      <div className="hero-command-bar__descend flex flex-col items-center gap-2">
        <MicroLabel accent="muted" className="hero-command-bar__label text-[8px]">
          Scroll to descend
        </MicroLabel>
        <motion.div
          className="hero-scroll-cue flex h-8 w-5 items-start justify-center rounded-sm border border-white/12 bg-black/40 backdrop-blur-sm"
          animate={
            motionReady
              ? { opacity: [0.72, 1, 0.72], y: [0, 5, 0] }
              : { opacity: 0.85, y: 0 }
          }
          transition={
            motionReady
              ? { duration: 2.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
              : undefined
          }
        >
          <motion.span
            className="mt-1 block h-1.5 w-1 rounded-full bg-nexus-lime/90 shadow-[0_0_6px_rgba(212,255,0,0.6)]"
            animate={motionReady ? { y: [0, 10, 0], opacity: [0.6, 1, 0.6] } : undefined}
            transition={
              motionReady
                ? { duration: 2.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
                : undefined
            }
          />
        </motion.div>
      </div>

      <MicroLabel
        accent="muted"
        className="hero-command-bar__side text-[8px] tabular-nums"
      >
        34.0522° N · 118.2437° W
      </MicroLabel>
    </motion.div>
  );
}
