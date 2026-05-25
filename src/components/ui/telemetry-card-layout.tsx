"use client";

import { GlassPanel } from "./glass-panel";
import { cn } from "@/lib/utils";

type TelemetryTone = "lime" | "cyan";

interface TelemetryCardLayoutProps {
  header: React.ReactNode;
  value: React.ReactNode;
  graph: React.ReactNode;
  bar?: React.ReactNode;
  isLive?: boolean;
  tone?: TelemetryTone;
  className?: string;
}

/** Fixed HEADER → VALUE → [BAR] → GRAPH structure for all instrumentation cards. */
export function TelemetryCardLayout({
  header,
  value,
  graph,
  bar,
  isLive = false,
  tone = "lime",
  className,
}: TelemetryCardLayoutProps) {
  return (
    <div
      data-depth-pull
      className={cn(
        "telemetry-card-wrap group/telemetry os-telemetry-pulse",
        isLive && "telemetry-card-wrap--live",
        className
      )}
    >
      {isLive ? (
        <span
          className={cn(
            "telemetry-pulse-ring pointer-events-none absolute -inset-px z-0 rounded-[2px] border",
            tone === "cyan" ? "border-nexus-cyan/25" : "border-nexus-lime/25"
          )}
          aria-hidden
        />
      ) : null}
      <GlassPanel
        variant="telemetry"
        glow={tone}
        cornerMarks
        className={cn("telemetry-card", tone === "cyan" && "telemetry-card--cyan")}
        revealOnView={false}
        interactive={false}
      >
        <div className={cn("telemetry-card-inner", `telemetry-card-inner--${tone}`)}>
          <div className="telemetry-slot telemetry-slot-header">{header}</div>
          <div className="telemetry-slot telemetry-slot-value">{value}</div>
          {bar ? (
            <div className="telemetry-slot telemetry-slot-bar">{bar}</div>
          ) : (
            <div
              className="telemetry-slot telemetry-slot-bar telemetry-slot-bar--empty"
              aria-hidden
            />
          )}
          <div className="telemetry-slot telemetry-slot-graph">{graph}</div>
        </div>
      </GlassPanel>
    </div>
  );
}
