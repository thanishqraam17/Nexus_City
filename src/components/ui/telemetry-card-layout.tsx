"use client";

import { GlassPanel } from "./glass-panel";
import { cn } from "@/lib/utils";

interface TelemetryCardLayoutProps {
  header: React.ReactNode;
  value: React.ReactNode;
  graph: React.ReactNode;
  bar?: React.ReactNode;
  isLive?: boolean;
  className?: string;
}

/** Fixed HEADER → VALUE → [BAR] → GRAPH structure for all telemetry cards. */
export function TelemetryCardLayout({
  header,
  value,
  graph,
  bar,
  isLive = false,
  className,
}: TelemetryCardLayoutProps) {
  return (
    <div className={cn("telemetry-card-wrap", className)}>
      {isLive ? (
        <span
          className="telemetry-pulse-ring pointer-events-none absolute -inset-px z-0 rounded-[2px] border border-nexus-lime/25"
          aria-hidden
        />
      ) : null}
      <GlassPanel
        variant="telemetry"
        glow="lime"
        cornerMarks
        className="telemetry-card"
        revealOnView={false}
        interactive={false}
      >
        <div className="telemetry-card-inner">
          <div className="telemetry-slot telemetry-slot-header">{header}</div>
          <div className="telemetry-slot telemetry-slot-value">{value}</div>
          {bar ? (
            <div className="telemetry-slot telemetry-slot-bar">{bar}</div>
          ) : (
            <div className="telemetry-slot telemetry-slot-bar telemetry-slot-bar--empty" aria-hidden />
          )}
          <div className="telemetry-slot telemetry-slot-graph">{graph}</div>
        </div>
      </GlassPanel>
    </div>
  );
}
