"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "./glass-panel";
import { cn } from "@/lib/utils";
import { springHoverReact } from "@/lib/motion/transitions";

type TelemetryTone = "lime" | "cyan";

interface TelemetryCardLayoutProps {
  header: React.ReactNode;
  value: React.ReactNode;
  graph: React.ReactNode;
  bar?: React.ReactNode;
  isLive?: boolean;
  tone?: TelemetryTone;
  diagnostic?: string;
  className?: string;
}

/** Fixed HEADER → VALUE → [BAR] → GRAPH + hover diagnostics drilldown */
export function TelemetryCardLayout({
  header,
  value,
  graph,
  bar,
  isLive = false,
  tone = "lime",
  diagnostic,
  className,
}: TelemetryCardLayoutProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-depth-pull
      className={cn(
        "telemetry-card-wrap group/telemetry os-telemetry-pulse",
        isLive && "telemetry-card-wrap--live",
        expanded && "telemetry-card-wrap--expanded",
        className
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
    >
      {isLive ? (
        <span
          className={cn(
            "telemetry-pulse-ring pointer-events-none absolute -inset-px z-0 rounded-[2px] border transition-opacity duration-500",
            expanded ? "opacity-100" : "opacity-60",
            tone === "cyan" ? "border-nexus-cyan/30" : "border-nexus-lime/30"
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
        interactive
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
          <AnimatePresence>
            {expanded && diagnostic && (
              <motion.div
                className="telemetry-card-detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={springHoverReact}
              >
                <p className="telemetry-card-detail__text">{diagnostic}</p>
                <span className="telemetry-card-detail__signal" aria-hidden />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassPanel>
    </div>
  );
}
