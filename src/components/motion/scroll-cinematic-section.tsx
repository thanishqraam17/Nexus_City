"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { SectionAtmosphere } from "@/components/system/section-shell";

interface ScrollCinematicSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  as?: "section" | "div";
  atmosphere?: SectionAtmosphere;
  depth?: number;
  /** Skip scroll blur — prevents clipping on full-bleed 3D sections */
  softMotion?: boolean;
  /** Full-viewport sections — stay visible longer, minimal parallax */
  viewportMode?: boolean;
  /** Opacity-only scroll — no translate/scale (prevents layout drift) */
  layoutStable?: boolean;
  osLayer?: string;
}

/**
 * Scroll-linked opacity + subtle parallax for section transitions.
 * Static layout on SSR / reduced-motion.
 */
export function ScrollCinematicSection({
  children,
  id,
  className,
  as = "section",
  atmosphere = "default",
  depth = 0,
  softMotion = false,
  viewportMode = false,
  layoutStable = false,
  osLayer,
}: ScrollCinematicSectionProps) {
  const stableLayout = layoutStable || viewportMode;
  const sectionRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  const scrollTarget = as === "section" ? sectionRef : divRef;

  const sectionInView = useInView(scrollTarget, { amount: 0.22, once: false });

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    viewportMode ? [0, 0.06, 0.92, 1] : [0, 0.1, 0.85, 1],
    viewportMode ? [0.88, 1, 1, 0.92] : [0.48, 1, 1, 0.58]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    viewportMode
      ? [16 + depth * 2, 0, -20]
      : [40 + depth * 4, 0, -36]
  );
  const scale = useTransform(
    scrollYProgress,
    viewportMode ? [0, 0.12, 0.88, 1] : [0, 0.18, 0.82, 1],
    viewportMode ? [0.99, 1, 1, 0.995] : [0.97, 1, 1, 0.99]
  );
  const filter = useTransform(
    scrollYProgress,
    viewportMode ? [0, 0.08, 0.92, 1] : [0, 0.12, 0.88, 1],
    softMotion || viewportMode
      ? [
          "blur(0px) brightness(0.94)",
          "blur(0px) brightness(1)",
          "blur(0px) brightness(1)",
          "blur(0px) brightness(0.96)",
        ]
      : [
          "blur(3px) brightness(0.82)",
          "blur(0px) brightness(1)",
          "blur(0px) brightness(1)",
          "blur(2px) brightness(0.88)",
        ]
  );

  const Component = as === "section" ? motion.section : motion.div;

  if (!motionReady) {
    if (as === "section") {
      return (
        <section
          ref={sectionRef}
          id={id}
          data-atmosphere={atmosphere}
          className={cn(
          "scroll-cinematic-wrap",
          sectionInView && "scroll-cinematic-wrap--active",
          className
        )}
          data-os-layer={osLayer}
        >
          {children}
        </section>
      );
    }
    return (
      <div
        ref={divRef}
        id={id}
        data-atmosphere={atmosphere}
        className={cn(
          "scroll-cinematic-wrap",
          sectionInView && "scroll-cinematic-wrap--active",
          className
        )}
        data-os-layer={osLayer}
      >
        {children}
      </div>
    );
  }

  return (
    <Component
      ref={scrollTarget as React.RefObject<HTMLDivElement>}
      id={id}
      data-atmosphere={atmosphere}
      data-depth={depth}
      data-os-layer={osLayer}
      className={cn(
        "scroll-cinematic-section scroll-cinematic-wrap overflow-visible",
        viewportMode && "scroll-cinematic-section--viewport",
        stableLayout && "scroll-cinematic-section--stable",
        sectionInView && "scroll-cinematic-wrap--active",
        className
      )}
      style={
        stableLayout
          ? { opacity }
          : { opacity, y, scale, filter }
      }
    >
      {children}
    </Component>
  );
}
