"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/motion/transitions";

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0.1,
}: StaggerGroupProps) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();

  if (!mounted || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer(stagger, delay)}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
