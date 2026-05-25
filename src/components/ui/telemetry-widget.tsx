"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "./glass-panel";
import { MicroLabel } from "./micro-label";
import { cn } from "@/lib/utils";
import { floatPulse } from "@/lib/motion/variants";
import { staggerTelemetry } from "@/lib/motion/transitions";
import { springInertia } from "@/lib/motion/transitions";
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
  const motionReady = mounted && !reduceMotion;

  const trendColor = {
    up: "text-nexus-lime",
    down: "text-nexus-orange",
    stable: "text-nexus-cyan",
  }[trend];

  return (
    <motion.div
      className={cn("relative w-full max-w-[200px]", className)}
      variants={floatPulse}
      initial={false}
      animate={motionReady ? "animate" : undefined}
      style={{ animationDelay: `${delay}s` }}
      transition={{ delay }}
    >
      {isLive && (
        <span
          className="telemetry-pulse-ring pointer-events-none absolute -inset-1 rounded-sm border border-nexus-lime/30"
          aria-hidden
        />
      )}
      <GlassPanel
        variant="telemetry"
        glow="lime"
        cornerMarks
        className="p-4"
        revealOnView
        coreGlow
      >
        <MicroLabel accent="lime" pulse={isLive}>
          {label}
        </MicroLabel>
        <div className="mt-3 flex items-baseline gap-1">
          <motion.span
            key={value}
            className="font-display text-2xl font-semibold tracking-tight text-white"
            initial={false}
            animate={
              motionReady
                ? { opacity: [0.85, 1, 0.9, 1], filter: "blur(0px)" }
                : false
            }
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {value}
          </motion.span>
          {unit && (
            <span className="font-mono text-xs text-white/35">{unit}</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="telemetry-heartbeat relative h-px flex-1 origin-left bg-gradient-to-r from-nexus-lime/50 to-transparent" />
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
  const motionReady = mounted;
  const liveVal = useLiveValue(percentage, 4, true);

  return (
    <GlassPanel
      variant="hud"
      glow="cyan"
      className={cn("p-4", className)}
      cornerMarks
      coreGlow
    >
      <MicroLabel accent="cyan">{label}</MicroLabel>
      <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-nexus-cyan/80 to-nexus-lime/80"
          initial={false}
          animate={motionReady ? { width: `${liveVal}%` } : false}
          transition={springInertia}
        />
        {motionReady && (
          <motion.div
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-lime shadow-[0_0_12px_rgba(212,255,0,0.8)]"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ left: `${liveVal}%` }}
          />
        )}
      </div>
      <p className="mt-2 font-mono text-xs text-white/50 tabular-nums">
        {liveVal.toFixed(1)}%
      </p>
    </GlassPanel>
  );
}

export function TelemetryCluster({ className }: { className?: string }) {
  const activeSector = useUIStore((s) => s.activeSector);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <motion.div
      className={cn("flex flex-col gap-3", className)}
      variants={staggerTelemetry()}
      initial={false}
      animate={motionReady ? "visible" : false}
    >
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
    </motion.div>
  );
}
