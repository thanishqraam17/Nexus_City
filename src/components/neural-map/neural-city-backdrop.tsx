"use client";

import { useMemo } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

const SKYLINE_LAYERS = [
  { depth: "far", count: 18, baseH: 26, opacity: 0.2 },
  { depth: "mid", count: 14, baseH: 40, opacity: 0.32 },
  { depth: "near", count: 10, baseH: 52, opacity: 0.45 },
] as const;

/** Integer hash — identical output on Node SSR and browser */
function hash01(seed: number): number {
  let x = Math.imul(seed, 2654435761) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 2246822507) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 3266489909) >>> 0;
  return (x ^ (x >>> 16)) / 4294967296;
}

function towerHeight(seed: number, base: number): number {
  const n = hash01(seed);
  return Math.round((base + n * base * 0.75) * 100) / 100;
}

type TowerSpec = {
  depth: (typeof SKYLINE_LAYERS)[number]["depth"];
  height: string;
  width: string;
  opacity: number;
  animationDelay: string;
};

/** Precomputed once — avoids SSR/client float drift from Math.sin */
const SKYLINE_TOWERS: TowerSpec[] = SKYLINE_LAYERS.flatMap((layer) =>
  Array.from({ length: layer.count }, (_, i) => {
    const h = towerHeight(i + layer.count * 3, layer.baseH);
    const w = 2 + (i % 3);
    const delay = Math.round(((i * 0.37) % 5) * 100) / 100;
    return {
      depth: layer.depth,
      height: `${h.toFixed(2)}%`,
      width: `${w}px`,
      opacity: layer.opacity,
      animationDelay: `${delay.toFixed(2)}s`,
    };
  })
);

const TOWERS_BY_DEPTH = SKYLINE_LAYERS.reduce(
  (acc, layer) => {
    acc[layer.depth] = SKYLINE_TOWERS.filter((t) => t.depth === layer.depth);
    return acc;
  },
  {} as Record<(typeof SKYLINE_LAYERS)[number]["depth"], TowerSpec[]>
);

/** Background megacity layer — sits behind WebGL */
export function NeuralCityBackdrop() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const animate = mounted && !reduceMotion;

  const farSignals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: `${8 + ((i * 19) % 84)}%`,
        bottom: `${20 + ((i * 11) % 45)}%`,
        animationDelay: `${i * 0.7}s`,
      })),
    []
  );

  const lights = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: `${6 + ((i * 13) % 88)}%`,
        bottom: `${10 + ((i * 9) % 32)}%`,
        animationDelay: `${(i * 0.55) % 6}s`,
      })),
    []
  );

  return (
    <div className="neural-city-backdrop" aria-hidden>
      <div className="neural-city-backdrop__layer neural-city-backdrop__layer--bg">
        <div className="neural-city-backdrop__horizon" aria-hidden />
        <div className="neural-city-backdrop__fog neural-city-backdrop__fog--deep" />
        <div className="neural-city-backdrop__grid" />
        <div className="neural-city-backdrop__far-signals" aria-hidden>
          {farSignals.map((style, i) => (
            <span key={i} className="neural-city-backdrop__far-signal" style={style} />
          ))}
        </div>

        {SKYLINE_LAYERS.map((layer) => (
          <div
            key={layer.depth}
            className={cn(
              "neural-city-backdrop__skyline",
              `neural-city-backdrop__skyline--${layer.depth}`,
              animate && "neural-city-backdrop__skyline--animate"
            )}
          >
            {TOWERS_BY_DEPTH[layer.depth].map((tower, i) => (
              <span
                key={i}
                className="neural-city-backdrop__tower"
                style={{
                  height: tower.height,
                  width: tower.width,
                  opacity: tower.opacity,
                  animationDelay: tower.animationDelay,
                }}
              />
            ))}
          </div>
        ))}

        <div className={cn("neural-city-backdrop__highways", animate && "is-live")}>
          <span className="neural-city-backdrop__highway neural-city-backdrop__highway--a" />
          <span className="neural-city-backdrop__highway neural-city-backdrop__highway--b" />
          <span className="neural-city-backdrop__highway neural-city-backdrop__highway--c" />
        </div>

        <div className="neural-city-backdrop__lights">
          {lights.map((style, i) => (
            <span key={i} className="neural-city-backdrop__light" style={style} />
          ))}
        </div>
      </div>

      <div className="neural-city-backdrop__layer neural-city-backdrop__layer--mid">
        <div className="neural-city-backdrop__fog neural-city-backdrop__fog--haze" />
        <span className="neural-city-backdrop__holo neural-city-backdrop__holo--a" />
        <span className="neural-city-backdrop__holo neural-city-backdrop__holo--b" />
        <span className="neural-city-backdrop__holo neural-city-backdrop__holo--c" />
        <div className="neural-city-backdrop__glow-field" />
        <div className={cn("neural-city-backdrop__scan", animate && "is-live")} />
      </div>
    </div>
  );
}
