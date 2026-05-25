"use client";

import { memo, useMemo } from "react";
import { useSimulatedMetric } from "@/hooks/use-simulated-metric";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import { TRAFFIC_CORRIDORS } from "@/lib/system/city-data";
import { cn } from "@/lib/utils";

function TrafficFlowPanelInner() {
  const pulse = useSimulatedMetric(0.5, 0.15, 30, true);

  const corridors = useMemo(
    () =>
      TRAFFIC_CORRIDORS.map((c, i) => ({
        ...c,
        animatedLoad: Math.min(1, Math.max(0.2, c.load + Math.sin(pulse * 6 + i) * 0.06)),
      })),
    [pulse]
  );

  return (
    <GlassPanel variant="command" glow="cyan" cornerMarks className="h-full min-h-[280px] p-0">
      <div className="traffic-flow-panel relative flex h-full min-h-[280px] flex-col p-5 sm:p-6">
        <MicroLabel accent="cyan">Traffic Flow Matrix</MicroLabel>
        <div className="traffic-flow-grid relative mt-6 flex-1">
          <div className="traffic-flow-map absolute inset-0 rounded-sm opacity-60" aria-hidden />
          {corridors.map((c, i) => (
            <div
              key={c.id}
              className="traffic-flow-node absolute"
              style={{
                left: `${12 + (i * 17) % 70}%`,
                top: `${18 + (i * 23) % 55}%`,
              }}
            >
              <span className="font-mono text-[8px] uppercase tracking-widest text-nexus-cyan/80">
                {c.id}
              </span>
              <div className="traffic-flow-bar mt-1.5 h-0.5 w-16 overflow-hidden rounded-full bg-white/10">
                <div
                  className="traffic-flow-bar-fill h-full origin-left rounded-full bg-gradient-to-r from-nexus-cyan to-nexus-lime"
                  style={{ transform: `scaleX(${c.animatedLoad})` }}
                />
              </div>
            </div>
          ))}
          <svg className="traffic-flow-links absolute inset-0 h-full w-full" aria-hidden>
            <line x1="18%" y1="30%" x2="45%" y2="22%" stroke="rgba(0,240,255,0.15)" strokeWidth="1" />
            <line x1="45%" y1="22%" x2="72%" y2="40%" stroke="rgba(212,255,0,0.12)" strokeWidth="1" />
            <line x1="30%" y1="55%" x2="58%" y2="35%" stroke="rgba(0,240,255,0.1)" strokeWidth="1" />
          </svg>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 border-t border-white/[0.06] pt-4">
          {corridors.slice(0, 3).map((c) => (
            <span key={c.id} className={cn("font-mono text-[8px] text-white/35")}>
              {c.label}: {(c.animatedLoad * 100).toFixed(0)}%
            </span>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

export const TrafficFlowPanel = memo(TrafficFlowPanelInner);
