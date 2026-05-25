"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Variants } from "framer-motion";
import {
  fadeUp,
  fadeIn,
  slideFromLeft,
  slideFromRight,
  scaleIn,
} from "@/lib/motion/variants";

type RevealVariant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale";

const variantMap: Record<RevealVariant, Variants> = {
  fadeUp,
  fadeIn,
  slideLeft: slideFromLeft,
  slideRight: slideFromRight,
  scale: scaleIn,
};

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function MotionReveal({
  children,
  variant = "fadeUp",
  className,
  delay = 0,
  once = true,
  ...props
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
