"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";
import {
  formatDecimal,
  formatLatency,
  formatPercent,
  formatUptime,
} from "@/lib/telemetry/format-metric";
import { useSmoothMetric } from "@/hooks/use-smooth-metric";
import { cn } from "@/lib/utils";

interface MetricDigitsProps {
  motionValue: MotionValue<number>;
  format: (n: number) => string;
  className?: string;
}

export function MetricDigits({ motionValue, format, className }: MetricDigitsProps) {
  const text = useTransform(motionValue, (v) => format(v));

  return (
    <motion.span className={cn("telemetry-metric-digits", className)}>
      {text}
    </motion.span>
  );
}

interface TelemetryMetricTextProps {
  value: string;
  unit?: string;
  digitsClass?: string;
}

/** Static string metric (sector id) — fixed slot, no animation. */
export function TelemetryMetricText({
  value,
  unit,
  digitsClass,
}: TelemetryMetricTextProps) {
  return (
    <div className="telemetry-metric-row">
      <span className={cn("telemetry-metric-digits telemetry-metric-digits--text", digitsClass)}>
        {value}
      </span>
      {unit ? <span className="telemetry-metric-unit">{unit}</span> : null}
    </div>
  );
}

interface TelemetryMetricNumberProps {
  value: number;
  format: (n: number) => string;
  unit?: string;
  animate?: boolean;
  digitsClass?: string;
}

export function TelemetryMetricNumber({
  value,
  format,
  unit,
  animate = false,
  digitsClass,
}: TelemetryMetricNumberProps) {
  const mounted = useMounted();
  const live = mounted && animate;
  const spring = useSmoothMetric(value, live);

  if (!live) {
    return (
      <div className="telemetry-metric-row">
        <span className={cn("telemetry-metric-digits", digitsClass)}>
          {format(value)}
        </span>
        {unit ? <span className="telemetry-metric-unit">{unit}</span> : null}
      </div>
    );
  }

  return (
    <div className="telemetry-metric-row">
      <MetricDigits
        motionValue={spring}
        format={format}
        className={digitsClass}
      />
      {unit ? <span className="telemetry-metric-unit">{unit}</span> : null}
    </div>
  );
}

export const metricFormat = {
  percent: formatPercent,
  latency: formatLatency,
  uptime: formatUptime,
  decimal: formatDecimal,
};

interface TelemetryMetricBarProps {
  motionValue: MotionValue<number>;
}

export function TelemetryMetricBar({ motionValue }: TelemetryMetricBarProps) {
  const scaleX = useTransform(motionValue, (v) =>
    Math.min(1, Math.max(0, v / 100))
  );

  return (
    <div className="telemetry-bar-track" aria-hidden>
      <motion.div className="telemetry-bar-fill" style={{ scaleX }} />
    </div>
  );
}

export function TelemetryMetricBarStatic({ value }: { value: number }) {
  return (
    <div className="telemetry-bar-track" aria-hidden>
      <div
        className="telemetry-bar-fill"
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, value / 100))})` }}
      />
    </div>
  );
}
