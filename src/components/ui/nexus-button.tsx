"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { springHoverReact } from "@/lib/motion/transitions";

type NexusButtonVariant = "primary" | "ghost" | "outline";

interface NexusButtonProps extends HTMLMotionProps<"button"> {
  variant?: NexusButtonVariant;
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const variantClass: Record<NexusButtonVariant, string> = {
  primary: "nexus-btn nexus-btn-primary",
  ghost: "nexus-btn nexus-btn-ghost",
  outline: "nexus-btn nexus-btn-outline",
};

export function NexusButton({
  variant = "primary",
  children,
  className,
  href,
  ...props
}: NexusButtonProps) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const motionReady = mounted && !reduceMotion;

  const classes = cn(variantClass[variant], className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={motionReady ? { scale: 1.02 } : undefined}
        whileTap={motionReady ? { scale: 0.98 } : undefined}
        transition={springHoverReact}
        {...(props as HTMLMotionProps<"a">)}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      whileHover={motionReady ? { scale: 1.02 } : undefined}
      whileTap={motionReady ? { scale: 0.98 } : undefined}
      transition={springHoverReact}
      {...props}
    >
      {children}
    </motion.button>
  );
}
