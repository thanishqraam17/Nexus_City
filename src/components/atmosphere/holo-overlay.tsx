"use client";

export function HoloOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="atmo-holo-flicker absolute inset-0 opacity-[0.04]" />
      <div className="atmo-chromatic-edge absolute inset-0 opacity-[0.06]" />
      <div className="atmo-distortion absolute inset-0 opacity-[0.025]" />
    </div>
  );
}
