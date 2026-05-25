import { create } from "zustand";

interface UIState {
  navOpen: boolean;
  scrollLocked: boolean;
  activeSector: string;
  telemetryLive: boolean;
  setNavOpen: (open: boolean) => void;
  setScrollLocked: (locked: boolean) => void;
  setActiveSector: (sector: string) => void;
  setTelemetryLive: (live: boolean) => void;
  toggleNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  navOpen: false,
  scrollLocked: false,
  activeSector: "ALPHA-7",
  telemetryLive: true,
  setNavOpen: (navOpen) => set({ navOpen }),
  setScrollLocked: (scrollLocked) => set({ scrollLocked }),
  setActiveSector: (activeSector) => set({ activeSector }),
  setTelemetryLive: (telemetryLive) => set({ telemetryLive }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));
