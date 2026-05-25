"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { SectionShell, SectionHeading, GlowContainer } from "@/components/system";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

const NeuralMapCanvas = dynamic(
  () => import("@/components/neural-map/neural-map-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="neural-map-fallback flex h-full min-h-[360px] items-center justify-center">
        <MicroLabel accent="cyan">Initializing neural mesh…</MicroLabel>
      </div>
    ),
  }
);

export function NeuralNetworkSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;
  const [activeSector, setActiveSector] = useState<NeuralSectorId | null>(null);
  const [hovered, setHovered] = useState<NeuralSectorId | null>(null);

  const displaySector = hovered ?? activeSector;

  const handleHover = useCallback((id: NeuralSectorId | null) => {
    setHovered(id);
  }, []);

  return (
    <SectionShell id="neural-map" tone="lime" className="!py-28 sm:!py-36">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <SectionHeading
          eyebrow="Neural Network"
          title="City"
          titleAccent="Consciousness"
          description="Interactive mesh of autonomous districts, data pathways, and synchronized neural uplinks across the metropolitan grid."
          accent="lime"
          className="lg:col-span-4 lg:pt-4"
        />

        <motion.div
          className="lg:col-span-8"
          variants={fadeUp}
          initial={false}
          whileInView={motionReady ? "visible" : undefined}
          viewport={{ once: true, amount: 0.12 }}
        >
          <GlowContainer tone="lime" className="h-full">
            <GlassPanel
              variant="command"
              glow="lime"
              cornerMarks
              className="overflow-hidden p-0"
              revealOnView={false}
            >
              <div className="neural-map-viewport relative min-h-[360px] sm:min-h-[440px] lg:min-h-[520px]">
                {mounted ? (
                  <NeuralMapCanvas
                    activeSector={displaySector}
                    onSectorHover={handleHover}
                  />
                ) : (
                  <div className="neural-map-fallback absolute inset-0" />
                )}
                <div className="neural-map-ui pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
                  <div className="pointer-events-auto flex flex-wrap gap-2">
                    {NEURAL_SECTORS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setActiveSector((prev) =>
                            prev === s.id ? null : s.id
                          )
                        }
                        className={cn(
                          "neural-sector-btn font-mono text-[9px] uppercase tracking-widest transition-colors",
                          displaySector === s.id
                            ? "text-nexus-lime"
                            : "text-white/40 hover:text-nexus-cyan"
                        )}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                  <MicroLabel accent="muted">
                    {displaySector
                      ? `${displaySector} · SYNC ACTIVE`
                      : "Hover or select sector"}
                  </MicroLabel>
                </div>
              </div>
            </GlassPanel>
          </GlowContainer>
        </motion.div>
      </div>
    </SectionShell>
  );
}
