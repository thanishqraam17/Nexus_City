/**
 * Deterministic infrastructure traffic simulation.
 * Hub-and-spoke topology with directional flow propagation.
 */

import { seededUnit } from "@/lib/system/seeded-random";

export type TrafficNodeRole = "hub" | "corridor" | "junction";

export interface TrafficNodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
  role: TrafficNodeRole;
  baseLoad: number;
}

export interface TrafficEdgeDef {
  from: string;
  to: string;
  capacity: number;
}

export const TRAFFIC_NODES: TrafficNodeDef[] = [
  { id: "HUB", label: "Central Mesh", x: 50, y: 48, role: "hub", baseLoad: 0.72 },
  { id: "N-01", label: "North Corridor", x: 50, y: 14, role: "corridor", baseLoad: 0.78 },
  { id: "E-04", label: "East Transit", x: 82, y: 38, role: "corridor", baseLoad: 0.64 },
  { id: "C-12", label: "Central Axis", x: 68, y: 58, role: "junction", baseLoad: 0.85 },
  { id: "S-07", label: "South Grid", x: 50, y: 82, role: "corridor", baseLoad: 0.52 },
  { id: "W-03", label: "West Link", x: 18, y: 42, role: "corridor", baseLoad: 0.7 },
];

/** Directed edges — flow moves toward hub then distributes */
export const TRAFFIC_EDGES: TrafficEdgeDef[] = [
  { from: "N-01", to: "HUB", capacity: 0.9 },
  { from: "E-04", to: "C-12", capacity: 0.75 },
  { from: "W-03", to: "HUB", capacity: 0.8 },
  { from: "S-07", to: "HUB", capacity: 0.7 },
  { from: "HUB", to: "C-12", capacity: 0.85 },
  { from: "C-12", to: "E-04", capacity: 0.55 },
  { from: "HUB", to: "S-07", capacity: 0.45 },
];

export interface TrafficSimState {
  tick: number;
  nodeLoad: Record<string, number>;
  edgeFlow: Record<string, number>;
  systemLoad: number;
  throughput: number;
}

function edgeKey(from: string, to: string) {
  return `${from}->${to}`;
}

export function createTrafficState(tick = 0): TrafficSimState {
  const nodeLoad: Record<string, number> = {};
  TRAFFIC_NODES.forEach((n) => {
    nodeLoad[n.id] = n.baseLoad;
  });

  const edgeFlow: Record<string, number> = {};
  TRAFFIC_EDGES.forEach((e) => {
    edgeFlow[edgeKey(e.from, e.to)] = e.capacity * 0.5;
  });

  return {
    tick,
    nodeLoad,
    edgeFlow,
    systemLoad: 0.68,
    throughput: 847,
  };
}

/** Advance simulation one tick — deterministic, no Math.random. */
export function stepTrafficSimulation(prev: TrafficSimState): TrafficSimState {
  const tick = prev.tick + 1;
  const t = tick * 0.04;

  const nodeLoad: Record<string, number> = {};
  TRAFFIC_NODES.forEach((n, i) => {
    const wave =
      Math.sin(t + i * 1.1) * 0.04 + Math.sin(t * 0.37 + i * 2.3) * 0.025;
    const noise = (seededUnit(42, tick + i) - 0.5) * 0.03;
    nodeLoad[n.id] = Math.min(0.98, Math.max(0.18, n.baseLoad + wave + noise));
  });

  const edgeFlow: Record<string, number> = {};
  TRAFFIC_EDGES.forEach((e, i) => {
    const sourceLoad = nodeLoad[e.from] ?? 0.5;
    const sinkLoad = nodeLoad[e.to] ?? 0.5;
    const pulse = Math.sin(t * 1.4 + i * 0.9) * 0.08;
    const flow = (sourceLoad * 0.55 + sinkLoad * 0.25 + e.capacity * 0.2 + pulse);
    edgeFlow[edgeKey(e.from, e.to)] = Math.min(1, Math.max(0.12, flow));
  });

  const loads = Object.values(nodeLoad);
  const systemLoad =
    loads.reduce((a, b) => a + b, 0) / loads.length;
  const flows = Object.values(edgeFlow);
  const throughput = Math.round(
    720 + flows.reduce((a, b) => a + b, 0) * 42 + Math.sin(t) * 18
  );

  return { tick, nodeLoad, edgeFlow, systemLoad, throughput };
}
