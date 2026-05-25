"use client";

import { useMounted } from "@/hooks/use-mounted";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Renders children only after mount — avoids SSR/client markup drift. */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useMounted();
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
