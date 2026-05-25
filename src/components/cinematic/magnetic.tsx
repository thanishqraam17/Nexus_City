"use client";

import { motion } from "framer-motion";
import { useMagneticPull } from "@/context/cursor-context";
import { springHoverReact } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const pull = useMagneticPull(strength);

  return (
    <motion.div
      className={cn("magnetic-target", className)}
      style={{ x: pull.x, y: pull.y }}
      transition={springHoverReact}
    >
      {children}
    </motion.div>
  );
}
