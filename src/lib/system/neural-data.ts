import type { NeuralSectorId } from "@/lib/system/city-data";

export interface NeuralSectorMeta {
  id: NeuralSectorId;
  label: string;
  systemName: string;
  role: string;
  description: string;
  districtId: string;
  metrics: {
    load: number;
    latencyMs: number;
    throughput: string;
    status: "SYNC" | "CALIBRATING" | "STANDBY";
  };
}

export const NEURAL_HUB_META = {
  id: "HUB" as const,
  systemName: "Infrastructure Cortex",
  role: "Central neural routing & mesh arbitration",
  description:
    "Primary arbitration layer synchronizing district uplinks, transit intelligence, and energy distribution across the metropolitan AI grid.",
  districtId: "NX-CORE-00",
  metrics: {
    load: 72,
    latencyMs: 8.4,
    throughput: "12.4M ops/hr",
    status: "SYNC" as const,
  },
};

export const NEURAL_SECTOR_META: Record<NeuralSectorId, NeuralSectorMeta> = {
  ALPHA: {
    id: "ALPHA",
    label: "Alpha District",
    systemName: "Transit Intelligence",
    role: "Autonomous corridor orchestration",
    description:
      "Predictive transit mesh governing 2,400 corridors with sub-second flow rebalancing and idle-corridor elimination.",
    districtId: "NX-TR-01",
    metrics: { load: 91, latencyMs: 11.8, throughput: "2.4K corridors", status: "SYNC" },
  },
  BETA: {
    id: "BETA",
    label: "Beta Hub",
    systemName: "Atmospheric Grid",
    role: "Environmental sensing & climate response",
    description:
      "City-wide atmospheric index, particulate modeling, and adaptive ventilation across sealed district envelopes.",
    districtId: "NX-ATM-04",
    metrics: { load: 78, latencyMs: 14.2, throughput: "847 nodes", status: "SYNC" },
  },
  GAMMA: {
    id: "GAMMA",
    label: "Gamma Ring",
    systemName: "Neural Relay",
    role: "Inter-district signal amplification",
    description:
      "High-bandwidth relay ring propagating inference packets between peripheral districts and the infrastructure cortex.",
    districtId: "NX-RLY-12",
    metrics: { load: 84, latencyMs: 9.6, throughput: "1.2M pkt/s", status: "SYNC" },
  },
  DELTA: {
    id: "DELTA",
    label: "Delta Core",
    systemName: "Energy Nexus",
    role: "District energy mesh & load balancing",
    description:
      "Synchronized redistribution cycles forecasting demand spikes and rebalancing micro-grids in real time.",
    districtId: "NX-ENR-07",
    metrics: { load: 88, latencyMs: 10.1, throughput: "89 hubs", status: "CALIBRATING" },
  },
  EPSILON: {
    id: "EPSILON",
    label: "Epsilon Edge",
    systemName: "Perimeter Shield",
    role: "Edge security & resilience mesh",
    description:
      "Perimeter inference layer monitoring ingress traffic, anomaly vectors, and autonomous failover corridors.",
    districtId: "NX-EDG-03",
    metrics: { load: 65, latencyMs: 16.4, throughput: "412 gates", status: "SYNC" },
  },
};

export const NEURAL_RELAY_META = [
  { id: "R0", name: "Relay Node A", systemName: "Signal Buffer" },
  { id: "R1", name: "Relay Node B", systemName: "Packet Bridge" },
  { id: "R2", name: "Relay Node C", systemName: "Sync Beacon" },
  { id: "R3", name: "Relay Node D", systemName: "Uplink Tap" },
  { id: "R4", name: "Relay Node E", systemName: "Mesh Gateway" },
] as const;
