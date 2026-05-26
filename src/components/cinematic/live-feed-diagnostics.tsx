"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { TelemetryRail } from "@/components/ui/telemetry-widget";
import { MicroLabel } from "@/components/ui/micro-label";
import { useUIStore } from "@/store/ui-store";
import { useOsRuntimeStore } from "@/store/os-runtime-store";
import { springSoft } from "@/lib/motion/transitions";

export function LiveFeedDiagnostics() {
  const open = useUIStore((s) => s.telemetryPanelOpen);
  const setOpen = useUIStore((s) => s.setTelemetryPanelOpen);
  const setScrollLocked = useUIStore((s) => s.setScrollLocked);
  const syncPercent = useOsRuntimeStore((s) => s.syncPercent);
  const neuralState = useOsRuntimeStore((s) => s.neuralState);
  const lastEvent = useOsRuntimeStore((s) => s.lastEvent);
  const eventLog = useOsRuntimeStore((s) => s.eventLog);

  useEffect(() => {
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open, setScrollLocked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="live-feed-diagnostics__backdrop fixed inset-0 z-[55] bg-void/70 backdrop-blur-sm"
            aria-label="Close diagnostics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="live-feed-diagnostics fixed right-0 top-0 z-[56] flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-void/95 shadow-[-24px_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            role="dialog"
            aria-modal
            aria-labelledby="live-feed-diagnostics-title"
            initial={{ x: "100%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={springSoft}
          >
            <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <MicroLabel accent="lime" className="text-[8px]">
                  System diagnostics
                </MicroLabel>
                <h2
                  id="live-feed-diagnostics-title"
                  className="mt-1 font-display text-lg font-light tracking-wide text-white/95"
                >
                  Live Feed
                </h2>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/70 transition-colors hover:border-nexus-lime/40 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Close panel"
              >
                <X size={16} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {eventLog.length > 0 && (
                <div className="live-feed-diagnostics__events mb-6 space-y-2 border-b border-white/[0.06] pb-5">
                  <MicroLabel accent="cyan" className="text-[8px]">
                    Recent infrastructure events
                  </MicroLabel>
                  {eventLog.slice(0, 4).map((evt) => (
                    <p
                      key={evt.id}
                      className="font-mono text-[10px] leading-relaxed text-white/45"
                    >
                      <span className="text-nexus-cyan/80">{evt.shortLabel}</span>
                      {" · "}
                      {evt.message}
                    </p>
                  ))}
                </div>
              )}
              <TelemetryRail />
            </div>
            <footer className="border-t border-white/[0.06] px-6 py-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/35">
                Sync {syncPercent.toFixed(2)}% · {neuralState}
                {lastEvent ? ` · ${lastEvent.shortLabel}` : " · mesh stable"}
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
