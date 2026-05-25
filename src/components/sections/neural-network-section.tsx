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

  const handleSelect = useCallback((id: NeuralSectorId) => {
    setActiveSector((prev) => (prev === id ? null : id));
    setHovered(null);
  }, []);

  return (
    <SectionShell
      id="neural-map"
      tone="lime"
      atmosphere="neural"
      className="!py-28 sm:!py-36"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <SectionHeading
          eyebrow="Neural Network"
          title="City"
          titleAccent="Consciousness"
          description="Drag to orbit the mesh. Select a sector to trace uplink pathways across the metropolitan neural grid."
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
                <div className="neural-map-fog" aria-hidden />
                {displaySector && (
                  <span className="neural-signal-wave" aria-hidden />
                )}
                <p className="neural-map-hint pointer-events-none absolute left-5 top-5 z-10 font-mono text-[8px] uppercase tracking-[0.28em] text-white/30">
                  Drag · orbit · select
                </p>
                {mounted ? (
                  <NeuralMapCanvas
                    activeSector={displaySector}
                    onSectorHover={handleHover}
                    onSectorSelect={handleSelect}
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
                        onClick={() => handleSelect(s.id)}
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
                      ? `${displaySector} · ${NEURAL_SECTORS.find((s) => s.id === displaySector)?.label ?? "SYNC"}`
                      : "Orbit mesh · select sector"}
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
