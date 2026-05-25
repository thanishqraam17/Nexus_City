"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { useUIStore } from "@/store/ui-store";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollLocked = useUIStore((s) => s.scrollLocked);
  const navOpen = useUIStore((s) => s.navOpen);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (scrollLocked || navOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [scrollLocked, navOpen]);

  return <>{children}</>;
}
