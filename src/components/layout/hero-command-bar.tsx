"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { MicroLabel } from "@/components/ui/micro-label";

export function HeroCommandBar() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;
  const { scrollY } = useScroll();

  const barOpacity = useTransform(scrollY, [0, 80, 200], [1, 0.92, 0]);
  const barY = useTransform(scrollY, [0, 200], [0, 8]);

  return (
    <motion.div
      className="hero-command-bar pointer-events-none absolute inset-x-0 z-[35] flex items-end justify-between px-6 lg:px-12"
      style={{
        opacity: motionReady ? barOpacity : 1,
        y: motionReady ? barY : 0,
      }}
    >
      <div className="hero-command-bar__side flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-nexus-lime shadow-[0_0_8px_rgba(168,240,0,0.8)]" />
        <MicroLabel accent="lime" className="text-[9px]">
          Sys Status: Optimal
        </MicroLabel>
      </div>

      <div className="hero-command-bar__descend flex flex-col items-center gap-2.5">
        <MicroLabel accent="cyan" className="hero-command-bar__label text-[8px]">
          Scroll to descend
        </MicroLabel>
        <motion.div
          className="hero-scroll-cue flex h-9 w-5 items-start justify-center rounded-sm border border-nexus-cyan/25 bg-void/80 backdrop-blur-md"
          animate={
            motionReady
              ? { opacity: [0.9, 1, 0.9], y: [0, 5, 0] }
              : { opacity: 1, y: 0 }
          }
          transition={
            motionReady
              ? { duration: 2.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
              : undefined
          }
        >
          <motion.span
            className="mt-1.5 block h-1.5 w-1 rounded-full bg-nexus-lime shadow-[0_0_8px_rgba(212,255,0,0.75)]"
            animate={motionReady ? { y: [0, 11, 0], opacity: [0.7, 1, 0.7] } : undefined}
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
        className="hero-command-bar__side hidden text-[8px] tabular-nums sm:inline"
      >
        34.0522° N · 118.2437° W
      </MicroLabel>
    </motion.div>
  );
}
