import type { MetricFormat } from "./city-data";
import {
  formatDecimal,
  formatLatency,
  formatPercent,
} from "@/lib/telemetry/format-metric";

export function formatCityMetric(value: number, format: MetricFormat): string {
  switch (format) {
    case "percent":
      return formatPercent(value);
    case "latency":
      return formatLatency(value);
    case "throughput":
      return formatDecimal(value, 1);
    case "index":
      return formatDecimal(value, 1);
    case "count":
      return formatDecimal(value, 0);
    default:
      return formatDecimal(value, 1);
  }
}
