"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface ScrollCinematicSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  as?: "section" | "div";
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

  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.55, 1, 1, 0.65]);
  const y = useTransform(scrollYProgress, [0, 1], [32, -32]);

  const Component = as === "section" ? motion.section : motion.div;

  if (!motionReady) {
    if (as === "section") {
      return (
        <section ref={sectionRef} id={id} className={className}>
          {children}
        </section>
      );
    }
    return (
      <div ref={divRef} id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <Component
      ref={scrollTarget as React.RefObject<HTMLDivElement>}
      id={id}
      className={cn("scroll-cinematic-section", className)}
      style={{ opacity, y }}
    >
      {children}
    </Component>
  );
}
