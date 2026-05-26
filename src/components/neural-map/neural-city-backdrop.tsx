"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

const SKYLINE_LAYERS = [
  { depth: "far", count: 18, baseH: 26, opacity: 0.2 },
  { depth: "mid", count: 14, baseH: 40, opacity: 0.32 },
  { depth: "near", count: 10, baseH: 52, opacity: 0.45 },
] as const;

function towerHeight(seed: number, base: number) {
  const r = Math.sin(seed * 127.1) * 43758.5453;
  const n = r - Math.floor(r);
  return base + n * base * 0.75;
}

/** Background megacity layer — sits behind WebGL */
export function NeuralCityBackdrop() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const animate = mounted && !reduceMotion;

  return (
    <div className="neural-city-backdrop" aria-hidden>
      <div className="neural-city-backdrop__layer neural-city-backdrop__layer--bg">
        <div className="neural-city-backdrop__horizon" aria-hidden />
        <div className="neural-city-backdrop__fog neural-city-backdrop__fog--deep" />
        <div className="neural-city-backdrop__grid" />
        <div className="neural-city-backdrop__far-signals" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="neural-city-backdrop__far-signal"
              style={{
                left: `${8 + ((i * 19) % 84)}%`,
                bottom: `${20 + ((i * 11) % 45)}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
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
            {Array.from({ length: layer.count }).map((_, i) => {
              const h = towerHeight(i + layer.count * 3, layer.baseH);
              const w = 2 + (i % 3);
              const delay = (i * 0.37) % 5;
              return (
                <span
                  key={i}
                  className="neural-city-backdrop__tower"
                  style={{
                    height: `${h}%`,
                    width: `${w}px`,
                    opacity: layer.opacity,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </div>
        ))}

        <div className={cn("neural-city-backdrop__highways", animate && "is-live")}>
          <span className="neural-city-backdrop__highway neural-city-backdrop__highway--a" />
          <span className="neural-city-backdrop__highway neural-city-backdrop__highway--b" />
          <span className="neural-city-backdrop__highway neural-city-backdrop__highway--c" />
        </div>

        <div className="neural-city-backdrop__lights">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="neural-city-backdrop__light"
              style={{
                left: `${6 + ((i * 13) % 88)}%`,
                bottom: `${10 + ((i * 9) % 32)}%`,
                animationDelay: `${(i * 0.55) % 6}s`,
              }}
            />
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
