"use client";

import { Html } from "@react-three/drei";

const LABELS = [
  { text: "SATELLITE UPLINK — ACTIVE", pos: [2.2, 1.8, 0.5] as const, delay: "0s" },
  { text: "GRID NODE — SYNCED", pos: [-1.8, 1.2, 0.8] as const, delay: "1.2s" },
  { text: "NEURAL CORE — ONLINE", pos: [0.8, 2.4, -1.2] as const, delay: "2.4s" },
];

export function HoloLabels() {
  return (
    <group>
      {LABELS.map((l) => (
        <Html
          key={l.text}
          position={l.pos}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="hologram-floating-label whitespace-nowrap"
            style={{ animationDelay: l.delay }}
          >
            {l.text}
          </div>
        </Html>
      ))}
    </group>
  );
}
