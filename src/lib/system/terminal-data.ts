export interface TerminalCommand {
  id: string;
  input: string;
  lines: string[];
  delayMs?: number;
}

export const TERMINAL_BOOT: string[] = [
  "NEXUS CITY OS v2.4 — command interface",
  "Neural uplink established · encryption AES-512",
  "Type `help` or select a command below",
];

export const TERMINAL_COMMANDS: TerminalCommand[] = [
  {
    id: "sync",
    input: "sync --district alpha-7",
    lines: [
      "› Initializing district handshake…",
      "› Alpha-7 mesh nodes: 847 online",
      "› Transit corridors synchronized",
      "✓ District sync complete · latency 11.8ms",
    ],
  },
  {
    id: "uplink",
    input: "neural uplink --status",
    lines: [
      "› Neural core temperature: nominal",
      "› Throughput: 87.4% · variance ±2.1",
      "› Prediction engine: ACTIVE",
      "✓ Uplink stable across all sectors",
    ],
  },
  {
    id: "optimize",
    input: "optimize infrastructure --auto",
    lines: [
      "› Analyzing load distribution…",
      "› Energy mesh rebalanced · +3.2% efficiency",
      "› Traffic flow optimized · 12 corridors",
      "✓ Infrastructure optimization applied",
    ],
  },
  {
    id: "diag",
    input: "telemetry diagnostics --full",
    lines: [
      "› Grid uptime: 99.97%",
      "› Atmospheric index: 92.8 aqi",
      "› AI decision rate: 2.1M/hr",
      "✓ All subsystems within tolerance",
    ],
  },
  {
    id: "help",
    input: "help",
    lines: [
      "Available commands:",
      "  sync --district [id]",
      "  neural uplink --status",
      "  optimize infrastructure --auto",
      "  telemetry diagnostics --full",
    ],
  },
];

export const TERMINAL_SUGGESTIONS = TERMINAL_COMMANDS.map((c) => c.input);
