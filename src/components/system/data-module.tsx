"use client";

import { memo } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useSimulatedMetric } from "@/hooks/use-simulated-metric";
import { useUIStore } from "@/store/ui-store";
import { MicroLabel } from "@/components/ui/micro-label";
import { TelemetryCardLayout } from "@/components/ui/telemetry-card-layout";
import { TelemetryMetricNumber } from "@/components/ui/telemetry-metric";
import { TelemetrySparkline } from "@/components/ui/telemetry-sparkline";
import { formatCityMetric } from "@/lib/system/format-metric";
import { METRIC_DIAGNOSTICS } from "@/lib/system/os-runtime";
import type { CityMetricDef } from "@/lib/system/city-data";
import { cn } from "@/lib/utils";

interface DataModuleProps {
  metric: CityMetricDef;
  tone?: "lime" | "cyan";
  live?: boolean;
  className?: string;
}

function DataModuleInner({
  metric,
  tone = "lime",
  live = true,
  className,
}: DataModuleProps) {
  const mounted = useMounted();
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const isLive = mounted && telemetryLive && live;
  const value = useSimulatedMetric(metric.base, metric.variance, metric.seed, isLive);
  const format = (n: number) => formatCityMetric(n, metric.format);

  return (
    <TelemetryCardLayout
      className={className}
      tone={tone}
      isLive={isLive}
      header={
        <MicroLabel accent={tone} pulse={false} className="!text-[9px]">
          {metric.label}
        </MicroLabel>
      }
      value={
        <TelemetryMetricNumber
          value={value}
          format={format}
          unit={metric.unit}
          animate={isLive}
          digitsClass={metric.digitsClass}
        />
      }
      diagnostic={METRIC_DIAGNOSTICS[metric.id] ?? "Infrastructure channel nominal"}
      graph={
        <div className="telemetry-status">
          <TelemetrySparkline seed={metric.sparkSeed} variant={tone} />
          <span
            className={cn(
              "telemetry-sync-label",
              metric.trend === "up" && "text-nexus-lime",
              metric.trend === "down" && "text-nexus-orange",
              metric.trend === "stable" && "text-nexus-cyan"
            )}
          >
            {metric.trend === "up" ? "▲" : metric.trend === "down" ? "▼" : "—"}
          </span>
        </div>
      }
    />
  );
}

export const DataModule = memo(DataModuleInner);
