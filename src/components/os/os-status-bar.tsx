"use client";

import { memo } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { useOsRuntimeStore } from "@/store/os-runtime-store";

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "lime" | "cyan";
}) {
  return (
    <div className="os-status-bar__cell">
      <span className="os-status-bar__label">{label}</span>
      <span
        className={
          accent === "lime"
            ? "os-status-bar__value text-nexus-lime/90"
            : accent === "cyan"
              ? "os-status-bar__value text-nexus-cyan/85"
              : "os-status-bar__value"
        }
      >
        {value}
      </span>
    </div>
  );
}

function OsStatusBarInner() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const syncPercent = useOsRuntimeStore((s) => s.syncPercent);
  const neuralState = useOsRuntimeStore((s) => s.neuralState);
  const atmosphere = useOsRuntimeStore((s) => s.atmosphere);
  const infrastructureLoad = useOsRuntimeStore((s) => s.infrastructureLoad);
  const uplink = useOsRuntimeStore((s) => s.uplink);
  const activeRelays = useOsRuntimeStore((s) => s.activeRelays);
  const tick = useOsRuntimeStore((s) => s.tick);

  if (!mounted) return null;

  return (
    <div
      className="os-status-bar"
      role="status"
      aria-live="polite"
      aria-label="System status"
    >
      <div className="os-status-bar__scan" aria-hidden />
      <div className="os-status-bar__inner">
        <span className="os-status-bar__brand">NEXUS OS</span>
        <div className="os-status-bar__metrics">
          <MetricCell
            label="Sync"
            value={`${syncPercent.toFixed(2)}%`}
            accent="lime"
          />
          <MetricCell label="Neural" value={neuralState} accent="cyan" />
          <MetricCell label="Atmosphere" value={atmosphere} />
          <MetricCell label="Load" value={`${infrastructureLoad}%`} />
          <MetricCell label="Uplink" value={uplink} accent="lime" />
          <MetricCell label="Relays" value={`${activeRelays} active`} accent="cyan" />
        </div>
        <span
          className={`os-status-bar__pulse ${reduceMotion ? "" : "is-live"}`}
          aria-hidden
          data-tick={tick}
        />
      </div>
    </div>
  );
}

export const OsStatusBar = memo(OsStatusBarInner);
