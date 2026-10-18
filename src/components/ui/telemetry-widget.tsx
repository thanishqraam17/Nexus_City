"use client";

import { useMounted } from "@/hooks/use-mounted";
import { ClientOnly } from "@/components/ui/client-only";
import { MicroLabel } from "./micro-label";
import { TelemetrySparkline } from "./telemetry-sparkline";
import { TelemetryCardLayout } from "./telemetry-card-layout";
import {
  MetricDigits,
  TelemetryMetricBar,
  TelemetryMetricBarStatic,
  TelemetryMetricNumber,
  TelemetryMetricText,
  metricFormat,
} from "./telemetry-metric";
import { formatPercent } from "@/lib/telemetry/format-metric";
import { useSeededLiveValue } from "@/lib/telemetry/seeded-value";
import { useSmoothMetric } from "@/hooks/use-smooth-metric";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useOsRuntimeStore } from "@/store/os-runtime-store";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function computeLatencyMs(load: number, neuralState: string) {
  // Low variance + correlated with load/state: believable, non-random.
  const load01 = clamp01((load - 38) / (72 - 38));
  const statePenalty =
    neuralState === "Optimized"
      ? -0.08
      : neuralState === "Balancing"
        ? 0.03
        : neuralState === "Recalibrating"
          ? 0.12
          : 0.05;
  const ms = 0.65 + load01 * 0.9 + statePenalty;
  return Math.min(2.2, Math.max(0.55, ms));
}

function TelemetryStatus({
  trend,
}: {
  trend: "up" | "down" | "stable";
}) {
  const trendClass = {
    up: "text-nexus-lime",
    down: "text-nexus-orange",
    stable: "text-nexus-cyan",
  }[trend];

  const sparkSeed = trend === "up" ? 2 : trend === "down" ? 5 : 3;

  return (
    <div className="telemetry-status">
      <TelemetrySparkline seed={sparkSeed} variant="lime" />
      <span className={cn("telemetry-sync-label", trendClass)}>
        {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} sync
      </span>
    </div>
  );
}

