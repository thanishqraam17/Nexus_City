import { create } from "zustand";
import {
  computeOsSnapshot,
  type OsRuntimeSnapshot,
} from "@/lib/system/os-runtime";
import {
  maybeEmitInfrastructureEvent,
  type InfrastructureEvent,
} from "@/lib/system/os-events";

interface OsRuntimeState extends OsRuntimeSnapshot {
  tick: number;
  activeSection: string;
  aiMessage: string | null;
  aiVisible: boolean;
  lastEvent: InfrastructureEvent | null;
  lastEventTick: number;
  eventLog: InfrastructureEvent[];
  setActiveSection: (section: string) => void;
  pushAiMessage: (message: string) => void;
  tickRuntime: () => void;
}

export const useOsRuntimeStore = create<OsRuntimeState>((set, get) => ({
  tick: 0,
  activeSection: "overview",
  aiMessage: null,
  aiVisible: false,
  lastEvent: null,
  lastEventTick: -10,
  eventLog: [],
  ...computeOsSnapshot(0),
  setActiveSection: (activeSection) => set({ activeSection }),
  pushAiMessage: (aiMessage) => set({ aiMessage, aiVisible: true }),
  tickRuntime: () => {
    const tick = get().tick + 1;
    const snapshot = computeOsSnapshot(tick);
    const event = maybeEmitInfrastructureEvent(
      tick,
      snapshot,
      get().lastEventTick
    );

    if (event) {
      const eventLog = [event, ...get().eventLog].slice(0, 6);
      set({
        tick,
        ...snapshot,
        lastEvent: event,
        lastEventTick: tick,
        eventLog,
        aiMessage: event.message,
        aiVisible: true,
      });
      return;
    }

    set({ tick, ...snapshot });
  },
}));
