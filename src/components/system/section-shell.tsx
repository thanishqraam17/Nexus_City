"use client";

import { cn } from "@/lib/utils";

type SectionTone = "lime" | "cyan" | "neutral";

interface SectionShellProps {
  id?: string;
  tone?: SectionTone;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  borderTop?: boolean;
}

export function SectionShell({
  id,
  tone = "neutral",
  children,
  className,
  innerClassName,
  borderTop = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "os-section relative z-10 overflow-hidden py-24 sm:py-32 lg:py-36",
        borderTop && "border-t border-white/[0.06]",
        className
      )}
    >
      <div
        className={cn("os-section-glow pointer-events-none absolute inset-0", `os-section-glow--${tone}`)}
        aria-hidden
      />
      <div
        className={cn(
          "os-section-inner relative mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
