"use client";

/** Layered hero atmosphere — guides eye TITLE → CENTER → TELEMETRY */
export function HeroDepth() {
  return (
    <div className="hero-depth" aria-hidden>
      <div className="hero-depth-layer hero-depth-vignette" />
      <div className="hero-depth-layer hero-depth-title-falloff" />
      <div className="hero-depth-layer hero-depth-core-spotlight" />
      <div className="hero-depth-layer hero-depth-rail-falloff" />
    </div>
  );
}
