"use client";

import { AnimatedGrid } from "@/components/background/animated-grid";
import { AtmosphericGlow } from "@/components/background/atmospheric-glow";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { SystemsPreview } from "@/components/sections/systems-preview";
import { AccessSection } from "@/components/sections/access-section";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-void text-white selection:bg-nexus-lime/30 selection:text-white">
      <AnimatedGrid />
      <AtmosphericGlow />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <div id="telemetry" className="sr-only" aria-hidden />
        <SystemsPreview />
        <AccessSection />
      </main>
    </div>
  );
}
