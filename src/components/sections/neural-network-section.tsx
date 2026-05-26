"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { SectionShell, SectionHeading } from "@/components/system";
import { MicroLabel } from "@/components/ui/micro-label";
import { NeuralAnalysisPanel } from "@/components/neural-map/neural-analysis-panel";
import { NeuralCityBackdrop } from "@/components/neural-map/neural-city-backdrop";
import { NeuralHoloComposite } from "@/components/neural-map/neural-holo-composite";
import { NEURAL_SECTOR_META } from "@/lib/system/neural-data";
import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

const NeuralMapCanvas = dynamic(
  () => import("@/components/neural-map/neural-map-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="neural-map-fallback flex h-full min-h-[52vh] items-center justify-center">
        <MicroLabel accent="cyan">Initializing neural infrastructure mesh…</MicroLabel>
      </div>
    ),
  }
);

export function NeuralNetworkSection() {
  const mounted = useMounted();
  const [selectedSector, setSelectedSector] = useState<NeuralSectorId | null>(null);
  const [hoveredSector, setHoveredSector] = useState<NeuralSectorId | null>(null);

  const handleHover = useCallback((id: NeuralSectorId | null) => {
    setHoveredSector(id);
  }, []);

  const handleSelect = useCallback((id: NeuralSectorId) => {
    setSelectedSector((prev) => (prev === id ? null : id));
    setHoveredSector(null);
  }, []);

  const previewMeta = hoveredSector ? NEURAL_SECTOR_META[hoveredSector] : null;

  return (
    <SectionShell
      id="neural-map"
      tone="lime"
      atmosphere="neural"
      className="neural-section neural-viewport !overflow-visible !border-t-0 !bg-transparent !py-0"
      innerClassName="neural-section__inner max-w-none px-0"
      borderTop={false}
    >
      <header className="neural-viewport__header mx-auto w-full max-w-[1800px] px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        <SectionHeading
          eyebrow="Neural Infrastructure"
          title="AI Routing"
          titleAccent="Layer"
          description="Metropolitan neural mesh — district intelligence nodes, relay pathways, and the infrastructure cortex."
          accent="lime"
        />
      </header>

      <div className="neural-viewport__stage">
        <div className="neural-map-stage">
          <div className="neural-map-stage__guide">
            <MicroLabel accent="muted" className="text-[8px]">
              Active AI routing layer
            </MicroLabel>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
              Drag to inspect · Select nodes for diagnostics
            </p>
          </div>

          <div className="neural-map-stage__canvas-host">
            <NeuralCityBackdrop />
            <NeuralHoloComposite />

            <div className="neural-map-stage__graph">
              {mounted ? (
                <NeuralMapCanvas
                  hoveredSector={hoveredSector}
                  selectedSector={selectedSector}
                  onSectorHover={handleHover}
                  onSectorSelect={handleSelect}
                />
              ) : (
                <div className="neural-map-fallback absolute inset-0" />
              )}
            </div>

            <NeuralAnalysisPanel
              sectorId={selectedSector}
              onClose={() => setSelectedSector(null)}
            />

            {previewMeta && !selectedSector && (
              <div className="neural-map-hover-card pointer-events-none">
                <span className="font-mono text-[8px] uppercase tracking-widest text-nexus-cyan/70">
                  {previewMeta.districtId}
                </span>
                <p className="mt-1 font-display text-sm text-white/90">
                  {previewMeta.systemName}
                </p>
                <p className="mt-1 text-[10px] text-white/45">{previewMeta.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="neural-map-stage__rail mx-auto w-full max-w-[1800px] px-4 pb-10 pt-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <div className="flex flex-wrap gap-2">
            {NEURAL_SECTORS.map((s) => {
              const meta = NEURAL_SECTOR_META[s.id];
              const active = selectedSector === s.id || hoveredSector === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s.id)}
                  className={cn(
                    "neural-sector-chip",
                    active && "neural-sector-chip--active"
                  )}
                >
                  <span className="neural-sector-chip__system">{meta.systemName}</span>
                  <span className="neural-sector-chip__id">{s.id}</span>
                </button>
              );
            })}
          </div>
          <MicroLabel accent="muted">
            {selectedSector
              ? `Analysis · ${NEURAL_SECTOR_META[selectedSector].systemName}`
              : hoveredSector
                ? `Preview · ${NEURAL_SECTOR_META[hoveredSector].systemName}`
                : "Infrastructure cortex online"}
          </MicroLabel>
        </div>
      </div>
    </SectionShell>
  );
}
