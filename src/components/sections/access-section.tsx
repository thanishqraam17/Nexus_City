"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { fadeUp } from "@/lib/motion/variants";

export function AccessSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <section id="access" className="relative z-10 pb-32 pt-8 sm:pb-40">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <GlassPanel
            variant="hud"
            glow="lime"
            className="relative px-8 py-16 sm:px-16 sm:py-24"
            cornerMarks
          >
            <div className="access-glow pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-30" />
            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-end">
              <div>
                <MicroLabel accent="lime" pulse>
                  Clearance Required
                </MicroLabel>
                <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-tight text-white">
                  Request command
                  <br />
                  <span className="text-nexus-lime">access.</span>
                </h2>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <input
                  type="email"
                  placeholder="OPERATOR@NEXUS.IO"
                  className="w-full border border-white/10 bg-black/40 px-5 py-4 font-mono text-xs uppercase tracking-widest text-white placeholder:text-white/25 outline-none transition-colors focus:border-nexus-lime/50 sm:max-w-xs"
                  aria-label="Email address"
                />
                <motion.button
                  type="button"
                  className="whitespace-nowrap bg-white px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-void"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Transmit
                </motion.button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <MicroLabel accent="muted">© 2026 Nexus City Systems</MicroLabel>
          <div className="flex gap-6">
            <MicroLabel accent="muted">Privacy</MicroLabel>
            <MicroLabel accent="muted">Protocols</MicroLabel>
            <MicroLabel accent="muted">Status</MicroLabel>
          </div>
        </footer>
      </div>
    </section>
  );
}
