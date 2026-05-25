"use client";

import { motion } from "framer-motion";

export function LightSweeps() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="atmo-light-sweep atmo-sweep-lime absolute top-[20%] h-[1px] w-[140%]"
        animate={{ x: ["-40%", "60%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
      />
      <motion.div
        className="atmo-light-sweep atmo-sweep-cyan absolute top-[55%] h-[1px] w-[120%]"
        animate={{ x: ["60%", "-30%"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", repeatDelay: 2, delay: 3 }}
      />
      <motion.div
        className="atmo-light-sweep atmo-sweep-white absolute top-[78%] h-px w-[100%]"
        animate={{ x: ["-20%", "80%"], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
      />
      <div className="atmo-gradient-drift absolute inset-0 opacity-50" />
    </div>
  );
}
