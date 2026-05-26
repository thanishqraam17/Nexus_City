"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";

const BOOT_KEY = "nexus-boot-v2";

const STEPS = ["Init", "Calibrate", "Activate"];

export function SystemBoot() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    if (reduceMotion) {
      sessionStorage.setItem(BOOT_KEY, "1");
      return;
    }
    if (sessionStorage.getItem(BOOT_KEY) === "1") return;

    setVisible(true);
    const t1 = setTimeout(() => setPhase(1), 280);
    const t2 = setTimeout(() => setPhase(2), 620);
    const t3 = setTimeout(() => setPhase(3), 980);
    const t4 = setTimeout(() => {
      setPhase(4);
      setVisible(false);
      sessionStorage.setItem(BOOT_KEY, "1");
    }, 1650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [mounted, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="system-boot fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="system-boot-vignette absolute inset-0" />
          <div className="system-boot-grid absolute inset-0 opacity-25" aria-hidden />

          <div className="relative z-10 text-center px-6">
            <motion.p
              className="font-mono text-[10px] uppercase tracking-[0.42em] text-nexus-cyan/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              {phase >= 3 ? "AI systems online" : "Telemetry calibration"}
            </motion.p>

            <motion.h2
              className="mt-4 font-display text-3xl font-light tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              NEXUS <span className="text-nexus-lime">CITY</span>
            </motion.h2>

            <div className="system-boot-progress" aria-hidden>
              {STEPS.map((_, i) => (
                <span key={i} className={phase > i ? "is-active" : ""} />
              ))}
            </div>

            <motion.p
              className="mt-5 font-mono text-[9px] uppercase tracking-[0.26em] text-white/38"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              Neural mesh · Infrastructure cortex · Command layer
            </motion.p>
          </div>

          <motion.div
            className="system-boot-pulse-bar absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 sm:w-52"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 0.7 : 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
