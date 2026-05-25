"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { panelReveal } from "@/lib/motion/variants";

type GlassVariant = "default" | "hud" | "telemetry" | "command";
type GlassGlow = "none" | "lime" | "cyan" | "orange";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  glow?: GlassGlow;
  cornerMarks?: boolean;
  revealOnView?: boolean;
}

const variantStyles: Record<GlassVariant, string> = {
  default:
    "bg-white/[0.03] border-white/[0.08] backdrop-blur-xl",
  hud: "bg-black/40 border-nexus-cyan/20 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(0,240,255,0.15)]",
  telemetry:
    "bg-black/50 border-nexus-lime/15 backdrop-blur-xl shadow-[0_0_40px_rgba(212,255,0,0.06)]",
  command:
    "bg-gradient-to-br from-white/[0.06] to-transparent border-white/10 backdrop-blur-2xl",
};

const glowStyles: Record<GlassGlow, string> = {
  none: "",
  lime: "shadow-[0_0_60px_rgba(212,255,0,0.08),inset_0_0_30px_rgba(212,255,0,0.03)]",
  cyan: "shadow-[0_0_60px_rgba(0,240,255,0.1),inset_0_0_30px_rgba(0,240,255,0.04)]",
  orange: "shadow-[0_0_50px_rgba(255,107,53,0.08)]",
};

export function GlassPanel({
  children,
  className,
  variant = "default",
  glow = "none",
  cornerMarks = false,
  revealOnView = true,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      variants={revealOnView ? panelReveal : undefined}
      initial={revealOnView ? "hidden" : undefined}
      whileInView={revealOnView ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-sm border",
        variantStyles[variant],
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {cornerMarks && (
        <>
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-nexus-lime/50" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-nexus-lime/50" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-nexus-lime/50" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-nexus-lime/50" />
        </>
      )}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
        }}
      />
      {children}
    </motion.div>
  );
}
