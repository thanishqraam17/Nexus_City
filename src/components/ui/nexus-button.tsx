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

function ButtonInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="nexus-btn-shine" aria-hidden />
      <span className="nexus-btn-border-trace" aria-hidden />
      <span className="nexus-btn-content relative z-[1]">{children}</span>
    </>
  );
}

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

  const classes = cn(variantClass[variant], "group/nxbtn", className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={motionReady ? { y: -1 } : undefined}
        whileTap={motionReady ? { y: 0, scale: 0.992 } : undefined}
        transition={springHoverReact}
        {...(props as HTMLMotionProps<"a">)}
      >
        <ButtonInner>{children}</ButtonInner>
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      whileHover={motionReady ? { y: -1 } : undefined}
      whileTap={motionReady ? { y: 0, scale: 0.992 } : undefined}
      transition={springHoverReact}
      {...props}
    >
      <ButtonInner>{children}</ButtonInner>
    </motion.button>
  );
}
