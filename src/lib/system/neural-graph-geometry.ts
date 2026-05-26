import * as THREE from "three";
import type { NeuralSectorId } from "@/lib/system/city-data";
import {
  NEURAL_HUB_POSITION,
  NEURAL_RELAY_POSITIONS,
  NEURAL_SECTOR_POSITIONS,
  type NeuralConnection,
} from "@/lib/system/neural-layout";

const _dir = new THREE.Vector3();

/** Visual radii — lines terminate at sphere surface along the connection axis */
export const NEURAL_NODE_RADIUS: Record<string, number> = {
  HUB: 0.11,
  ALPHA: 0.14,
  BETA: 0.14,
  GAMMA: 0.14,
  DELTA: 0.14,
  EPSILON: 0.14,
  R0: 0.05,
  R1: 0.05,
  R2: 0.05,
  R3: 0.05,
  R4: 0.05,
};

export function getNodeCenter(id: string): THREE.Vector3 | null {
  if (id === "HUB") {
    return new THREE.Vector3(...NEURAL_HUB_POSITION);
  }
  if (id in NEURAL_SECTOR_POSITIONS) {
    const p = NEURAL_SECTOR_POSITIONS[id as NeuralSectorId];
    return new THREE.Vector3(p[0], p[1], p[2]);
  }
  const relayIdx = id.startsWith("R") ? parseInt(id.slice(1), 10) : -1;
  if (relayIdx >= 0 && relayIdx < NEURAL_RELAY_POSITIONS.length) {
    const p = NEURAL_RELAY_POSITIONS[relayIdx];
    return new THREE.Vector3(p[0], p[1], p[2]);
  }
  return null;
}

export function getNodeRadius(id: string): number {
  return NEURAL_NODE_RADIUS[id] ?? 0.08;
}

export interface ConnectionSegment {
  conn: NeuralConnection;
  /** Line draw endpoints (surface-anchored, gap-free) */
  start: THREE.Vector3;
  end: THREE.Vector3;
  /** Packet path uses exact node centers */
  centerA: THREE.Vector3;
  centerB: THREE.Vector3;
  direction: THREE.Vector3;
  pathLength: number;
  lineLength: number;
}

/** Build precise segment — lines surface-anchored, packets use center path */
export function buildConnectionSegment(conn: NeuralConnection): ConnectionSegment | null {
  const centerA = getNodeCenter(conn.from);
  const centerB = getNodeCenter(conn.to);
  if (!centerA || !centerB) return null;

  _dir.subVectors(centerB, centerA);
  const fullDist = _dir.length();
  if (fullDist < 1e-6) return null;

  const direction = _dir.clone().normalize();

  /* Center-anchored — infrastructure reads as one connected system */
  const start = centerA.clone();
  const end = centerB.clone();
  const lineLength = Math.max(start.distanceTo(end), 0.001);

  return {
    conn,
    start,
    end,
    centerA,
    centerB,
    direction,
    pathLength: fullDist,
    lineLength,
  };
}

/** Packet position along the same path as the visible line (0–1) */
export function packetPositionOnSegment(
  seg: ConnectionSegment,
  t: number,
  target: THREE.Vector3
): THREE.Vector3 {
  return target.copy(seg.start).lerp(seg.end, t);
}

/** Update line buffer attribute from segment endpoints */
export function writeLinePositions(
  positions: Float32Array,
  index: number,
  seg: ConnectionSegment
): void {
  const i = index * 6;
  positions[i] = seg.start.x;
  positions[i + 1] = seg.start.y;
  positions[i + 2] = seg.start.z;
  positions[i + 3] = seg.end.x;
  positions[i + 4] = seg.end.y;
  positions[i + 5] = seg.end.z;
}
