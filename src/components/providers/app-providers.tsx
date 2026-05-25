"use client";

import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
