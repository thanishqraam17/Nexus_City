"use client";

import { getSparklinePath } from "@/lib/telemetry/sparkline-paths";
import { cn } from "@/lib/utils";

interface TelemetrySparklineProps {
  seed?: number;
  variant?: "lime" | "cyan";
  className?: string;
}

const STROKE = {
  lime: "#d4ff00",
  cyan: "#00f0ff",
} as const;

export function TelemetrySparkline({
  seed = 1,
  variant = "lime",
  className,
}: TelemetrySparklineProps) {
  const path = getSparklinePath(seed);
  const stroke = STROKE[variant];

  return (
    <div className={cn("telemetry-sparkline-wrap", className)} aria-hidden>
      <svg
        className="telemetry-sparkline"
        viewBox="0 0 80 20"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="19"
          x2="80"
          y2="19"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <g className="telemetry-sparkline-wave">
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.78"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
