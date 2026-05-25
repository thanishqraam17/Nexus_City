"use client";

export function Scanlines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="atmo-scanlines absolute inset-0 opacity-[0.07]" />
      <div className="atmo-scanline-beam absolute left-0 right-0 h-[2px] opacity-40" />
      <div className="atmo-crt-flicker absolute inset-0 opacity-[0.03]" />
    </div>
  );
}
