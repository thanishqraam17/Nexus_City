"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { NexusButton } from "@/components/ui/nexus-button";
import { Magnetic } from "@/components/cinematic/magnetic";
import { useOsRuntimeStore } from "@/store/os-runtime-store";
import { fadeUp } from "@/lib/motion/variants";
import { easeLuxury } from "@/lib/motion/transitions";

export function AccessSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;
  const syncPercent = useOsRuntimeStore((s) => s.syncPercent);
  const throughputIndex = useOsRuntimeStore((s) => s.throughputIndex);
  const pushAiMessage = useOsRuntimeStore((s) => s.pushAiMessage);
  const [email, setEmail] = useState("");
  const [granted, setGranted] = useState(false);

  // Front-end only: no backend exists yet, so nothing is sent anywhere.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const operator = email.trim();
    if (!operator) return;
    setGranted(true);
    pushAiMessage(`Operator channel ${operator} registered — command access granted.`);
  };

  return (
    <section
      id="access"
      data-section="access"
      data-atmosphere="access"
      className="os-section os-section--access access-ending relative z-10 pt-12 sm:pt-16"
    >
      <div className="access-ending__atmosphere" aria-hidden />
      <div className="access-ending__convergence" aria-hidden />
      <div className="access-ending__mesh-glow" aria-hidden />

      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={easeLuxury}
          className="relative"
        >
          <div className="access-ending__sync-banner">
            <MicroLabel accent="lime" className="text-[8px]">
              Neural synchronization · {syncPercent.toFixed(2)}%
            </MicroLabel>
            <MicroLabel accent="cyan" className="text-[8px]">
              Throughput index · {throughputIndex}
            </MicroLabel>
          </div>

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
                <motion.p
                  className="access-ending__climax mt-4 font-mono text-[9px] uppercase tracking-[0.28em] text-nexus-cyan/70"
                  initial={false}
                  animate={
                    motionReady
                      ? { opacity: [0.5, 1, 0.5] }
                      : { opacity: 0.7 }
                  }
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Infrastructure stabilized · mesh convergence complete
                </motion.p>
                <div className="access-ending__activation" aria-hidden>
                  <span />
                  <span />
                  <span />
                  <p className="ml-2 font-mono text-[9px] uppercase tracking-[0.28em] text-nexus-lime/70">
                    {granted ? "Operator signal received" : "Awaiting operator signal"}
                  </p>
                </div>
              </div>

              {granted ? (
                <div
                  className="flex flex-col gap-3 lg:col-span-5 lg:items-end"
                  role="status"
                >
                  <MicroLabel accent="lime">Command access granted</MicroLabel>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                    Operator channel · {email.trim()}
                  </p>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-4 lg:col-span-5 lg:items-end"
                  onSubmit={handleSubmit}
                >
                  <label className="w-full font-mono text-[9px] uppercase tracking-widest text-white/35 lg:max-w-sm">
                    Operator channel
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="OPERATOR@NEXUS.IO"
                      className="nexus-input mt-2 w-full"
                    />
                  </label>
                  <Magnetic strength={0.25}>
                    <NexusButton
                      type="submit"
                      variant="primary"
                      className="access-ending__cta w-full whitespace-nowrap border-white/30 bg-white text-void sm:w-auto"
                      data-magnetic
                    >
                      Enter the system
                    </NexusButton>
                  </Magnetic>
                </form>
              )}
            </div>
          </GlassPanel>
        </motion.div>

        <footer className="access-ending__footer mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <MicroLabel accent="muted">© 2026 Nexus City Systems</MicroLabel>
          <div className="flex flex-wrap gap-6">
            <MicroLabel accent="muted">Privacy</MicroLabel>
            <MicroLabel accent="muted">Protocols</MicroLabel>
            <MicroLabel accent="lime">Status · Synchronized</MicroLabel>
          </div>
        </footer>
      </div>
    </section>
  );
}
