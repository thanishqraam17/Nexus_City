"use client";

import { AtmosphereProvider } from "@/context/atmosphere-context";
import { CursorProvider } from "@/context/cursor-context";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <AtmosphereProvider>
        <CursorProvider>{children}</CursorProvider>
      </AtmosphereProvider>
    </SmoothScrollProvider>
  );
}
