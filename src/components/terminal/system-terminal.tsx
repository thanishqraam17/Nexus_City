"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MicroLabel } from "@/components/ui/micro-label";
import {
  TERMINAL_BOOT,
  TERMINAL_COMMANDS,
  TERMINAL_SUGGESTIONS,
  type TerminalCommand,
} from "@/lib/system/terminal-data";
import {
  formatDiagnostics,
  formatInfrastructureReport,
  formatNeuralStatus,
  formatOptimize,
  formatRouteQuery,
  formatSyncStatus,
  resolveTerminalInput,
} from "@/lib/system/os-terminal-runtime";
import { useOsRuntimeStore } from "@/store/os-runtime-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

type TerminalLine = { id: string; text: string; tone?: "dim" | "lime" | "cyan" };

let lineId = 0;
function nextLineId() {
  lineId += 1;
  return `ln-${lineId}`;
}

function toneClass(tone?: TerminalLine["tone"]) {
  if (tone === "lime") return "text-nexus-lime os-terminal-line--glow";
  if (tone === "cyan") return "text-nexus-cyan";
  return "text-white/55";
}

async function typeLine(
  text: string,
  onUpdate: (partial: string) => void,
  charMs: number
) {
  if (charMs <= 0) {
    onUpdate(text);
    return;
  }
  let built = "";
  for (const ch of text) {
    built += ch;
    onUpdate(built);
    await new Promise((r) => setTimeout(r, charMs));
  }
}

async function fakeLoad(ms: number, reduceMotion: boolean) {
  if (reduceMotion) return;
  await new Promise((r) => setTimeout(r, ms));
}

function linesForCommand(cmd: TerminalCommand): string[] {
  if (!cmd.dynamic) return cmd.lines;
  const snapshot = useOsRuntimeStore.getState();

  switch (cmd.id) {
    case "sync":
      return formatSyncStatus(snapshot);
    case "uplink":
      return formatNeuralStatus(snapshot);
    case "optimize":
      return formatOptimize(snapshot);
    case "diag":
      return formatDiagnostics(snapshot);
    case "route":
      return formatRouteQuery(snapshot);
    case "report":
      return formatInfrastructureReport(snapshot);
    default:
      return cmd.lines;
  }
}

