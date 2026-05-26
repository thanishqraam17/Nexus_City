"use client";

import { useEffect, useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { SECTION_AI_OBSERVATIONS } from "@/lib/system/os-runtime";
import { useOsRuntimeStore } from "@/store/os-runtime-store";
import { OsEnvironmentSync } from "@/components/os/os-environment-sync";

const TICK_MS = 2800;

/** Single runtime loop — sync, telemetry states, contextual AI observations */
export function OsRuntimeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const activeSection = useScrollSpy();
  const tickRuntime = useOsRuntimeStore((s) => s.tickRuntime);
  const setActiveSection = useOsRuntimeStore((s) => s.setActiveSection);
  const pushAiMessage = useOsRuntimeStore((s) => s.pushAiMessage);
  const aiMessage = useOsRuntimeStore((s) => s.aiMessage);
  const prevSection = useRef(activeSection);
  const msgIndex = useRef(0);

  useEffect(() => {
    setActiveSection(activeSection);
  }, [activeSection, setActiveSection]);

  useEffect(() => {
    if (prevSection.current === activeSection) return;
    prevSection.current = activeSection;

    const pool = SECTION_AI_OBSERVATIONS[activeSection] ?? SECTION_AI_OBSERVATIONS.overview;
    const msg = pool[msgIndex.current % pool.length];
    msgIndex.current += 1;
    pushAiMessage(msg);
  }, [activeSection, pushAiMessage]);

  useEffect(() => {
    if (!mounted || reduceMotion) return;

    tickRuntime();
    const id = window.setInterval(tickRuntime, TICK_MS);
    return () => window.clearInterval(id);
  }, [mounted, reduceMotion, tickRuntime]);

  useEffect(() => {
    if (!aiMessage || !mounted || reduceMotion) return;
    const hide = window.setTimeout(() => {
      useOsRuntimeStore.setState({ aiVisible: false });
    }, 5200);
    return () => window.clearTimeout(hide);
  }, [aiMessage, mounted, reduceMotion]);

  return (
    <>
      <OsEnvironmentSync />
      {children}
    </>
  );
}
