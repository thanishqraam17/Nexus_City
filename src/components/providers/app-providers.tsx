"use client";

import { AtmosphereProvider } from "@/context/atmosphere-context";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <AtmosphereProvider>{children}</AtmosphereProvider>
    </SmoothScrollProvider>
  );
}
