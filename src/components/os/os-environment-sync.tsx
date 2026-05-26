"use client";

import { useEffect } from "react";
import { useOsRuntimeStore } from "@/store/os-runtime-store";

/** Pushes runtime state to CSS variables / data attributes for environmental life */
export function OsEnvironmentSync() {
  const atmosphere = useOsRuntimeStore((s) => s.atmosphere);
  const neuralState = useOsRuntimeStore((s) => s.neuralState);
  const infrastructureLoad = useOsRuntimeStore((s) => s.infrastructureLoad);
  const syncPercent = useOsRuntimeStore((s) => s.syncPercent);
  const tick = useOsRuntimeStore((s) => s.tick);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.osAtmosphere = atmosphere.toLowerCase();
    root.dataset.osNeural = neuralState.toLowerCase();
    root.style.setProperty("--os-load", String(infrastructureLoad));
    root.style.setProperty("--os-sync", syncPercent.toFixed(2));
    root.style.setProperty("--os-tick", String(tick));
  }, [atmosphere, neuralState, infrastructureLoad, syncPercent, tick]);

  return null;
}
