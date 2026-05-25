"use client";

import { useAtmosphereReady } from "@/hooks/use-atmosphere-ready";

const COORD_LINES = [
  { top: "18%", left: "4%", text: "34.0522° N" },
  { top: "72%", left: "6%", text: "118.2437° W" },
  { top: "42%", right: "5%", text: "SECTOR::ALPHA-7" },
  { top: "58%", right: "4%", text: "MESH::847-NODES" },
] as const;

const TECH_LINES = [
  { top: "24%", left: "14%", width: "120px", rotate: "-8deg" },
  { top: "38%", left: "72%", width: "90px", rotate: "12deg" },
  { top: "62%", left: "22%", width: "140px", rotate: "4deg" },
  { top: "78%", left: "58%", width: "100px", rotate: "-6deg" },
] as const;

export function EnvironmentalDetail() {
  const ready = useAtmosphereReady();

  return (
    <div
      className="env-detail-layer pointer-events-none fixed inset-0 z-[3] overflow-hidden"
      aria-hidden
    >
      <div className="env-detail-grid absolute inset-0 opacity-[0.14]" />
      <div
        className={`env-detail-scanlines absolute inset-0 ${ready ? "opacity-[0.06]" : "opacity-[0.04]"}`}
      />

      {TECH_LINES.map((line, i) => (
        <span
          key={i}
          className="env-detail-tech-line absolute h-px bg-gradient-to-r from-nexus-cyan/40 via-nexus-lime/30 to-transparent"
          style={{
            top: line.top,
            left: line.left,
            width: line.width,
            transform: `rotate(${line.rotate})`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}

      {COORD_LINES.map((c, i) => (
        <span
          key={i}
          className="env-detail-coord absolute font-mono text-[8px] uppercase tracking-[0.28em] text-white/25"
          style={{
            top: c.top,
            left: "left" in c ? c.left : undefined,
            right: "right" in c ? c.right : undefined,
          }}
        >
          {c.text}
        </span>
      ))}

      {ready &&
        ["SYNC", "UPLINK", "GRID", "NODE"].map((word, i) => (
          <span
            key={word}
            className="env-detail-drift absolute font-mono text-[7px] uppercase tracking-[0.32em] text-nexus-lime/20"
            style={{
              left: `${12 + i * 22}%`,
              animationDelay: `${i * 4.2}s`,
            }}
          >
            {word}::{((i + 1) * 127) % 999}
          </span>
        ))}
    </div>
  );
}
