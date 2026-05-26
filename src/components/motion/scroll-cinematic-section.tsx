"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
  osLayer,
}: ScrollCinematicSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  const scrollTarget = as === "section" ? sectionRef : divRef;

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0.48, 1, 1, 0.58]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40 + depth * 4, 0, -36]);
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.97, 1, 1, 0.99]);
  const filter = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    softMotion
      ? [
          "blur(0px) brightness(0.92)",
          "blur(0px) brightness(1)",
          "blur(0px) brightness(1)",
          "blur(0px) brightness(0.94)",
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
          className={cn("scroll-cinematic-wrap", className)}
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
        className={cn("scroll-cinematic-wrap", className)}
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
      className={cn("scroll-cinematic-section scroll-cinematic-wrap overflow-visible", className)}
      style={{ opacity, y, scale, filter }}
    >
      {children}
    </Component>
  );
}
