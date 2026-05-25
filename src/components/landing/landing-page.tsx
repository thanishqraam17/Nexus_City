"use client";

import { AnimatedGrid } from "@/components/background/animated-grid";
import { EnvironmentalDetail } from "@/components/background/environmental-detail";
import { AtmosphericGlow } from "@/components/background/atmospheric-glow";
import { CinematicAtmosphere } from "@/components/atmosphere/cinematic-atmosphere";
import { MidDepthField } from "@/components/atmosphere/mid-depth-field";
import { ScrollCinematicSection } from "@/components/motion/scroll-cinematic-section";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { IntelligenceSection } from "@/components/sections/intelligence-section";
import { SystemsPreview } from "@/components/sections/systems-preview";
import { AccessSection } from "@/components/sections/access-section";

export function LandingPage() {
  return (
    <div className="landing-canvas relative min-h-screen bg-void text-white selection:bg-nexus-lime/30 selection:text-white">
      <AnimatedGrid />
      <EnvironmentalDetail />
      <AtmosphericGlow />
      <CinematicAtmosphere />
      <MidDepthField />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <div id="telemetry" className="sr-only" aria-hidden />
        <ScrollCinematicSection className="relative">
          <IntelligenceSection />
        </ScrollCinematicSection>
        <ScrollCinematicSection id="systems" className="relative">
          <SystemsPreview />
        </ScrollCinematicSection>
        <ScrollCinematicSection id="access" className="relative">
          <AccessSection />
        </ScrollCinematicSection>
      </main>
    </div>
  );
}
