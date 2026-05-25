"use client";

import { cn } from "@/lib/utils";

type GlowTone = "lime" | "cyan" | "orange";

interface GlowContainerProps {
  children: React.ReactNode;
  tone?: GlowTone;
  className?: string;
  interactive?: boolean;
}

export function GlowContainer({
  children,
  tone = "cyan",
  className,
  interactive = true,
}: GlowContainerProps) {
  return (
    <div
      className={cn(
        "os-glow-container",
        interactive && "os-glow-container--interactive",
        `os-glow-container--${tone}`,
        className
      )}
    >
      {children}
    </div>
  );
}
