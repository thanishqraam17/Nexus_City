/** Frozen sparkline paths — identical on server and client. */

function buildPath(seed: number, points = 24): string {
  const coords: number[] = [];
  for (let i = 0; i < points; i++) {
    const s = Math.sin(seed * 127.1 + i * 43.7) * 43758.5453;
    const r = s - Math.floor(s);
    const x = (i / (points - 1)) * 80;
    const y = 8 + r * 6;
    coords.push(x, y);
  }
  let d = `M ${coords[0]} ${coords[1]}`;
  for (let i = 2; i < coords.length; i += 2) {
    d += ` L ${coords[i]} ${coords[i + 1]}`;
  }
  return d;
}

export const SPARKLINE_PATHS = {
  1: buildPath(1),
  2: buildPath(2),
  3: buildPath(3),
  5: buildPath(5),
  7: buildPath(7),
  11: buildPath(11),
  12: buildPath(12),
  13: buildPath(13),
  14: buildPath(14),
  20: buildPath(20),
  21: buildPath(21),
  22: buildPath(22),
  23: buildPath(23),
  24: buildPath(24),
  25: buildPath(25),
  26: buildPath(26),
  27: buildPath(27),
} as const;

export type SparklineSeed = keyof typeof SPARKLINE_PATHS;

export function getSparklinePath(seed: number): string {
  const key = (seed in SPARKLINE_PATHS ? seed : 1) as SparklineSeed;
  return SPARKLINE_PATHS[key];
}
