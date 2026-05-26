import type { NeuralEdgeTier } from "@/lib/system/neural-graph";
import { NEXUS } from "@/components/hero-core/colors";

export type NeuralRouteLayer = "primary" | "secondary" | "background";

export function routeLayerFromTier(tier: NeuralEdgeTier): NeuralRouteLayer {
  if (tier === "core" || tier === "spoke") return "primary";
  if (tier === "relay") return "secondary";
  return "background";
}

export const ROUTE_LAYER_STYLE: Record<
  NeuralRouteLayer,
  {
    coreColor: string;
    glowColor: string;
    coreOpacity: number;
    glowOpacity: number;
    packetCount: number;
    trailCount: number;
    packetRadius: number;
    packetOpacity: number;
    speedMul: number;
    renderOrder: number;
  }
> = {
  primary: {
    coreColor: NEXUS.lime,
    glowColor: NEXUS.limeBright,
    coreOpacity: 0.58,
    glowOpacity: 0.16,
    packetCount: 3,
    trailCount: 1,
    packetRadius: 0.052,
    packetOpacity: 0.92,
    speedMul: 1,
    renderOrder: 4,
  },
  secondary: {
    coreColor: NEXUS.cyan,
    glowColor: NEXUS.cyan,
    coreOpacity: 0.38,
    glowOpacity: 0.1,
    packetCount: 2,
    trailCount: 1,
    packetRadius: 0.042,
    packetOpacity: 0.78,
    speedMul: 0.88,
    renderOrder: 3,
  },
  background: {
    coreColor: "#0a8aa8",
    glowColor: "#064e62",
    coreOpacity: 0.2,
    glowOpacity: 0.06,
    packetCount: 1,
    trailCount: 0,
    packetRadius: 0.032,
    packetOpacity: 0.5,
    speedMul: 0.72,
    renderOrder: 2,
  },
};

export const TIER_BASE_SPEED: Record<NeuralEdgeTier, number> = {
  core: 0.22,
  spoke: 0.2,
  relay: 0.18,
  ring: 0.14,
};
