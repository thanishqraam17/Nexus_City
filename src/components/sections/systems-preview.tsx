"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { fadeUp, slideFromLeft } from "@/lib/motion/variants";
import { staggerContainer } from "@/lib/motion/transitions";

const systems = [
  {
    id: "01",
    name: "Neural Grid",
    desc: "Distributed cognition across every district node.",
    accent: "lime" as const,
  },
  {
    id: "02",
    name: "Pulse Transit",
    desc: "Autonomous flow orchestration with zero idle corridors.",
    accent: "cyan" as const,
  },
  {
    id: "03",
    name: "Aether Shield",
    desc: "Predictive resilience mesh for critical infrastructure.",
    accent: "orange" as const,
  },
];

export function SystemsPreview() {
  return (
    <section
      id="systems"
      className="relative z-10 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <MicroLabel accent="cyan">Subsystems</MicroLabel>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[0.95] tracking-tight text-white">
              Core
              <br />
              <span className="text-white/30">Architecture</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/40">
              Modular intelligence layers engineered for cinematic oversight and
              millisecond reactivity.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6"
            variants={staggerContainer(0.12, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {systems.map((sys, i) => (
              <motion.div key={sys.id} variants={fadeUp}>
                <GlassPanel
                  variant="command"
                  glow={sys.accent === "lime" ? "lime" : sys.accent === "cyan" ? "cyan" : "orange"}
                  cornerMarks
                  className="group p-8 sm:p-10"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <MicroLabel accent={sys.accent}>{`Module ${sys.id}`}</MicroLabel>
                      <h3 className="mt-3 font-display text-3xl font-light text-white sm:text-4xl">
                        {sys.name}
                      </h3>
                      <p className="mt-3 max-w-md text-sm text-white/45">{sys.desc}</p>
                    </div>
                    <span className="font-display text-6xl font-extralight text-white/[0.06] sm:text-7xl">
                      {sys.id}
                    </span>
                  </div>
                  <motion.div
                    className="mt-8 h-px w-full origin-left bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 1.2 }}
                  />
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
