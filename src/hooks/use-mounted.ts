"use client";

import { useEffect, useState } from "react";

/**
 * False on server and on the first client render so SSR markup matches hydration.
 * True only after the component has mounted in the browser.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
