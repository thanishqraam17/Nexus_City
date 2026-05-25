"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { getSectionIdFromHash, SCROLL_OFFSET } from "@/lib/navigation/sections";

interface ScrollContextValue {
  scrollTo: (sectionId: string) => void;
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollTo: () => {},
  lenis: null,
});

export function ScrollContextProvider({
  children,
  lenis,
}: {
  children: ReactNode;
  lenis: Lenis | null;
}) {
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const scrollTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    const instance = lenisRef.current;
    if (!el || !instance) return;

    instance.scrollTo(el, {
      offset: -SCROLL_OFFSET,
      duration: 1.55,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const id = getSectionIdFromHash(hash);
      if (!id || !document.getElementById(id)) return;

      e.preventDefault();
      scrollTo(id);
      if (history.replaceState) {
        history.replaceState(null, "", `#${id}`);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  useEffect(() => {
    const hash = window.location.hash;
    const id = getSectionIdFromHash(hash);
    if (!id || !lenis) return;

    const t = window.setTimeout(() => scrollTo(id), 120);
    return () => window.clearTimeout(t);
  }, [lenis, scrollTo]);

  return (
    <ScrollContext.Provider value={{ scrollTo, lenis }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollTo() {
  return useContext(ScrollContext);
}
