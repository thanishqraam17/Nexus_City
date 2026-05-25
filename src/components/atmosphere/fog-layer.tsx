"use client";

import {
  motion,
  useMotionTemplate,
  useSpring,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { useAtmosphere } from "@/context/atmosphere-context";

function FogBlob({
  className,
  animate,
  transition,
  parallaxMulX,
  parallaxMulY,
}: {
  className: string;
  animate: TargetAndTransition;
  transition: Transition;
  parallaxMulX: number;
  parallaxMulY: number;
}) {
  const { pointerNX, pointerNY, ready } = useAtmosphere();
  const px = useSpring(pointerNX * parallaxMulX, { stiffness: 40, damping: 16, mass: 1.5 });
  const py = useSpring(pointerNY * parallaxMulY, { stiffness: 40, damping: 16, mass: 1.5 });
  const transform = useMotionTemplate`translate(${px}px, ${py}px)`;

  return (
    <motion.div className="absolute" style={ready ? { transform } : undefined}>
      <motion.div
        className={`absolute ${className}`}
        animate={animate}
        transition={transition}
      />
    </motion.div>
  );
}

export function FogLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <FogBlob
        className="atmo-fog-blob atmo-fog-cyan h-[55vh] w-[55vw] -left-[10%] top-[15%]"
        parallaxMulX={-25}
        parallaxMulY={-18}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.06, 0.98, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <FogBlob
        className="atmo-fog-blob atmo-fog-lime h-[50vh] w-[50vw] -right-[15%] top-[40%]"
        parallaxMulX={30}
        parallaxMulY={22}
        animate={{ x: [0, -35, 25, 0], y: [0, 25, -15, 0], scale: [1.02, 1, 1.05, 1.02] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="atmo-fog-blob atmo-fog-orange absolute left-[30%] bottom-[5%] h-[40vh] w-[40vw]"
        animate={{ opacity: [0.4, 0.7, 0.5, 0.4], scale: [1, 1.1, 1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
    </div>
  );
}
