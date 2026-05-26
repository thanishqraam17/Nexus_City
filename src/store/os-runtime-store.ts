import { create } from "zustand";
import {
  computeOsSnapshot,
  type OsRuntimeSnapshot,
} from "@/lib/system/os-runtime";

interface OsRuntimeState extends OsRuntimeSnapshot {
  tick: number;
  activeSection: string;
  aiMessage: string | null;
  aiVisible: boolean;
  setActiveSection: (section: string) => void;
  pushAiMessage: (message: string) => void;
  tickRuntime: () => void;
}

export const useOsRuntimeStore = create<OsRuntimeState>((set, get) => ({
  tick: 0,
  activeSection: "overview",
  aiMessage: null,
  aiVisible: false,
  ...computeOsSnapshot(0),
  setActiveSection: (activeSection) => set({ activeSection }),
  pushAiMessage: (aiMessage) => set({ aiMessage, aiVisible: true }),
  tickRuntime: () => {
    const tick = get().tick + 1;
    set({ tick, ...computeOsSnapshot(tick) });
  },
}));
