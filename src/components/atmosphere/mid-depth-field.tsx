"use client";

import { useMemo } from "react";
import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left: `${8 + ((i * 37) % 84)}%`,
  top: `${5 + ((i * 23) % 90)}%`,
  delay: `${(i % 8) * 1.2}s`,
  color: i % 3 === 0 ? "bg-nexus-lime/50" : "bg-nexus-cyan/40",
}));

const HOLO_LINES = [
  { top: "28%", left: "12%", width: "22%", delay: "0s" },
  { top: "52%", left: "68%", width: "18%", delay: "2s" },
  { top: "68%", left: "32%", width: "26%", delay: "4s" },
];

const DRIFT_LABELS = [
  "SYNC::ALPHA-7",
  "NODE::847",
  "LATENCY 0.8ms",
  "GRID 99.97%",
];

export function MidDepthField() {
  const ready = useAtmosphereReady();

  const labels = useMemo(
    () =>
      DRIFT_LABELS.map((text, i) => ({
        text,
        left: `${20 + i * 18}%`,
        delay: `${i * 5.5}s`,
      })),
    []
  );

  if (!ready) {
    return (
      <div className="mid-depth-field" aria-hidden>
        <div className="mid-depth-scan opacity-[0.05]" />
        <div className="mid-depth-fog opacity-40" />
      </div>
    );
  }

  return (
    <div className="mid-depth-field" aria-hidden>
      <div className="mid-depth-fog" />
      <div className="mid-depth-scan" />
      <div className="mid-depth-sweep" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`mid-depth-particle ${p.color}`}
          style={{ left: p.left, top: p.top, animationDelay: p.delay }}
        />
      ))}
      {HOLO_LINES.map((line, i) => (
        <span
          key={i}
          className="mid-depth-holo-line"
          style={{
            top: line.top,
            left: line.left,
            width: line.width,
            animationDelay: line.delay,
          }}
        />
      ))}
      {labels.map((l, i) => (
        <span
          key={i}
          className="mid-depth-telemetry-drift"
          style={{ left: l.left, animationDelay: l.delay }}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}
