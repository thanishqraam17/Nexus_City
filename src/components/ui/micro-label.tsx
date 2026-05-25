"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MicroLabelProps {
  children: React.ReactNode;
  className?: string;
  accent?: "lime" | "cyan" | "orange" | "muted";
  pulse?: boolean;
}

const accentMap = {
  lime: "text-nexus-lime",
  cyan: "text-nexus-cyan",
  orange: "text-nexus-orange",
  muted: "text-white/40",
};

export function MicroLabel({
  children,
  className,
  accent = "muted",
  pulse = false,
}: MicroLabelProps) {
  return (
    <motion.span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.28em] leading-none",
        accentMap[accent],
        className
      )}
      animate={pulse ? { opacity: [0.5, 1, 0.5] } : undefined}
      transition={pulse ? { duration: 2, repeat: Infinity } : undefined}
    >
      <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-current opacity-80" />
      {children}
    </motion.span>
  );
}
