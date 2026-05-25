"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { panelReveal } from "@/lib/motion/variants";
import { springHoverReact, springInertia } from "@/lib/motion/transitions";

type GlassVariant = "default" | "hud" | "telemetry" | "command";
type GlassGlow = "none" | "lime" | "cyan" | "orange";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  glow?: GlassGlow;
  cornerMarks?: boolean;
  revealOnView?: boolean;
  interactive?: boolean;
  coreGlow?: boolean;
}

const accentBorder: Record<GlassGlow, string> = {
  none: "border-white/[0.1]",
  lime: "border-nexus-lime/[0.14]",
  cyan: "border-nexus-cyan/[0.14]",
  orange: "border-nexus-orange/[0.12]",
};

const accentGlow: Record<GlassGlow, string> = {
  none: "shadow-[var(--nx-glow-lime-soft)]",
  lime: "shadow-[0_0_48px_rgba(212,255,0,0.06),inset_0_1px_0_rgba(212,255,0,0.1)]",
  cyan: "shadow-[0_0_48px_rgba(0,240,255,0.07),inset_0_1px_0_rgba(0,240,255,0.08)]",
  orange: "shadow-[0_0_40px_rgba(255,107,53,0.06),inset_0_1px_0_rgba(255,107,53,0.06)]",
};

export function GlassPanel({
  children,
  className,
  variant = "default",
  glow = "none",
  cornerMarks = false,
  revealOnView = true,
  interactive = true,
  coreGlow = false,
  ...props
}: GlassPanelProps) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const shouldReveal = revealOnView && mounted;
  const motionReady = mounted && !reduceMotion && interactive;
  const resolvedGlow =
    glow !== "none"
      ? glow
      : variant === "telemetry" || variant === "hud"
        ? "lime"
        : variant === "command"
          ? "lime"
          : "none";

  return (
    <motion.div
      variants={shouldReveal ? panelReveal : undefined}
      initial={false}
      whileInView={shouldReveal ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={
        motionReady && interactive
          ? { y: -2, scale: 1.006, transition: springHoverReact }
          : undefined
      }
      transition={springInertia}
      className={cn(
        "nexus-panel-base group/panel",
        accentBorder[resolvedGlow],
        accentGlow[resolvedGlow],
        variant === "command" &&
          "bg-gradient-to-br from-white/[0.05] to-transparent",
        coreGlow && "hero-panel-core-light",
        className
      )}
      {...props}
    >
      {motionReady && (
        <div className="panel-holo-shimmer pointer-events-none absolute inset-0 z-0 opacity-80" />
      )}
      {cornerMarks && (
        <>
          <span
            className={cn(
              "absolute left-0 top-0 z-10 h-3 w-3 border-l border-t transition-colors duration-500",
              resolvedGlow === "cyan"
                ? "border-nexus-cyan/40 group-hover/panel:border-nexus-cyan/70"
                : "border-nexus-lime/40 group-hover/panel:border-nexus-lime/70"
            )}
          />
          <span
            className={cn(
              "absolute right-0 top-0 z-10 h-3 w-3 border-r border-t transition-colors duration-500",
              resolvedGlow === "cyan"
                ? "border-nexus-cyan/40 group-hover/panel:border-nexus-cyan/70"
                : "border-nexus-lime/40 group-hover/panel:border-nexus-lime/70"
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l transition-colors duration-500",
              resolvedGlow === "cyan"
                ? "border-nexus-cyan/40 group-hover/panel:border-nexus-cyan/70"
                : "border-nexus-lime/40 group-hover/panel:border-nexus-lime/70"
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r transition-colors duration-500",
              resolvedGlow === "cyan"
                ? "border-nexus-cyan/40 group-hover/panel:border-nexus-cyan/70"
                : "border-nexus-lime/40 group-hover/panel:border-nexus-lime/70"
            )}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.45)_2px,rgba(255,255,255,0.45)_3px)]" />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
