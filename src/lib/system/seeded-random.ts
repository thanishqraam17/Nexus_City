/**
 * Deterministic PRNG — integer-safe, identical on Node SSR and browsers.
 * Uses xorshift32 only (no Math.sin, no platform-dependent transcendentals).
 */

/** Returns a uint32 on each call. */
export function xorshift32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return state >>> 0;
  };
}

/** Unit interval [0, 1) from 24-bit mantissa — stable across runtimes. */
export function seededUnit(seed: number, index: number): number {
  const next = xorshift32(seed + index * 0x9e3779b9);
  return (next() & 0xffffff) / 0x1000000;
}

/** Integer in [0, max) */
export function seededInt(seed: number, index: number, max: number): number {
  if (max <= 0) return 0;
  const next = xorshift32(seed + index * 0x9e3779b9);
  return next() % max;
}

/** Format fixed-point tenths (integer) as SVG coordinate string — no float formatting. */
export function formatTenths(tenths: number): string {
  const t = tenths | 0;
  const whole = Math.floor(t / 10);
  const frac = t % 10;
  return frac === 0 ? String(whole) : `${whole}.${frac}`;
}

const VIEW_WIDTH_TENTHS = 800;
const Y_BASE_TENTHS = 80;
const Y_RANGE_TENTHS = 60;
const DEFAULT_POINTS = 24;

/**
 * Build SVG path `d` from seed using integer-only arithmetic.
 * Safe to call at module init if seed is in allowlist; prefer SPARKLINE_PATHS cache.
 */
export function buildSparklinePath(
  seed: number,
  points = DEFAULT_POINTS
): string {
  const next = xorshift32(seed | 0);
  const denom = points - 1;
  const coords: number[] = [];

  for (let i = 0; i < points; i++) {
    const xTenths = Math.floor((i * VIEW_WIDTH_TENTHS) / denom);
    const yTenths = Y_BASE_TENTHS + (next() % Y_RANGE_TENTHS);
    coords.push(xTenths, yTenths);
  }

  let d = `M ${formatTenths(coords[0])} ${formatTenths(coords[1])}`;
  for (let i = 2; i < coords.length; i += 2) {
    d += ` L ${formatTenths(coords[i])} ${formatTenths(coords[i + 1])}`;
  }
  return d;
}
