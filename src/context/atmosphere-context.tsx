"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";

interface AtmosphereState {
  pointerX: number;
  pointerY: number;
  pointerNX: number;
  pointerNY: number;
  ready: boolean;
}

const AtmosphereContext = createContext<AtmosphereState>({
  pointerX: 0,
  pointerY: 0,
  pointerNX: 0,
  pointerNY: 0,
  ready: false,
});

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const ready = useAtmosphereReady();
  const [pointer, setPointer] = useState({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    if (!ready) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x: e.clientX, y: e.clientY, nx, ny });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ready]);

  const value = useMemo(
    () => ({
      pointerX: pointer.x,
      pointerY: pointer.y,
      pointerNX: pointer.nx,
      pointerNY: pointer.ny,
      ready,
    }),
    [pointer, ready]
  );

  return (
    <AtmosphereContext.Provider value={value}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  return useContext(AtmosphereContext);
}
