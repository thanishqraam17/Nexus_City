"use client";

import { memo } from "react";
import { useTrafficSimulation } from "@/hooks/use-traffic-simulation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import {
  TRAFFIC_EDGES,
  TRAFFIC_NODES,
  type TrafficNodeDef,
} from "@/lib/system/traffic-simulation";
import { cn } from "@/lib/utils";

function edgeKey(from: string, to: string) {
  return `${from}->${to}`;
}

function nodeById(id: string) {
  return TRAFFIC_NODES.find((n) => n.id === id)!;
}

function TrafficFlowPanelInner() {
  const sim = useTrafficSimulation();

  return (
    <GlassPanel variant="command" glow="cyan" cornerMarks className="h-full min-h-[280px] p-0">
      <div className="traffic-flow-panel relative flex h-full min-h-[280px] flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <MicroLabel accent="cyan">Traffic Flow Matrix</MicroLabel>
          <div className="text-right font-mono text-[8px] uppercase tracking-widest text-white/35">
            <span className="block text-nexus-cyan/80">
              SYS {(sim.systemLoad * 100).toFixed(1)}%
            </span>
            <span className="mt-0.5 block">{sim.throughput} pkt/s</span>
          </div>
        </div>

        <div className="traffic-flow-grid relative mt-5 flex-1 min-h-[200px]">
          <div className="traffic-flow-map absolute inset-0 rounded-sm opacity-50" aria-hidden />

          <svg
            className="traffic-flow-links absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {TRAFFIC_EDGES.map((edge, ei) => {
              const from = nodeById(edge.from);
              const to = nodeById(edge.to);
              const flow = sim.edgeFlow[edgeKey(edge.from, edge.to)] ?? 0.4;
              const active = flow > 0.55;
              const progress = ((sim.tick + ei * 9) % 48) / 48;
              return (
                <g key={edgeKey(edge.from, edge.to)}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={
                      active
                        ? "rgba(212, 255, 0, 0.22)"
                        : "rgba(0, 240, 255, 0.12)"
                    }
                    strokeWidth={0.35 + flow * 0.5}
                    strokeDasharray="2 3"
                    className="traffic-flow-edge"
                    style={{
                      strokeDashoffset: `${((sim.tick + ei * 3) % 24) * (1.1 - flow)}`,
                    }}
                  />
                  <circle
                    cx={from.x + (to.x - from.x) * progress}
                    cy={from.y + (to.y - from.y) * progress}
                    r={0.55}
                    fill={active ? "rgba(212,255,0,0.7)" : "rgba(0,240,255,0.45)"}
                    opacity={flow}
                  />
                </g>
              );
            })}
          </svg>

          {TRAFFIC_NODES.map((node) => (
            <TrafficNode
              key={node.id}
              node={node}
              load={sim.nodeLoad[node.id] ?? node.baseLoad}
              isHub={node.role === "hub"}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/[0.06] pt-4">
          {TRAFFIC_NODES.filter((n) => n.role !== "hub").map((n) => (
            <span key={n.id} className="font-mono text-[8px] text-white/35">
              {n.label}: {((sim.nodeLoad[n.id] ?? 0) * 100).toFixed(0)}%
              <span className="ml-1 text-nexus-cyan/50">
                {n.id === "N-01" || n.id === "S-07" ? "↓" : n.id === "E-04" ? "→" : "↔"}
              </span>
            </span>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

function TrafficNode({
  node,
  load,
  isHub,
}: {
  node: TrafficNodeDef;
  load: number;
  isHub: boolean;
}) {
  return (
    <div
      className={cn(
        "traffic-flow-node absolute -translate-x-1/2 -translate-y-1/2",
        isHub && "traffic-flow-node--hub"
      )}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span
        className={cn(
          "font-mono text-[8px] uppercase tracking-widest",
          isHub ? "text-nexus-lime/90" : "text-nexus-cyan/80"
        )}
      >
        {node.id}
      </span>
      <div className="traffic-flow-bar mt-1 h-0.5 w-14 overflow-hidden rounded-full bg-white/10 sm:w-16">
        <div
          className={cn(
            "traffic-flow-bar-fill h-full origin-left rounded-full",
            isHub
              ? "bg-gradient-to-r from-nexus-lime/80 to-nexus-cyan/60"
              : "bg-gradient-to-r from-nexus-cyan to-nexus-lime/70"
          )}
          style={{ transform: `scaleX(${load})` }}
        />
      </div>
    </div>
  );
}

export const TrafficFlowPanel = memo(TrafficFlowPanelInner);
