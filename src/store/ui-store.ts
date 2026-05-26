import { create } from "zustand";

interface UIState {
  navOpen: boolean;
  scrollLocked: boolean;
  telemetryPanelOpen: boolean;
  activeSector: string;
  telemetryLive: boolean;
  setNavOpen: (open: boolean) => void;
  setScrollLocked: (locked: boolean) => void;
  setTelemetryPanelOpen: (open: boolean) => void;
  setActiveSector: (sector: string) => void;
  setTelemetryLive: (live: boolean) => void;
  toggleNav: () => void;
  toggleTelemetryPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  navOpen: false,
  scrollLocked: false,
  telemetryPanelOpen: false,
  activeSector: "ALPHA-7",
  telemetryLive: true,
  setNavOpen: (navOpen) => set({ navOpen }),
  setScrollLocked: (scrollLocked) => set({ scrollLocked }),
  setTelemetryPanelOpen: (telemetryPanelOpen) => set({ telemetryPanelOpen }),
  setActiveSector: (activeSector) => set({ activeSector }),
  setTelemetryLive: (telemetryLive) => set({ telemetryLive }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
  toggleTelemetryPanel: () =>
    set((s) => ({ telemetryPanelOpen: !s.telemetryPanelOpen })),
}));
