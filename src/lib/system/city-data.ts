/** Engineered city OS metrics — deterministic, believable ranges. */

export type MetricFormat = "percent" | "latency" | "throughput" | "index" | "count";

export interface CityMetricDef {
  id: string;
  label: string;
  base: number;
  variance: number;
  seed: number;
  unit?: string;
  format: MetricFormat;
  sparkSeed: number;
  trend: "up" | "down" | "stable";
  digitsClass: string;
}

export const CITY_INTELLIGENCE_METRICS: CityMetricDef[] = [
  {
    id: "traffic",
    label: "Traffic Flow",
    base: 94.2,
    variance: 1.8,
    seed: 20,
    unit: "%",
    format: "percent",
    sparkSeed: 20,
    trend: "up",
    digitsClass: "telemetry-metric-digits--percent",
  },
  {
    id: "ai-predict",
    label: "AI Prediction Load",
    base: 78.6,
    variance: 2.2,
    seed: 21,
    unit: "%",
    format: "percent",
    sparkSeed: 21,
    trend: "stable",
    digitsClass: "telemetry-metric-digits--percent",
  },
  {
    id: "energy",
    label: "District Energy",
    base: 86.4,
    variance: 1.5,
    seed: 22,
    unit: "%",
    format: "percent",
    sparkSeed: 22,
    trend: "up",
    digitsClass: "telemetry-metric-digits--percent",
  },
  {
    id: "infra-load",
    label: "Infrastructure Load",
    base: 71.3,
    variance: 2.8,
    seed: 23,
    unit: "%",
    format: "percent",
    sparkSeed: 23,
    trend: "stable",
    digitsClass: "telemetry-metric-digits--percent",
  },
  {
    id: "transit",
    label: "Transit Sync",
    base: 99.1,
    variance: 0.08,
    seed: 24,
    unit: "%",
    format: "percent",
    sparkSeed: 24,
    trend: "up",
    digitsClass: "telemetry-metric-digits--uptime",
  },
  {
    id: "atmo",
    label: "Atmospheric Index",
    base: 92.8,
    variance: 1.2,
    seed: 25,
    unit: "aqi",
    format: "percent",
    sparkSeed: 25,
    trend: "stable",
    digitsClass: "telemetry-metric-digits--percent",
  },
  {
    id: "neural",
    label: "Neural Activity",
    base: 88.5,
    variance: 2,
    seed: 26,
    unit: "%",
    format: "percent",
    sparkSeed: 26,
    trend: "up",
    digitsClass: "telemetry-metric-digits--percent",
  },
  {
    id: "mesh-latency",
    label: "Mesh Latency",
    base: 11.2,
    variance: 0.8,
    seed: 27,
    unit: "ms",
    format: "latency",
    sparkSeed: 27,
    trend: "down",
    digitsClass: "telemetry-metric-digits--latency",
  },
];

export const TRAFFIC_CORRIDORS = [
  { id: "N-01", load: 0.82, label: "North Corridor" },
  { id: "E-04", load: 0.67, label: "East Transit" },
  { id: "C-12", load: 0.91, label: "Central Axis" },
  { id: "S-07", load: 0.54, label: "South Grid" },
  { id: "W-03", load: 0.73, label: "West Link" },
] as const;

export const NEURAL_SECTORS = [
  { id: "ALPHA", label: "Alpha District", x: 0.2, y: 0.35 },
  { id: "BETA", label: "Beta Hub", x: 0.55, y: 0.22 },
  { id: "GAMMA", label: "Gamma Ring", x: 0.78, y: 0.48 },
  { id: "DELTA", label: "Delta Core", x: 0.42, y: 0.62 },
  { id: "EPSILON", label: "Epsilon Edge", x: 0.15, y: 0.68 },
] as const;

export type NeuralSectorId = (typeof NEURAL_SECTORS)[number]["id"];
