"use client";

import { motion } from "framer-motion";
import { useAtmosphere } from "@/context/atmosphere-context";

export function AmbientReflections() {
  const { pointerNX, pointerNY, ready } = useAtmosphere();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="atmo-reflection atmo-reflection-1 absolute left-[10%] top-[25%] h-32 w-64"
        animate={{ opacity: [0.15, 0.35, 0.2], skewX: [-2, 2, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={ready ? { x: pointerNX * 40, y: pointerNY * 25 } : undefined}
      />
      <motion.div
        className="atmo-reflection atmo-reflection-2 absolute right-[15%] top-[60%] h-24 w-48"
        animate={{ opacity: [0.1, 0.28, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={ready ? { x: pointerNX * -35, y: pointerNY * -20 } : undefined}
      />
      <div className="atmo-noise-drift absolute inset-0 opacity-[0.06]" />
    </div>
  );
}
