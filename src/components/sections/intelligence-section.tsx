"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { TelemetrySparkline } from "@/components/ui/telemetry-sparkline";
import { fadeUp, slideFromLeft } from "@/lib/motion/variants";
import { staggerCinematic } from "@/lib/motion/transitions";

const METRICS = [
  { label: "Active Districts", value: "128", unit: "zones" },
  { label: "Data Throughput", value: "8.4", unit: "PB/s" },
  { label: "AI Decisions", value: "2.1M", unit: "/hr" },
  { label: "Grid Stability", value: "99.2", unit: "%" },
];

const NODES = [
  { id: "A1", x: "12%", y: "28%" },
  { id: "B4", x: "38%", y: "18%" },
  { id: "C7", x: "62%", y: "42%" },
  { id: "D2", x: "78%", y: "22%" },
  { id: "E9", x: "48%", y: "58%" },
];

export function IntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7], [0, 1, 0.85]);

  return (
    <section
      ref={sectionRef}
      id="intelligence"
      className="relative z-10 overflow-hidden border-t border-white/[0.06] py-28 sm:py-36"
    >
      <div className="intelligence-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={motionReady ? { y: parallaxY } : undefined}
        aria-hidden
      >
        <div className="intelligence-grid-map absolute inset-0" />
      </motion.div>

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-14">
        <motion.div
          className="mb-16 max-w-2xl lg:ml-6"
          variants={slideFromLeft}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.3 }}
        >
          <MicroLabel accent="cyan">Neural Core</MicroLabel>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] font-light leading-[0.95] text-white">
            City
            <br />
            <span className="text-nexus-lime">Intelligence</span>
          </h2>
          <p className="nexus-support mt-6 max-w-lg">
            Live cognitive infrastructure mapping every district, transit corridor,
            and autonomous subsystem across the metropolitan mesh.
          </p>
        </motion.div>

        <motion.div
          className="relative mb-20 min-h-[280px] sm:min-h-[340px]"
          style={motionReady ? { opacity: mapOpacity } : undefined}
        >
          <GlassPanel
            variant="command"
            glow="cyan"
            cornerMarks
            className="absolute inset-0 p-0"
            revealOnView
          >
            <div className="intelligence-map-inner relative h-full min-h-[280px] sm:min-h-[340px]">
              <div className="intelligence-map-grid absolute inset-0" />
              {NODES.map((node, i) => (
                <motion.span
                  key={node.id}
                  className="intelligence-map-node absolute font-mono text-[9px] uppercase tracking-widest text-nexus-lime"
                  style={{ left: node.x, top: node.y }}
                  initial={false}
                  animate={
                    motionReady
                      ? { opacity: [0.4, 1, 0.4] }
                      : undefined
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                >
                  <span className="mr-1 inline-block h-1 w-1 bg-nexus-lime" />
                  {node.id}
                </motion.span>
              ))}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-6 sm:bottom-6 sm:left-8">
                <MicroLabel accent="muted">Realtime mesh · 847 nodes</MicroLabel>
                <MicroLabel accent="cyan">Latency 12ms avg</MicroLabel>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 lg:pl-4"
          variants={staggerCinematic(0.07, 0.15)}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.2 }}
        >
          {METRICS.map((m, i) => (
            <motion.div key={m.label} variants={fadeUp}>
              <GlassPanel variant="telemetry" glow="lime" className="telemetry-card">
                <MicroLabel accent="lime">{m.label}</MicroLabel>
                <div className="telemetry-value-row mt-2">
                  <span className="nexus-value text-xl sm:text-2xl">{m.value}</span>
                  <span className="nexus-value-unit">{m.unit}</span>
                </div>
                <div className="mt-3">
                  <TelemetrySparkline seed={i + 10} />
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5 lg:pl-8"
          variants={staggerCinematic(0.1, 0.2)}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.15 }}
        >
          {[
            {
              title: "Predictive Transit",
              body: "Autonomous flow rebalancing across 2,400 corridors with zero idle zones.",
            },
            {
              title: "Energy Mesh",
              body: "District-level load forecasting with sub-second redistribution cycles.",
            },
            {
              title: "Civic AI Layer",
              body: "Policy simulation and infrastructure stress testing at planetary scale.",
            },
          ].map((card) => (
            <motion.div key={card.title} variants={fadeUp}>
              <GlassPanel variant="hud" glow="cyan" cornerMarks className="p-6 sm:p-8">
                <MicroLabel accent="cyan">{card.title}</MicroLabel>
                <p className="nexus-support-sm mt-4">{card.body}</p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-nexus-cyan/30 to-transparent" />
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
