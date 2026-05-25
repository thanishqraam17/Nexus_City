import type { Variants } from "framer-motion";
import { blurReveal, easeOutExpo } from "./transitions";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: blurReveal,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: easeOutExpo,
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -64, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: blurReveal,
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 64, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: blurReveal,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: blurReveal,
  },
};

export const lineDraw: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const floatPulse: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const panelReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.99,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const navItem: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.06,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 80, skewY: 2, filter: "blur(16px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.2 + i * 0.12,
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const telemetryTick: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
