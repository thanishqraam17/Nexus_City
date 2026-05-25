"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import {
  SectionShell,
  SectionHeading,
  DataModule,
  PanelGrid,
} from "@/components/system";
import { TrafficFlowPanel } from "@/components/sections/traffic-flow-panel";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { CITY_INTELLIGENCE_METRICS } from "@/lib/system/city-data";
import { fadeUp } from "@/lib/motion/variants";
import { staggerCinematic } from "@/lib/motion/transitions";

const INSIGHTS = [
  {
    title: "Predictive Transit",
    body: "Autonomous flow rebalancing across 2,400 corridors with sub-second idle correction.",
  },
  {
    title: "Energy Mesh",
    body: "District-level demand forecasting with synchronized redistribution cycles.",
  },
  {
    title: "Civic AI Layer",
    body: "Policy simulation and infrastructure stress modeling at metropolitan scale.",
  },
];

export function CityIntelligenceSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <SectionShell id="intelligence" tone="cyan">
      <SectionHeading
        eyebrow="City Intelligence"
        title="Live Analytics"
        titleAccent="Command Layer"
        description="Real-time cognitive infrastructure across districts, transit corridors, energy meshes, and neural subsystems."
        accent="cyan"
        className="mb-14 lg:mb-16"
      />

      <motion.div
        className="mb-10 grid gap-4 lg:grid-cols-12 lg:gap-5"
        variants={fadeUp}
        initial={false}
        whileInView={motionReady ? "visible" : undefined}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="lg:col-span-7">
          <TrafficFlowPanel />
        </div>
        <div className="grid grid-cols-2 gap-2.5 lg:col-span-5 lg:grid-cols-1 lg:gap-3">
          {CITY_INTELLIGENCE_METRICS.slice(0, 4).map((m) => (
            <DataModule key={m.id} metric={m} tone="cyan" />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={staggerCinematic(0.06, 0.12)}
        initial={false}
        whileInView={motionReady ? "visible" : undefined}
        viewport={{ once: true, amount: 0.12 }}
      >
        <PanelGrid cols={4} className="mb-14">
          {CITY_INTELLIGENCE_METRICS.slice(4).map((m) => (
            <motion.div key={m.id} variants={fadeUp}>
              <DataModule metric={m} tone="lime" />
            </motion.div>
          ))}
        </PanelGrid>
      </motion.div>

      <motion.div
        className="grid gap-4 lg:grid-cols-3 lg:gap-5"
        variants={staggerCinematic(0.08, 0.15)}
        initial={false}
        whileInView={motionReady ? "visible" : undefined}
        viewport={{ once: true, amount: 0.1 }}
      >
        {INSIGHTS.map((card) => (
          <motion.div key={card.title} variants={fadeUp}>
            <GlassPanel variant="hud" glow="cyan" cornerMarks className="p-6 sm:p-7">
              <MicroLabel accent="cyan">{card.title}</MicroLabel>
              <p className="nexus-support-sm mt-4">{card.body}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-nexus-cyan/35 to-transparent" />
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
