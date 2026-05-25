"use client";

import { motion } from "framer-motion";
import { useLayeredParallax } from "@/lib/motion/hooks";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";
import { cn } from "@/lib/utils";

interface DepthParallaxProps {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}

export function DepthParallax({
  children,
  depth = 1,
  className,
}: DepthParallaxProps) {
  const ready = useAtmosphereReady();
  const { x, y } = useLayeredParallax(depth);

  if (!ready) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={cn(className)} style={{ x, y }}>
      {children}
    </motion.div>
  );
}
