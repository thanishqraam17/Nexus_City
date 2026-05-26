import { NEURAL_SECTORS, type NeuralSectorId } from "@/lib/system/city-data";
import {
  NEURAL_HUB_POSITION,
  NEURAL_RELAY_POSITIONS,
  NEURAL_SECTOR_POSITIONS,
} from "@/lib/system/neural-layout";

/** Canonical node indices — single source for topology */
export const NEURAL_INDEX_NODE = [
  "HUB",
  "R0",
  "R1",
  "R2",
  "R3",
  "R4",
  "ALPHA",
  "BETA",
  "GAMMA",
  "DELTA",
  "EPSILON",
] as const;

export type NeuralNodeIndex = number;

export const NEURAL_NODE_INDEX: Record<string, NeuralNodeIndex> = Object.fromEntries(
  NEURAL_INDEX_NODE.map((id, i) => [id, i])
) as Record<string, NeuralNodeIndex>;

export type NeuralEdgeTier = "spoke" | "ring" | "relay" | "core";

export interface NeuralGraphEdge {
  from: NeuralNodeIndex;
  to: NeuralNodeIndex;
  tier: NeuralEdgeTier;
}

export interface NeuralGraphNode {
  id: string;
  position: readonly [number, number, number];
}

/** Radial infrastructure topology — hub core, relay ring, sector ring */
export function buildNeuralGraph(): {
  nodes: NeuralGraphNode[];
  edges: NeuralGraphEdge[];
} {
  const nodes: NeuralGraphNode[] = [
    { id: "HUB", position: NEURAL_HUB_POSITION },
    ...NEURAL_RELAY_POSITIONS.map((p, i) => ({ id: `R${i}`, position: p })),
    ...NEURAL_SECTORS.map((sector) => ({
      id: sector.id,
      position: NEURAL_SECTOR_POSITIONS[sector.id],
    })),
  ];

  const edges: NeuralGraphEdge[] = [];
  const hub = NEURAL_NODE_INDEX.HUB;
  const sectorStart = 6;

  /* Outer district ring */
  for (let i = 0; i < 5; i++) {
    edges.push({
      from: sectorStart + i,
      to: sectorStart + ((i + 1) % 5),
      tier: "ring",
    });
  }

  /* Relay ring */
  for (let i = 0; i < 5; i++) {
    edges.push({
      from: 1 + i,
      to: 1 + ((i + 1) % 5),
      tier: "ring",
    });
  }

  /* District → hub spokes */
  for (let i = 0; i < 5; i++) {
    edges.push({ from: sectorStart + i, to: hub, tier: "spoke" });
  }

  /* Relay → hub spokes */
  for (let i = 0; i < 5; i++) {
    edges.push({ from: 1 + i, to: hub, tier: "spoke" });
  }

  /* Hub → relay core routes */
  for (let i = 0; i < 5; i++) {
    edges.push({ from: hub, to: 1 + i, tier: "core" });
  }

  /* Relay → district */
  for (let i = 0; i < 5; i++) {
    edges.push({ from: 1 + i, to: sectorStart + i, tier: "relay" });
  }

  return { nodes, edges };
}

export function nodeIdFromIndex(index: NeuralNodeIndex): string {
  return NEURAL_INDEX_NODE[index] ?? "HUB";
}

export function isSectorIndex(index: NeuralNodeIndex): index is 6 | 7 | 8 | 9 | 10 {
  return index >= 6 && index <= 10;
}

export function sectorIdFromIndex(index: NeuralNodeIndex): NeuralSectorId | null {
  const id = nodeIdFromIndex(index);
  return id in NEURAL_SECTOR_POSITIONS ? (id as NeuralSectorId) : null;
}

export function edgeTouchesIndex(edge: NeuralGraphEdge, index: NeuralNodeIndex): boolean {
  return edge.from === index || edge.to === index;
}

export function edgeTouchesNodeId(edge: NeuralGraphEdge, nodeId: string): boolean {
  const idx = NEURAL_NODE_INDEX[nodeId];
  return idx !== undefined && edgeTouchesIndex(edge, idx);
}
