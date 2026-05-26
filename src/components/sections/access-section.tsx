"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { NexusButton } from "@/components/ui/nexus-button";
import { Magnetic } from "@/components/cinematic/magnetic";
import { fadeUp } from "@/lib/motion/variants";

export function AccessSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <section
      id="access"
      data-section="access"
      data-atmosphere="access"
      className="os-section os-section--access access-ending relative z-10 pb-32 pt-12 sm:pb-44 sm:pt-16"
    >
      <div className="access-ending__atmosphere" aria-hidden />
      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          <MicroLabel accent="lime" className="mb-6 block text-center sm:text-left">
            Final gateway · Layer 06
          </MicroLabel>

          <GlassPanel
            variant="command"
            glow="lime"
            cornerMarks
            className="access-ending__panel relative overflow-hidden px-8 py-14 sm:px-14 sm:py-20"
          >
            <div className="access-ending__scan" aria-hidden />
            <div className="access-glow pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30" />

            <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="access-ending__tagline">System entry protocol</p>
                <h2 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,4rem)] font-extralight leading-[1.05] tracking-tight text-white">
                  Initialize
                  <br />
                  <span className="text-nexus-lime">command access.</span>
                </h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-white/45">
                  Secure uplink to the metropolitan AI operating layer. Operator credentials
                  authenticate against the infrastructure cortex and neural routing mesh.
                </p>
                <div className="access-ending__activation" aria-hidden>
                  <span />
                  <span />
                  <span />
                  <p className="ml-2 font-mono text-[9px] uppercase tracking-[0.28em] text-nexus-lime/70">
                    Awaiting operator signal
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
                <label className="w-full font-mono text-[9px] uppercase tracking-widest text-white/35 lg:max-w-sm">
                  Operator channel
                  <input
                    type="email"
                    placeholder="OPERATOR@NEXUS.IO"
                    className="nexus-input mt-2 w-full"
                    aria-label="Email address"
                  />
                </label>
                <Magnetic strength={0.25}>
                  <NexusButton
                    variant="primary"
                    className="w-full whitespace-nowrap bg-white text-void border-white/30 sm:w-auto"
                    data-magnetic
                  >
                    Enter the system
                  </NexusButton>
                </Magnetic>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <MicroLabel accent="muted">© 2026 Nexus City Systems</MicroLabel>
          <div className="flex flex-wrap gap-6">
            <MicroLabel accent="muted">Privacy</MicroLabel>
            <MicroLabel accent="muted">Protocols</MicroLabel>
            <MicroLabel accent="muted">Status · Online</MicroLabel>
          </div>
        </footer>
      </div>
    </section>
  );
}
