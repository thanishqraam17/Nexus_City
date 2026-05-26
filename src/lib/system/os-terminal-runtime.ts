import type { OsRuntimeSnapshot } from "@/lib/system/os-runtime";

export function formatInfrastructureReport(snapshot: OsRuntimeSnapshot): string[] {
  return [
    "› NEXUS CITY — infrastructure report",
    `› AI sync: ${snapshot.syncPercent.toFixed(2)}% · throughput ${snapshot.throughputIndex}`,
    `› Neural state: ${snapshot.neuralState} · relays ${snapshot.activeRelays}/5`,
    `› Atmosphere: ${snapshot.atmosphere} · load ${snapshot.infrastructureLoad}%`,
    `› Uplink: ${snapshot.uplink} · energy stability ${snapshot.energyStability}%`,
    "✓ Report generated · metropolitan mesh operational",
  ];
}

export function formatNeuralStatus(snapshot: OsRuntimeSnapshot): string[] {
  return [
    "› Neural core temperature: nominal",
    `› Throughput index: ${snapshot.throughputIndex} · variance ±1.8`,
    `› Activity: ${snapshot.neuralState} · relays ${snapshot.activeRelays} online`,
    `› Sync envelope: ${snapshot.syncPercent.toFixed(2)}%`,
    "✓ Uplink stable across all sectors",
  ];
}

export function formatSyncStatus(snapshot: OsRuntimeSnapshot): string[] {
  return [
    "› Initializing district handshake…",
    `› Mesh sync: ${snapshot.syncPercent.toFixed(2)}%`,
    `› Active relays: ${snapshot.activeRelays} · neural ${snapshot.neuralState}`,
    `› Latency p99: ${(11.2 + (snapshot.infrastructureLoad % 5)).toFixed(1)}ms`,
    "✓ District sync within tolerance",
  ];
}

export function formatOptimize(snapshot: OsRuntimeSnapshot): string[] {
  return [
    "› Analyzing load distribution…",
    `› Current load: ${snapshot.infrastructureLoad}% → target band 48–58%`,
    `› Energy stability: ${snapshot.energyStability}%`,
    `› Neural routing: ${snapshot.neuralState}`,
    "✓ Infrastructure optimization applied",
  ];
}

export function formatDiagnostics(snapshot: OsRuntimeSnapshot): string[] {
  return [
    `› Grid uptime: ${snapshot.syncPercent.toFixed(2)}%`,
    `› Atmospheric profile: ${snapshot.atmosphere}`,
    `› Throughput: ${snapshot.throughputIndex} · uplink ${snapshot.uplink}`,
    `› Infrastructure load: ${snapshot.infrastructureLoad}%`,
    "✓ All subsystems within tolerance",
  ];
}

export function formatRouteQuery(snapshot: OsRuntimeSnapshot): string[] {
  return [
    "› Resolving neural routing table…",
    `› Primary cortex: ${snapshot.neuralState}`,
    `› Relay pathways: ${snapshot.activeRelays} active / 5`,
    `› Packet integrity: ${snapshot.syncPercent.toFixed(2)}%`,
    "✓ Routing table synchronized",
  ];
}

export function resolveTerminalInput(
  raw: string
): { id: string; input: string } | null {
  const input = raw.trim().toLowerCase();
  if (!input) return null;

  if (input === "help" || input.startsWith("help ")) {
    return { id: "help", input: "help" };
  }
  if (input.startsWith("sync")) {
    return { id: "sync", input: raw.trim() };
  }
  if (input.includes("uplink") || input.includes("neural")) {
    return { id: "uplink", input: raw.trim() };
  }
  if (input.startsWith("optimize")) {
    return { id: "optimize", input: raw.trim() };
  }
  if (input.includes("diag") || input.includes("telemetry")) {
    return { id: "diag", input: raw.trim() };
  }
  if (input.includes("infra") || input.includes("mesh") || input.includes("query")) {
    return { id: "infra", input: raw.trim() };
  }
  if (input.includes("route")) {
    return { id: "route", input: raw.trim() };
  }
  if (input.includes("report") || input.includes("status")) {
    return { id: "report", input: raw.trim() };
  }
  if (input === "clear") {
    return { id: "clear", input: "clear" };
  }

  return null;
}
