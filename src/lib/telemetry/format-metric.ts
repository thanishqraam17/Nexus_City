/** Fixed-slot metric formatting — width controlled via CSS `ch` units. */

export function formatDecimal(value: number, decimals: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(decimals);
}

export function formatPercent(value: number): string {
  return formatDecimal(Math.min(100, Math.max(0, value)), 1);
}

export function formatLatency(value: number): string {
  return formatDecimal(Math.min(99.9, Math.max(0, value)), 1);
}

export function formatUptime(value: number): string {
  return formatDecimal(Math.min(100, Math.max(0, value)), 2);
}
