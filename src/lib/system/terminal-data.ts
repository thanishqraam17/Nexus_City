export interface TerminalCommand {
  id: string;
  input: string;
  lines: string[];
  delayMs?: number;
  dynamic?: boolean;
  opensDiagnostics?: boolean;
}

export const TERMINAL_BOOT: string[] = [
  "NEXUS CITY OS v2.4 — command interface",
  "Neural uplink established · encryption AES-512",
  "Enter a command or select below · type `help` for syntax",
];

export const TERMINAL_COMMANDS: TerminalCommand[] = [
  {
    id: "sync",
    input: "sync --district alpha-7",
    lines: [],
    dynamic: true,
  },
  {
    id: "uplink",
    input: "neural uplink --status",
    lines: [],
    dynamic: true,
  },
  {
    id: "optimize",
    input: "optimize infrastructure --auto",
    lines: [],
    dynamic: true,
    delayMs: 320,
  },
  {
    id: "diag",
    input: "telemetry diagnostics --full",
    lines: [],
    dynamic: true,
    opensDiagnostics: true,
  },
  {
    id: "route",
    input: "neural route --status",
    lines: [],
    dynamic: true,
  },
  {
    id: "report",
    input: "infrastructure report",
    lines: [],
    dynamic: true,
    delayMs: 380,
  },
  {
    id: "help",
    input: "help",
    lines: [
      "Available commands:",
      "  sync --district [id]",
      "  neural uplink --status",
      "  neural route --status",
      "  optimize infrastructure --auto",
      "  telemetry diagnostics --full",
      "  infrastructure report",
      "  query infrastructure --mesh",
      "  clear",
    ],
  },
  {
    id: "infra",
    input: "query infrastructure --mesh",
    delayMs: 420,
    lines: [
      "› Resolving mesh topology…",
      "› Transit nodes: 1,204 · energy hubs: 89",
      "› Cross-sector latency p99: 14.2ms",
      "› Autonomous corridors: 47 active",
      "✓ Infrastructure mesh query complete",
    ],
  },
];

export const TERMINAL_SUGGESTIONS = [
  "neural uplink --status",
  "infrastructure report",
  "telemetry diagnostics --full",
  "optimize infrastructure --auto",
  "neural route --status",
  "help",
];
