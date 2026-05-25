import { useEffect, useState } from "react";
import { seededUnit } from "@/lib/system/seeded-random";

/** Client-only live value — stable SSR initial `base`. */
export function useSeededLiveValue(
  base: number,
  variance: number,
  seed: number,
  enabled: boolean,
  intervalMs = 1400
): number {
  const [val, setVal] = useState(base);

  useEffect(() => {
    if (!enabled) {
      setVal(base);
      return;
    }
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      setVal(base + (seededUnit(seed, tick) - 0.5) * variance);
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, variance, seed, enabled, intervalMs]);

  return enabled ? val : base;
}