interface TelemetryWidgetProps {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function TelemetryWidget({
  label,
  value,
  unit,
  trend = "stable",
  className,
}: TelemetryWidgetProps) {
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const mounted = useMounted();
  const isLive = mounted && telemetryLive;

  return (
    <TelemetryCardLayout
      className={className}
      isLive={isLive}
      header={
        <MicroLabel accent="lime" pulse={false}>
          {label}
        </MicroLabel>
      }
      value={
        <TelemetryMetricText
          value={value}
          unit={unit}
          digitsClass="telemetry-metric-digits--sector"
        />
      }
      graph={<TelemetryStatus trend={trend} />}
    />
  );
}

interface TelemetryNumericWidgetProps {
  label: string;
  value: number;
  format: (n: number) => string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  animate?: boolean;
  digitsClass?: string;
  className?: string;
}

function TelemetryNumericWidget({
  label,
  value,
  format,
  unit,
  trend = "stable",
  animate = false,
  digitsClass,
  className,
  seed = 1,
  variance = 0,
}: TelemetryNumericWidgetProps & { seed?: number; variance?: number }) {
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const mounted = useMounted();
  const isLive = mounted && telemetryLive && animate;
  const target = useSeededLiveValue(value, variance, seed, isLive);

  return (
    <TelemetryCardLayout
      className={className}
      isLive={isLive}
      header={
        <MicroLabel accent="lime" pulse={false}>
          {label}
        </MicroLabel>
      }
      value={
        <TelemetryMetricNumber
          value={target}
          format={format}
          unit={unit}
          animate={isLive}
          digitsClass={digitsClass}
        />
      }
      graph={<TelemetryStatus trend={trend} />}
    />
  );
}

function NeuralThroughputLive({
  label,
  percentage,
  trend = "up",
  className,
}: {
  label: string;
  percentage: number;
  trend?: "up" | "down" | "stable";
  className?: string;
}) {
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const target = useSeededLiveValue(percentage, 2.5, 7, telemetryLive);
  const clamped = Math.min(100, Math.max(0, target));
  const spring = useSmoothMetric(clamped, telemetryLive);

  return (
    <TelemetryCardLayout
      className={className}
      isLive={telemetryLive}
      header={
        <MicroLabel accent="lime" pulse={false}>
          {label}
        </MicroLabel>
      }
      value={
        <div className="telemetry-metric-row">
          <MetricDigits
            motionValue={spring}
            format={metricFormat.percent}
            className="telemetry-metric-digits--percent"
          />
          <span className="telemetry-metric-unit">%</span>
        </div>
      }
      bar={<TelemetryMetricBar motionValue={spring} />}
      graph={<TelemetryStatus trend={trend} />}
    />
  );
}

function NeuralThroughputStatic({
  label,
  percentage,
  trend = "up",
  className,
}: {
  label: string;
  percentage: number;
  trend?: "up" | "down" | "stable";
  className?: string;
}) {
  return (
    <TelemetryCardLayout
      className={className}
      header={
        <MicroLabel accent="lime" pulse={false}>
          {label}
        </MicroLabel>
      }
      value={
        <div className="telemetry-metric-row">
          <span className="telemetry-metric-digits telemetry-metric-digits--percent">
            {formatPercent(percentage)}
          </span>
          <span className="telemetry-metric-unit">%</span>
        </div>
      }
      bar={<TelemetryMetricBarStatic value={percentage} />}
      graph={<TelemetryStatus trend={trend} />}
    />
  );
}

function NeuralThroughputWidget({
  label,
  percentage,
  trend = "up",
  className,
}: {
  label: string;
  percentage: number;
  trend?: "up" | "down" | "stable";
  className?: string;
}) {
  return (
    <ClientOnly
      fallback={
        <NeuralThroughputStatic
          label={label}
          percentage={percentage}
          trend={trend}
          className={className}
        />
      }
    >
      <NeuralThroughputLive
        label={label}
        percentage={percentage}
        trend={trend}
        className={className}
      />
    </ClientOnly>
  );
}

/** Right-rail telemetry stack — fixed layout, no motion wrappers. */
export function TelemetryRail() {
  const activeSector = useUIStore((s) => s.activeSector);
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const mounted = useMounted();
  const isLive = mounted && telemetryLive;
  const syncPercent = useOsRuntimeStore((s) => s.syncPercent);
  const throughputIndex = useOsRuntimeStore((s) => s.throughputIndex);
  const infrastructureLoad = useOsRuntimeStore((s) => s.infrastructureLoad);
  const neuralState = useOsRuntimeStore((s) => s.neuralState);

  const latencyBase = computeLatencyMs(infrastructureLoad, neuralState);

  return (
    <aside className="telemetry-rail" aria-label="Live telemetry">
      <div className="telemetry-rail-header">
        <MicroLabel accent="orange" pulse={false}>
          Live Telemetry
        </MicroLabel>
      </div>
      <div className="telemetry-rail-stack">
        <TelemetryWidget label="Sector Load" value={activeSector} trend="stable" />
        <TelemetryNumericWidget
          label="Grid Uptime"
          value={syncPercent}
          format={metricFormat.uptime}
          unit="%"
          trend={syncPercent > 99.2 ? "up" : syncPercent < 98.4 ? "down" : "stable"}
          animate={isLive}
          seed={2}
          variance={0.08}
          digitsClass="telemetry-metric-digits--uptime"
        />
        <NeuralThroughputWidget
          label="Neural Throughput"
          percentage={throughputIndex}
          trend={neuralState === "Optimized" ? "up" : neuralState === "Recalibrating" ? "down" : "stable"}
        />
        <TelemetryNumericWidget
          label="Latency"
          value={latencyBase}
          format={metricFormat.latency}
          unit="ms"
          trend={neuralState === "Optimized" ? "down" : neuralState === "Recalibrating" ? "up" : "stable"}
          animate={isLive}
          seed={9}
          variance={0.08}
          digitsClass="telemetry-metric-digits--latency"
        />
      </div>
    </aside>
  );
}

/** @deprecated Use TelemetryRail */
export function TelemetryCluster({ className }: { className?: string }) {
  return (
    <div className={className}>
      <TelemetryRail />
    </div>
  );
}
