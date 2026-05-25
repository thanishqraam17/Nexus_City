"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { SectionShell, SectionHeading } from "@/components/system";
import { SystemTerminal } from "@/components/terminal/system-terminal";
import { fadeUp, slideFromRight } from "@/lib/motion/variants";

export function TerminalSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <SectionShell id="terminal" tone="lime">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <motion.div
          className="lg:col-span-5"
          variants={slideFromRight}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.25 }}
        >
          <SectionHeading
            eyebrow="System Access"
            title="Command"
            titleAccent="Terminal"
            description="Direct interface to district sync, neural uplink diagnostics, and infrastructure optimization protocols."
            accent="lime"
          />
          <ul className="mt-8 space-y-3 border-t border-white/[0.08] pt-6">
            {[
              "District synchronization",
              "Neural uplink status",
              "Auto infrastructure optimize",
              "Full telemetry diagnostics",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40"
              >
                <span className="h-1 w-1 bg-nexus-lime" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="lg:col-span-7"
          variants={fadeUp}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.2 }}
        >
          <SystemTerminal />
        </motion.div>
      </div>
    </SectionShell>
  );
}
