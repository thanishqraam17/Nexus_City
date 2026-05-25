import { useEffect, useState } from "react";

export function seededUnit(seed: number, tick: number): number {
  const s = Math.sin(seed * 127.1 + tick * 43.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Client-only live value — stable SSR initial `base`. */
export function useSeededLiveValue(
  base: number,
  variance: number,
  seed: number,
  enabled: boolean,
  intervalMs = 1400
): number {
  const [val, setVal] = useState(base);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setVal(base);
      return;
    }
    const id = setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        setVal(base + (seededUnit(seed, next) - 0.5) * variance);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, variance, seed, enabled, intervalMs]);

  return enabled ? val : base;
}
