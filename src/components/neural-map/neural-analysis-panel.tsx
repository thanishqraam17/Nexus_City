"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { NeuralSectorId } from "@/lib/system/city-data";
import { NEURAL_SECTOR_META } from "@/lib/system/neural-data";
import { MicroLabel } from "@/components/ui/micro-label";
import { cn } from "@/lib/utils";

interface NeuralAnalysisPanelProps {
  sectorId: NeuralSectorId | null;
  onClose: () => void;
}

export function NeuralAnalysisPanel({ sectorId, onClose }: NeuralAnalysisPanelProps) {
  const meta = sectorId ? NEURAL_SECTOR_META[sectorId] : null;

  return (
    <AnimatePresence>
      {meta && (
        <motion.aside
          key={meta.id}
          className="neural-analysis-panel pointer-events-none"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Infrastructure diagnostics"
        >
          <div className="neural-analysis-panel__chrome">
            <MicroLabel accent="lime">System Analysis</MicroLabel>
            <button
              type="button"
              onClick={onClose}
              className="pointer-events-auto font-mono text-[9px] uppercase tracking-widest text-white/35 transition-colors hover:text-white/70"
            >
              Clear
            </button>
          </div>

          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.28em] text-nexus-cyan/80">
            {meta.districtId} · {meta.id}
          </p>
          <h3 className="mt-2 font-display text-xl font-light text-white">
            {meta.systemName}
          </h3>
          <p className="mt-1 font-mono text-[10px] text-nexus-lime/70">{meta.role}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/50">{meta.description}</p>

          <ul className="neural-analysis-metrics mt-6 space-y-3 border-t border-white/[0.08] pt-5">
            <MetricRow label="Mesh load" value={`${meta.metrics.load}%`} />
            <MetricRow label="Latency" value={`${meta.metrics.latencyMs} ms`} />
            <MetricRow label="Throughput" value={meta.metrics.throughput} />
            <MetricRow
              label="Status"
              value={meta.metrics.status}
              accent={meta.metrics.status === "SYNC" ? "lime" : "cyan"}
            />
          </ul>

          <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
            Active routing layer · pathways highlighted
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function MetricRow({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: string;
  accent?: "lime" | "cyan" | "neutral";
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/35">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-xs tabular-nums",
          accent === "lime" && "text-nexus-lime",
          accent === "cyan" && "text-nexus-cyan",
          accent === "neutral" && "text-white/75"
        )}
      >
        {value}
      </span>
    </li>
  );
}
