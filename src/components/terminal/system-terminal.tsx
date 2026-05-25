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
import { cn } from "@/lib/utils";

type TerminalLine = { id: string; text: string; tone?: "dim" | "lime" | "cyan" };

let lineId = 0;
function nextLineId() {
  lineId += 1;
  return `ln-${lineId}`;
}

function toneClass(tone?: TerminalLine["tone"]) {
  if (tone === "lime") return "text-nexus-lime";
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

export function SystemTerminal() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

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
      behavior: "smooth",
    });
  }, [lines, busy]);

  const appendLine = useCallback((text: string, tone: TerminalLine["tone"] = "cyan") => {
    const id = nextLineId();
    setLines((prev) => [...prev, { id, text, tone }]);
    return id;
  }, []);

  const updateLine = useCallback((id: string, text: string) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, text } : l))
    );
  }, []);

  const runCommand = useCallback(
    async (cmd: TerminalCommand) => {
      if (busy) return;
      setBusy(true);
      appendLine(`nexus@city:~$ ${cmd.input}`, "lime");
      const charMs = reduceMotion ? 0 : 24;

      for (const line of cmd.lines) {
        const id = appendLine("", "cyan");
        await typeLine(line, (partial) => updateLine(id, partial), charMs);
        await new Promise((r) => setTimeout(r, charMs ? 100 : 0));
      }

      setBusy(false);
    },
    [busy, appendLine, updateLine, reduceMotion]
  );

  const handleSuggestion = (input: string) => {
    const cmd = TERMINAL_COMMANDS.find((c) => c.input === input);
    if (cmd) void runCommand(cmd);
  };

  return (
    <GlassPanel variant="command" glow="lime" cornerMarks className="overflow-hidden p-0">
      <div className="os-terminal flex flex-col">
        <div className="os-terminal-chrome flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-5">
          <MicroLabel accent="lime">System Terminal</MicroLabel>
          <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">
            SECURE · ENCRYPTED
          </span>
        </div>

        <div
          ref={scrollRef}
          className="os-terminal-body max-h-[320px] min-h-[240px] overflow-y-auto px-4 py-4 font-mono text-[11px] leading-relaxed sm:max-h-[380px] sm:px-5 sm:text-xs"
        >
          {lines.map((line) => (
            <div key={line.id} className={cn("mb-1 min-h-[1.25em]", toneClass(line.tone))}>
              {line.text}
            </div>
          ))}
          <div className="mt-2 flex items-center gap-1 text-nexus-lime">
            <span>nexus@city:~$</span>
            <span
              className={cn(
                "inline-block h-3.5 w-1.5 bg-nexus-lime/80 transition-opacity",
                cursorOn ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>

        <div className="os-terminal-suggestions flex flex-wrap gap-2 border-t border-white/[0.08] p-4 sm:p-5">
          {TERMINAL_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => handleSuggestion(s)}
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