export function SystemTerminal() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const booted = useRef(false);
  const setTelemetryPanelOpen = useUIStore((s) => s.setTelemetryPanelOpen);
  const pushAiMessage = useOsRuntimeStore((s) => s.pushAiMessage);

  useEffect(() => {
    if (!mounted || booted.current) return;
    booted.current = true;
    setLines(
      TERMINAL_BOOT.map((text) => ({
        id: nextLineId(),
        text,
        tone: "dim" as const,
      }))
    );
  }, [mounted]);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [lines, busy, reduceMotion]);

  const appendLine = useCallback((text: string, tone: TerminalLine["tone"] = "cyan") => {
    const id = nextLineId();
    setLines((prev) => [...prev, { id, text, tone }]);
    return id;
  }, []);

  const updateLine = useCallback((id: string, text: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, text } : l)));
  }, []);

  const runCommand = useCallback(
    async (cmd: TerminalCommand, displayInput?: string) => {
      if (busy) return;

      if (cmd.id === "clear") {
        setLines([]);
        setHistory((prev) => ["clear", ...prev].slice(0, 8));
        return;
      }

      setBusy(true);
      const shown = displayInput ?? cmd.input;
      setHistory((prev) => [shown, ...prev].slice(0, 8));
      appendLine(`nexus@city:~$ ${shown}`, "lime");

      await fakeLoad(cmd.delayMs ?? 280, reduceMotion);

      if (cmd.opensDiagnostics) {
        setTelemetryPanelOpen(true);
        pushAiMessage("Diagnostics channel opened — live feed synchronized.");
      }

      const outputLines = linesForCommand(cmd);
      const charMs = reduceMotion ? 0 : 20;

      for (const line of outputLines) {
        const id = appendLine("", "cyan");
        await typeLine(line, (partial) => updateLine(id, partial), charMs);
        await new Promise((r) => setTimeout(r, charMs ? 70 : 0));
      }

      setBusy(false);
    },
    [
      busy,
      appendLine,
      updateLine,
      reduceMotion,
      setTelemetryPanelOpen,
      pushAiMessage,
    ]
  );

  const executeInput = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || busy) return;

      const resolved = resolveTerminalInput(trimmed);
      if (!resolved) {
        void (async () => {
          setBusy(true);
          appendLine(`nexus@city:~$ ${trimmed}`, "lime");
          const id = appendLine("", "cyan");
          await typeLine(
            `› Unknown command. Type \`help\` for available syntax.`,
            (partial) => updateLine(id, partial),
            reduceMotion ? 0 : 18
          );
          setHistory((prev) => [trimmed, ...prev].slice(0, 8));
          setBusy(false);
        })();
        return;
      }

      if (resolved.id === "clear") {
        void runCommand({ id: "clear", input: "clear", lines: [] }, trimmed);
        return;
      }

      const cmd = TERMINAL_COMMANDS.find((c) => c.id === resolved.id);
      if (cmd) void runCommand(cmd, trimmed);
    },
    [busy, appendLine, updateLine, reduceMotion, runCommand]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput("");
    executeInput(value);
  };

  const handleSuggestion = (suggestion: string) => {
    executeInput(suggestion);
  };

  return (
    <GlassPanel variant="command" glow="lime" cornerMarks className="overflow-hidden p-0 os-hud-shimmer">
      <div className="os-terminal flex flex-col">
        <div className="os-terminal-chrome flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5">
          <MicroLabel accent="lime" className="os-telemetry-pulse">
            System Terminal
          </MicroLabel>
          <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">
            SECURE · ENCRYPTED
          </span>
        </div>

        <div
          ref={scrollRef}
          className="os-terminal-body max-h-[320px] min-h-[240px] overflow-y-auto px-4 py-4 font-mono text-[11px] leading-relaxed sm:max-h-[380px] sm:px-5 sm:text-xs"
          onClick={() => inputRef.current?.focus()}
        >
          {history.length > 0 && (
            <div className="os-terminal-history mb-3 space-y-0.5">
              {history.slice(0, 5).map((h, i) => (
                <div key={`${h}-${i}`} className="truncate text-white/30">
                  › {h}
                </div>
              ))}
            </div>
          )}
          {lines.map((line) => (
            <div
              key={line.id}
              className={cn(
                "mb-1 min-h-[1.25em] transition-opacity duration-300",
                toneClass(line.tone),
                line.text.startsWith("›") && "pl-1"
              )}
            >
              {line.text}
            </div>
          ))}
        </div>

        <form
          className="os-terminal-input-row flex items-center gap-2 border-t border-white/[0.08] px-4 py-3 sm:px-5"
          onSubmit={handleSubmit}
        >
          <span className="shrink-0 font-mono text-[11px] text-nexus-lime">nexus@city:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={busy}
            onChange={(e) => setInput(e.target.value)}
            className="os-terminal-input min-w-0 flex-1 bg-transparent font-mono text-[11px] text-white/85 outline-none placeholder:text-white/25 sm:text-xs"
            placeholder="Enter command…"
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command input"
          />
          {!busy && (
            <span
              className={cn(
                "h-3.5 w-1.5 shrink-0 bg-nexus-lime/80 transition-opacity",
                cursorOn ? "opacity-100" : "opacity-0"
              )}
              aria-hidden
            />
          )}
        </form>

        <div className="os-terminal-suggestions flex flex-wrap gap-2 border-t border-white/[0.08] p-4 sm:p-5">
          {TERMINAL_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => handleSuggestion(s)}
              data-depth-pull
              className="os-terminal-chip font-mono text-[9px] uppercase tracking-wider text-white/45 transition-colors hover:border-nexus-lime/35 hover:text-nexus-lime disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
