"use client";

import { useHydratedReducedMotion } from "./use-hydrated-reduced-motion";
import { useMounted } from "./use-mounted";

export function useAtmosphereReady(): boolean {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  return mounted && !reduceMotion;
}
