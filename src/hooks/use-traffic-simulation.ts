"use client";

import { useEffect, useState } from "react";
import {
  createTrafficState,
  stepTrafficSimulation,
  type TrafficSimState,
} from "@/lib/system/traffic-simulation";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

const TICK_MS = 120;

export function useTrafficSimulation(): TrafficSimState {
  const reduceMotion = useHydratedReducedMotion();
  const [state, setState] = useState(createTrafficState);

  useEffect(() => {
    if (reduceMotion) return;

    const id = setInterval(() => {
      setState((prev) => stepTrafficSimulation(prev));
    }, TICK_MS);

    return () => clearInterval(id);
  }, [reduceMotion]);

  return state;
}
