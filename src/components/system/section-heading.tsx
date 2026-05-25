"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { MicroLabel } from "@/components/ui/micro-label";
import { slideFromLeft } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  titleAccent?: React.ReactNode;
  description?: string;
  accent?: "lime" | "cyan" | "orange";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  description,
  accent = "cyan",
  className,
}: SectionHeadingProps) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  return (
    <motion.header
      className={cn("os-section-heading max-w-2xl", className)}
      variants={slideFromLeft}
      initial={false}
      whileInView={motionReady ? "visible" : undefined}
      viewport={{ once: true, amount: 0.35 }}
    >
      <MicroLabel accent={accent} pulse={false}>
        {eyebrow}
      </MicroLabel>
      <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-light leading-[0.95] tracking-tight text-white">
        {title}
        {titleAccent ? (
          <>
            <br />
            <span className="text-nexus-lime">{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="nexus-support mt-5 max-w-lg">{description}</p>
      ) : null}
    </motion.header>
  );
}
