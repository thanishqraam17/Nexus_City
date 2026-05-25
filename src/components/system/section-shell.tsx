"use client";

import { cn } from "@/lib/utils";

type SectionTone = "lime" | "cyan" | "neutral";
export type SectionAtmosphere =
  | "default"
  | "intelligence"
  | "neural"
  | "systems"
  | "terminal"
  | "access";

interface SectionShellProps {
  id?: string;
  tone?: SectionTone;
  atmosphere?: SectionAtmosphere;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  borderTop?: boolean;
}

export function SectionShell({
  id,
  tone = "neutral",
  atmosphere = "default",
  children,
  className,
  innerClassName,
  borderTop = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      data-section={id}
      data-atmosphere={atmosphere}
      className={cn(
        "os-section relative z-10 overflow-hidden py-24 sm:py-32 lg:py-36",
        borderTop && "border-t border-white/[0.06]",
        `os-section--${atmosphere}`,
        className
      )}
    >
      <div
        className={cn(
          "os-section-glow pointer-events-none absolute inset-0",
          `os-section-glow--${tone}`
        )}
        aria-hidden
      />
      <div className="os-section-atmosphere pointer-events-none absolute inset-0" aria-hidden />
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
