"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";

const BOOT_KEY = "nexus-boot-v1";

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
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => {
      setPhase(3);
      setVisible(false);
      sessionStorage.setItem(BOOT_KEY, "1");
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [mounted, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="system-boot fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="system-boot-vignette absolute inset-0" />
          <div className="system-boot-grid absolute inset-0 opacity-30" aria-hidden />

          <div className="relative z-10 text-center">
            <motion.p
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-nexus-cyan/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              System initialization
            </motion.p>
            <motion.h2
              className="mt-4 font-display text-3xl font-light tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              NEXUS <span className="text-nexus-lime">CITY</span>
            </motion.h2>
            <motion.div
              className="mx-auto mt-6 h-px w-32 origin-center bg-gradient-to-r from-transparent via-nexus-lime/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.p
              className="mt-4 font-mono text-[9px] uppercase tracking-[0.28em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Telemetry calibrated · Neural mesh online
            </motion.p>
          </div>

          <motion.div
            className="system-boot-pulse-bar absolute bottom-12 left-1/2 h-px w-48 -translate-x-1/2"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: phase >= 1 ? 1 : 0,
              opacity: phase >= 1 ? [0.3, 0.8, 0.3] : 0,
            }}
            transition={{
              scaleX: { duration: 0.6 },
              opacity: { duration: 1.2, repeat: Infinity },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
