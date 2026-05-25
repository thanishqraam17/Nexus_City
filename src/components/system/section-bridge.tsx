"use client";

import { cn } from "@/lib/utils";

type BridgeTone = "lime" | "cyan" | "void";

interface SectionBridgeProps {
  from?: BridgeTone;
  to?: BridgeTone;
  className?: string;
}

/** Cinematic gradient bridge between OS sections. */
export function SectionBridge({
  from = "void",
  to = "cyan",
  className,
}: SectionBridgeProps) {
  return (
    <div
      className={cn("os-section-bridge pointer-events-none relative z-[9] h-24 sm:h-32", className)}
      aria-hidden
    >
      <div className={cn("os-section-bridge-gradient", `os-section-bridge--${from}-${to}`)} />
    </div>
  );
}
