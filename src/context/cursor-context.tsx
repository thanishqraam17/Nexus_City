"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

interface CursorState {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
  nx: number;
  ny: number;
  ready: boolean;
  reducedMotion: boolean;
}

const CursorContext = createContext<CursorState>({
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  nx: 0,
  ny: 0,
  ready: false,
  reducedMotion: false,
});

const SMOOTH = 0.14;

export function CursorProvider({ children }: { children: ReactNode }) {
  const ready = useAtmosphereReady();
  const reducedMotion = useHydratedReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0, nx: 0, ny: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const [smooth, setSmooth] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!ready || reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setPos({ x: e.clientX, y: e.clientY, nx, ny });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ready, reducedMotion]);

  useEffect(() => {
    if (!ready || reducedMotion) return;

    const tick = () => {
      smoothRef.current.x += (pos.x - smoothRef.current.x) * SMOOTH;
      smoothRef.current.y += (pos.y - smoothRef.current.y) * SMOOTH;
      setSmooth({ x: smoothRef.current.x, y: smoothRef.current.y });

      document.documentElement.style.setProperty(
        "--cursor-x",
        `${smoothRef.current.x}px`
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${smoothRef.current.y}px`
      );
      document.documentElement.style.setProperty("--cursor-nx", String(pos.nx));
      document.documentElement.style.setProperty("--cursor-ny", String(pos.ny));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pos.x, pos.y, pos.nx, pos.ny, ready, reducedMotion]);

  const value = useMemo(
    () => ({
      ...pos,
      smoothX: smooth.x,
      smoothY: smooth.y,
      ready,
      reducedMotion,
    }),
    [pos, smooth, ready, reducedMotion]
  );

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}

export function useMagneticPull(strength = 0.35) {
  const { nx, ny, ready, reducedMotion } = useCursor();
  if (!ready || reducedMotion) return { x: 0, y: 0 };
  return { x: nx * strength * 12, y: ny * strength * 12 };
}
