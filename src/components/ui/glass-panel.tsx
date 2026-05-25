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
  /** Picks up environmental light from the hero neural core */
  coreGlow?: boolean;
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

const breatheClass: Record<GlassGlow, string> = {
  none: "",
  lime: "panel-breathe-lime",
  cyan: "panel-breathe-cyan",
  orange: "panel-breathe-orange",
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

  return (
    <motion.div
      variants={shouldReveal ? panelReveal : undefined}
      initial={false}
      whileInView={shouldReveal ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={
        motionReady
          ? {
              y: -3,
              scale: 1.008,
              transition: springHoverReact,
            }
          : undefined
      }
      transition={springInertia}
      className={cn(
        "group/panel relative overflow-hidden rounded-sm border",
        variantStyles[variant],
        glowStyles[glow],
        glow !== "none" && breatheClass[glow],
        coreGlow && "hero-panel-core-light",
        className
      )}
      {...props}
    >
      {motionReady && (
        <>
          <div className="panel-holo-shimmer pointer-events-none absolute inset-0 z-0" />
          <div className="atmo-holo-flicker pointer-events-none absolute inset-0 z-0 opacity-[0.02]" />
        </>
      )}
      {cornerMarks && (
        <>
          <span className="absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-nexus-lime/50 transition-colors duration-500 group-hover/panel:border-nexus-lime" />
          <span className="absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-nexus-lime/50 transition-colors duration-500 group-hover/panel:border-nexus-lime" />
          <span className="absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-nexus-lime/50 transition-colors duration-500 group-hover/panel:border-nexus-lime" />
          <span className="absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-nexus-lime/50 transition-colors duration-500 group-hover/panel:border-nexus-lime" />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_2px,rgba(255,255,255,0.5)_3px)]" />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
