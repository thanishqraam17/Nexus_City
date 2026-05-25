"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "./glass-panel";
import { MicroLabel } from "./micro-label";
import { cn } from "@/lib/utils";
import { floatPulse } from "@/lib/motion/variants";
import { useUIStore } from "@/store/ui-store";

interface TelemetryWidgetProps {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  className?: string;
  delay?: number;
  live?: boolean;
}

function useLiveValue(base: number, variance: number, live: boolean) {
  const mounted = useMounted();
  const [val, setVal] = useState(base);

  useEffect(() => {
    if (!mounted || !live) return;
    const id = setInterval(() => {
      setVal(base + (Math.random() - 0.5) * variance);
    }, 1200);
    return () => clearInterval(id);
  }, [mounted, base, variance, live]);

  return val;
}

export function TelemetryWidget({
  label,
  value,
  unit,
  trend = "stable",
  className,
  delay = 0,
  live = true,
}: TelemetryWidgetProps) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const isLive = mounted && live && telemetryLive;

  const trendColor = {
    up: "text-nexus-lime",
    down: "text-nexus-orange",
    stable: "text-nexus-cyan",
  }[trend];

  return (
    <motion.div
      className={cn("w-full max-w-[200px]", className)}
      variants={floatPulse}
      initial="initial"
      animate={mounted && !reduceMotion ? "animate" : undefined}
      style={{ animationDelay: `${delay}s` }}
      transition={{ delay }}
    >
      <GlassPanel
        variant="telemetry"
        glow="lime"
        cornerMarks
        className="p-4"
        revealOnView
      >
        <MicroLabel accent="lime" pulse={isLive}>
          {label}
        </MicroLabel>
        <div className="mt-3 flex items-baseline gap-1">
          <motion.span
            key={value}
            className="font-display text-2xl font-semibold tracking-tight text-white"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          >
            {value}
          </motion.span>
          {unit && (
            <span className="font-mono text-xs text-white/35">{unit}</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-nexus-lime/50 to-transparent" />
          <span className={cn("font-mono text-[9px] uppercase tracking-widest", trendColor)}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} sync
          </span>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

interface TelemetryBarWidgetProps {
  label: string;
  percentage: number;
  className?: string;
}

export function TelemetryBarWidget({
  label,
  percentage,
  className,
}: TelemetryBarWidgetProps) {
  const mounted = useMounted();
  const liveVal = useLiveValue(percentage, 4, true);

  return (
    <GlassPanel variant="hud" glow="cyan" className={cn("p-4", className)} cornerMarks>
      <MicroLabel accent="cyan">{label}</MicroLabel>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-nexus-cyan/80 to-nexus-lime/80"
          initial={false}
          animate={mounted ? { width: `${liveVal}%` } : false}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-2 font-mono text-xs text-white/50">
        {liveVal.toFixed(1)}%
      </p>
    </GlassPanel>
  );
}

export function TelemetryCluster({ className }: { className?: string }) {
  const activeSector = useUIStore((s) => s.activeSector);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <TelemetryWidget
        label="Sector Load"
        value={activeSector}
        unit=""
        trend="stable"
        delay={0}
      />
      <TelemetryWidget
        label="Grid Uptime"
        value="99.97"
        unit="%"
        trend="up"
        delay={0.15}
      />
      <TelemetryBarWidget label="Neural Throughput" percentage={87} />
      <TelemetryWidget
        label="Latency"
        value="0.8"
        unit="ms"
        trend="down"
        delay={0.3}
      />
    </div>
  );
}
