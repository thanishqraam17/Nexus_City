"use client";

import { useReducedMotion } from "framer-motion";
import { useMounted } from "./use-mounted";

/**
 * Returns false until mounted so server and client initial HTML agree.
 * After mount, reflects the user's prefers-reduced-motion setting.
 */
export function useHydratedReducedMotion(): boolean {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  return mounted && Boolean(reduced);
}
