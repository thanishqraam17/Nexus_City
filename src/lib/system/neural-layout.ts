import type { NeuralSectorId } from "@/lib/system/city-data";

/** Engineered pentagon layout — collision-safe, even radial spacing */
const SECTOR_RADIUS = 3.55;
const RELAY_RADIUS = 2.15;
const HUB_Y = 0;

const SECTOR_RING_ORDER: NeuralSectorId[] = [
  "ALPHA",
  "BETA",
  "GAMMA",
  "DELTA",
  "EPSILON",
];

/** Subtle Y separation for depth readability (no overlap on XZ) */
const SECTOR_Y: Record<NeuralSectorId, number> = {
  ALPHA: 0.14,
  BETA: 0.06,
  GAMMA: 0.18,
  DELTA: -0.12,
  EPSILON: -0.06,
};

function ringAngle(index: number, offset = 0): number {
  return (index / 5) * Math.PI * 2 - Math.PI / 2 + offset;
}

function toPosition(radius: number, angle: number, y: number): readonly [number, number, number] {
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
}

function buildSectorPositions(): Record<NeuralSectorId, readonly [number, number, number]> {
  const out = {} as Record<NeuralSectorId, readonly [number, number, number]>;
  SECTOR_RING_ORDER.forEach((id, i) => {
    out[id] = toPosition(SECTOR_RADIUS, ringAngle(i), SECTOR_Y[id]);
  });
  return out;
}

function buildRelayPositions(): readonly (readonly [number, number, number])[] {
  return SECTOR_RING_ORDER.map((_, i) =>
    toPosition(RELAY_RADIUS, ringAngle(i, Math.PI / 5), 0)
  );
}

export const NEURAL_SECTOR_POSITIONS = buildSectorPositions();
export const NEURAL_HUB_POSITION: readonly [number, number, number] = [0, HUB_Y, 0];
export const NEURAL_RELAY_POSITIONS = buildRelayPositions();

export const NEURAL_ORBIT_RADII = {
  outer: SECTOR_RADIUS,
  inner: RELAY_RADIUS,
  hub: 0.35,
} as const;

export type NeuralConnectionTier = "spoke" | "ring" | "relay" | "core";

export interface NeuralConnection {
  from: string;
  to: string;
  /** Traffic flows from → to */
  directed?: boolean;
  tier: NeuralConnectionTier;
}

export function buildNeuralConnections(): NeuralConnection[] {
  const pairs: NeuralConnection[] = [];

  /* Outer ring — district backbone */
  for (let i = 0; i < SECTOR_RING_ORDER.length; i++) {
    pairs.push({
      from: SECTOR_RING_ORDER[i],
      to: SECTOR_RING_ORDER[(i + 1) % 5],
      directed: true,
      tier: "ring",
    });
  }

  /* Sector uplinks → central nexus */
  SECTOR_RING_ORDER.forEach((id) => {
    pairs.push({ from: id, to: "HUB", directed: true, tier: "spoke" });
  });

  /* Relay ring — mid infrastructure mesh */
  for (let i = 0; i < SECTOR_RING_ORDER.length; i++) {
    pairs.push({
      from: `R${i}`,
      to: `R${(i + 1) % 5}`,
      directed: true,
      tier: "ring",
    });
  }

  /* Relay uplinks → nexus */
  SECTOR_RING_ORDER.forEach((_, i) => {
    pairs.push({ from: `R${i}`, to: "HUB", directed: true, tier: "spoke" });
  });

  /* Nexus downlink pulses → relays (core routing) */
  SECTOR_RING_ORDER.forEach((_, i) => {
    pairs.push({ from: "HUB", to: `R${i}`, directed: true, tier: "core" });
  });

  /* Relay ↔ district links */
  SECTOR_RING_ORDER.forEach((id, i) => {
    pairs.push({ from: `R${i}`, to: id, directed: true, tier: "relay" });
    pairs.push({ from: id, to: `R${i}`, directed: true, tier: "relay" });
  });

  return pairs;
}

export function getNeuralNodePosition(
  id: string
): readonly [number, number, number] | null {
  if (id === "HUB") return NEURAL_HUB_POSITION;
  if (id in NEURAL_SECTOR_POSITIONS) {
    return NEURAL_SECTOR_POSITIONS[id as NeuralSectorId];
  }
  const relayIdx = id.startsWith("R") ? parseInt(id.slice(1), 10) : -1;
  if (relayIdx >= 0 && relayIdx < NEURAL_RELAY_POSITIONS.length) {
    return NEURAL_RELAY_POSITIONS[relayIdx];
  }
  return null;
}

export function getRelatedNodeIds(focusId: string | null): Set<string> {
  if (!focusId) return new Set();
  const related = new Set<string>([focusId, "HUB"]);
  buildNeuralConnections().forEach(({ from, to }) => {
    if (from === focusId || to === focusId) {
      related.add(from);
      related.add(to);
    }
  });
  return related;
}

export function isConnectionHighlighted(
  conn: NeuralConnection,
  focusId: string | null
): boolean {
  if (!focusId) return false;
  return conn.from === focusId || conn.to === focusId;
}

export function connectionKey(conn: NeuralConnection) {
  return `${conn.from}-${conn.to}`;
}
