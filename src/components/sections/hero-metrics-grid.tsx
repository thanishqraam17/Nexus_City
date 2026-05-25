"use client";

import { MicroLabel } from "@/components/ui/micro-label";
import { TelemetryCardLayout } from "@/components/ui/telemetry-card-layout";
import { TelemetryMetricText } from "@/components/ui/telemetry-metric";
import { TelemetrySparkline } from "@/components/ui/telemetry-sparkline";
import { cn } from "@/lib/utils";

const HERO_METRICS = [
  {
    label: "Nodes Active",
    value: "847",
    unit: undefined,
    seed: 11,
    digitsClass: "telemetry-metric-digits--hud-lg",
    trend: "up" as const,
  },
  {
    label: "Avg Response",
    value: "12",
    unit: "ms",
    seed: 12,
    digitsClass: "telemetry-metric-digits--hud-sm",
    trend: "stable" as const,
  },
  {
    label: "Events / sec",
    value: "4.2M",
    unit: undefined,
    seed: 13,
    digitsClass: "telemetry-metric-digits--hud-md",
    trend: "up" as const,
  },
  {
    label: "Scale Ready",
    value: "∞",
    unit: undefined,
    seed: 14,
    digitsClass: "telemetry-metric-digits--hud-symbol",
    trend: "stable" as const,
  },
];

function HudMetricStatus({
  trend,
  seed,
}: {
  trend: "up" | "down" | "stable";
  seed: number;
}) {
  const trendClass = {
    up: "text-nexus-lime",
    down: "text-nexus-orange",
    stable: "text-nexus-cyan",
  }[trend];

  return (
    <div className="telemetry-status">
      <TelemetrySparkline seed={seed} variant="cyan" />
      <span className={cn("telemetry-sync-label", trendClass)}>
        {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"}
      </span>
    </div>
  );
}

export function HeroMetricsGrid() {
  return (
    <div className="hero-metrics-grid">
      {HERO_METRICS.map((m) => (
        <TelemetryCardLayout
          key={m.label}
          tone="cyan"
          header={
            <MicroLabel accent="cyan" pulse={false} className="!text-[9px]">
              {m.label}
            </MicroLabel>
          }
          value={
            <TelemetryMetricText
              value={m.value}
              unit={m.unit}
              digitsClass={m.digitsClass}
            />
          }
          graph={<HudMetricStatus trend={m.trend} seed={m.seed} />}
        />
      ))}
    </div>
  );
}
