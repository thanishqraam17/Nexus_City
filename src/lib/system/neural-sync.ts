/** Shared neural rhythm — keeps orbit, signals, and pulses in sync */
export const NEURAL_SYNC_HZ = 0.35;

export function neuralPhase(t: number, offset = 0, scale = 1): number {
  return t * NEURAL_SYNC_HZ * scale + offset;
}

export function neuralPulse(t: number, offset = 0): number {
  return 0.5 + 0.5 * Math.sin(neuralPhase(t, offset, Math.PI * 2));
}
