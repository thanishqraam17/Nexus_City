/** Believable OS runtime states — deterministic drift, no random spam */

export type NeuralActivityState =
  | "Routing"
  | "Balancing"
  | "Recalibrating"
  | "Optimized";

export type AtmosphereState = "Stable" | "Adaptive" | "Monitoring";
export type UplinkState = "Nominal" | "Peak" | "Secured";

export interface OsRuntimeSnapshot {
  syncPercent: number;
  neuralState: NeuralActivityState;
  atmosphere: AtmosphereState;
  infrastructureLoad: number;
  uplink: UplinkState;
  activeRelays: number;
  throughputIndex: number;
}

const NEURAL_STATES: NeuralActivityState[] = [
  "Routing",
  "Balancing",
  "Recalibrating",
  "Optimized",
];

const ATMOSPHERE_STATES: AtmosphereState[] = ["Stable", "Adaptive", "Monitoring"];

const UPLINK_STATES: UplinkState[] = ["Nominal", "Peak", "Secured"];

function drift(base: number, variance: number, tick: number, seed: number): number {
  const wave = Math.sin(tick * 0.4 + seed * 1.7) * 0.5 + Math.sin(tick * 0.17 + seed) * 0.5;
  return base + wave * variance;
}

export function computeOsSnapshot(tick: number): OsRuntimeSnapshot {
  const syncPercent = Math.min(99.97, Math.max(97.2, drift(98.85, 0.9, tick, 1)));
  const infrastructureLoad = Math.min(72, Math.max(38, drift(54, 14, tick, 2)));
  const throughputIndex = Math.min(98, Math.max(72, drift(87, 8, tick, 3)));
  const neuralIdx = Math.floor((tick * 0.15 + syncPercent * 0.01) % NEURAL_STATES.length);
  const atmoIdx = Math.floor((tick * 0.11) % ATMOSPHERE_STATES.length);
  const uplinkIdx = infrastructureLoad > 62 ? 1 : syncPercent > 99 ? 2 : 0;

  return {
    syncPercent,
    neuralState: NEURAL_STATES[neuralIdx],
    atmosphere: ATMOSPHERE_STATES[atmoIdx],
    infrastructureLoad: Math.round(infrastructureLoad),
    uplink: UPLINK_STATES[uplinkIdx],
    activeRelays: 5,
    throughputIndex: Math.round(throughputIndex),
  };
}

export const SECTION_AI_OBSERVATIONS: Record<string, string[]> = {
  overview: [
    "Metropolitan cortex online — all primary sectors reporting.",
    "Environmental telemetry within optimal variance.",
    "Operator interface ready for descent protocols.",
  ],
  intelligence: [
    "District intelligence mesh synchronized.",
    "Predictive routing weights recalibrated.",
    "Infrastructure load distributed across sectors.",
  ],
  "neural-map": [
    "Neural throughput balancing across relay ring.",
    "AI routing layer recalibrating pathway weights.",
    "Cortex uplink maintaining nominal packet integrity.",
  ],
  systems: [
    "Systems mesh integrity verified.",
    "Cross-sector diagnostics within tolerance.",
    "Distributed services operating at capacity.",
  ],
  terminal: [
    "Command channel secured — operator auth pending.",
    "Terminal uplink latency nominal.",
    "Infrastructure logs streaming in real time.",
  ],
  access: [
    "Gateway stabilization sequence initiated.",
    "Neural mesh convergence approaching completion.",
    "Final operator handshake ready.",
  ],
};

export const METRIC_DIAGNOSTICS: Record<string, string> = {
  traffic: "Flow vectors balanced · district grid stable",
  "ai-predict": "Prediction mesh active · confidence high",
  energy: "District energy routing optimized",
  "infra-load": "Load distributed · no sector saturation",
  transit: "Transit sync within SLA tolerance",
  atmo: "Atmospheric sensors calibrated",
  neural: "Neural throughput within optimal band",
  "mesh-latency": "Mesh latency nominal · routing stable",
};
