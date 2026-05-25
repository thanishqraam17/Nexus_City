"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { NexusButton } from "@/components/ui/nexus-button";
import { fadeUp } from "@/lib/motion/variants";

export function AccessSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <section id="access" className="relative z-10 pb-32 pt-8 sm:pb-40">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12 lg:pr-16">
        <motion.div
          variants={fadeUp}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true }}
          className="relative overflow-hidden lg:ml-8"
        >
          <GlassPanel
            variant="command"
            glow="lime"
            className="relative px-8 py-16 sm:px-16 sm:py-24"
            cornerMarks
          >
            <div className="access-glow pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-25" />
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
                  className="nexus-input sm:max-w-xs"
                  aria-label="Email address"
                />
                <NexusButton variant="primary" className="whitespace-nowrap bg-white text-void border-white/30">
                  Transmit
                </NexusButton>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between lg:ml-8">
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
