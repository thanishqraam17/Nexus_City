import type { Transition } from "framer-motion";

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 1.2,
};

export const springCinematic: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 18,
  mass: 1.6,
};

/** Heavy mass — UI elements drift with inertia */
export const springInertia: Transition = {
  type: "spring",
  stiffness: 42,
  damping: 13,
  mass: 2.4,
};

/** Delayed, physically weighted hover response */
export const springHoverReact: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 1.1,
  delay: 0.09,
};

export const springDepth: Transition = {
  type: "spring",
  stiffness: 65,
  damping: 16,
  mass: 1.8,
};

export const tweenDrift: Transition = {
  duration: 2.8,
  ease: [0.37, 0, 0.63, 1],
  repeat: Infinity,
  repeatType: "mirror" as const,
};

export const easeOutExpo: Transition = {
  duration: 1.1,
  ease: [0.16, 1, 0.3, 1],
};

export const easeInOutCubic: Transition = {
  duration: 0.85,
  ease: [0.65, 0, 0.35, 1],
};

export const blurReveal: Transition = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1],
};

export const staggerContainer = (stagger = 0.08, delay = 0.12) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerCinematic = (stagger = 0.055, delay = 0.22) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerTelemetry = (stagger = 0.12, delay = 0.35) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const motionBlurFilter = {
  hidden: { filter: "blur(12px)" },
  visible: { filter: "blur(0px)" },
};
