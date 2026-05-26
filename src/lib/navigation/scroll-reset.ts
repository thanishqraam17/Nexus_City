/** True when the document was loaded via refresh (not client navigation). */
export function isPageReload(): boolean {
  if (typeof window === "undefined") return false;

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (nav?.type === "reload") return true;

  // Legacy fallback
  const legacy = performance as Performance & { navigation?: { type?: number } };
  return legacy.navigation?.type === 1;
}

export function clearHashFromUrl(): void {
  if (typeof window === "undefined" || !window.location.hash) return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
}
