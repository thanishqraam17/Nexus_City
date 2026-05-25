import type { NeuralSectorId } from "@/lib/system/city-data";

/** Curated 3D positions — wide spacing, readable composition */
export const NEURAL_SECTOR_POSITIONS: Record<
  NeuralSectorId,
  readonly [number, number, number]
> = {
  ALPHA: [-2.6, 0.45, 1.1],
  BETA: [0.15, 1.35, 2.4],
  GAMMA: [2.7, 0.25, 0.6],
  DELTA: [1.0, -0.85, -2.3],
  EPSILON: [-2.2, -0.55, -1.4],
};

export const NEURAL_HUB_POSITION: readonly [number, number, number] = [0, 0, 0];

/** Relay nodes — sparse accents, not clustered */
export const NEURAL_RELAY_POSITIONS: readonly (readonly [number, number, number])[] =
  [
    [-1.2, 0.9, 1.6],
    [1.4, 0.6, 1.2],
    [-1.5, -0.2, -0.8],
    [0.6, -0.4, 1.8],
  ];

/** Sector ring + hub spokes only */
export function buildNeuralConnections(): Array<[string, string]> {
  const sectors = Object.keys(NEURAL_SECTOR_POSITIONS) as NeuralSectorId[];
  const pairs: Array<[string, string]> = [];

  sectors.forEach((id) => {
    pairs.push([id, "HUB"]);
  });

  const ring: NeuralSectorId[] = ["ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON"];
  for (let i = 0; i < ring.length; i++) {
    pairs.push([ring[i], ring[(i + 1) % ring.length]]);
  }

  NEURAL_RELAY_POSITIONS.forEach((_, i) => {
    pairs.push([`R${i}`, ring[i % ring.length]]);
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
