import type { OsRuntimeSnapshot } from "@/lib/system/os-runtime";

export type InfrastructureEventKind =
  | "relay_reroute"
  | "traffic_redistribute"
  | "neural_balance"
  | "atmo_recalibrate"
  | "energy_stabilize"
  | "ai_optimize";

export interface InfrastructureEvent {
  id: string;
  kind: InfrastructureEventKind;
  message: string;
  shortLabel: string;
  tick: number;
}

type EventBuilder = (snapshot: OsRuntimeSnapshot, tick: number) => InfrastructureEvent;

const EVENT_BUILDERS: EventBuilder[] = [
  (s, tick) => ({
    id: `evt-${tick}-relay`,
    kind: "relay_reroute",
    shortLabel: "Relay reroute",
    message: `Relay ring adjusted — ${s.activeRelays} pathways active. ${s.neuralState} mode engaged on cortex uplink.`,
    tick,
  }),
  (s, tick) => ({
    id: `evt-${tick}-traffic`,
    kind: "traffic_redistribute",
    shortLabel: "Traffic rebalance",
    message: `District traffic vectors redistributed. Load index ${s.infrastructureLoad}% — corridors operating within SLA.`,
    tick,
  }),
  (s, tick) => ({
    id: `evt-${tick}-neural`,
    kind: "neural_balance",
    shortLabel: "Neural balance",
    message: `Neural congestion balancing complete. Throughput index ${s.throughputIndex} · mesh integrity nominal.`,
    tick,
  }),
  (s, tick) => ({
    id: `evt-${tick}-atmo`,
    kind: "atmo_recalibrate",
    shortLabel: "Atmo recalibration",
    message: `Atmospheric sensors recalibrated — ${s.atmosphere} profile applied across metropolitan envelope.`,
    tick,
  }),
  (s, tick) => ({
    id: `evt-${tick}-energy`,
    kind: "energy_stabilize",
    shortLabel: "Energy stabilize",
    message: `Energy mesh stabilized at ${s.energyStability}% capacity. District routing efficiency within optimal band.`,
    tick,
  }),
  (s, tick) => ({
    id: `evt-${tick}-ai`,
    kind: "ai_optimize",
    shortLabel: "AI optimize cycle",
    message: `Autonomous optimization cycle complete. Sync ${s.syncPercent.toFixed(2)}% · uplink ${s.uplink}.`,
    tick,
  }),
];

/** Emit at most one event every ~3 runtime ticks (~8.4s) */
export function maybeEmitInfrastructureEvent(
  tick: number,
  snapshot: OsRuntimeSnapshot,
  lastEventTick: number
): InfrastructureEvent | null {
  if (tick < 2) return null;
  if (tick - lastEventTick < 3) return null;
  if (tick % 3 !== 0) return null;

  const idx = Math.floor(tick / 3) % EVENT_BUILDERS.length;
  return EVENT_BUILDERS[idx](snapshot, tick);
}
