"use client";

import { cn } from "@/lib/utils";

type BridgeTone = "lime" | "cyan" | "void";

interface SectionBridgeProps {
  from?: BridgeTone;
  to?: BridgeTone;
  className?: string;
  label?: string;
}

/** Cinematic gradient bridge between OS sections. */
export function SectionBridge({
  from = "void",
  to = "cyan",
  className,
  label,
}: SectionBridgeProps) {
  return (
    <div
      className={cn(
        "os-section-bridge pointer-events-none relative z-[9] h-28 sm:h-36",
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          "os-section-bridge-gradient",
          `os-section-bridge--${from}-${to}`
        )}
      />
      <div className="os-section-bridge-scan" />
      <div className="os-section-bridge-depth" />
      {label && (
        <span className="os-section-bridge-label font-mono text-[8px] uppercase tracking-[0.35em] text-white/20">
          {label}
        </span>
      )}
    </div>
  );
}
