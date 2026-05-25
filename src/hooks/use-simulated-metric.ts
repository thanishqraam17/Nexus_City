"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useSeededLiveValue } from "@/lib/telemetry/seeded-value";
import { useUIStore } from "@/store/ui-store";

/** Live simulated metric — stable until mounted, then seeded updates. */
export function useSimulatedMetric(
  base: number,
  variance: number,
  seed: number,
  enabled = true
): number {
  const mounted = useMounted();
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const live = mounted && telemetryLive && enabled;
  return useSeededLiveValue(base, variance, seed, live, 1600);
}
