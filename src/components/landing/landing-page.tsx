"use client";

import { AnimatedGrid } from "@/components/background/animated-grid";
import { EnvironmentalDetail } from "@/components/background/environmental-detail";
import { AtmosphericGlow } from "@/components/background/atmospheric-glow";
import { CinematicAtmosphere } from "@/components/atmosphere/cinematic-atmosphere";
import { MidDepthField } from "@/components/atmosphere/mid-depth-field";
import { ScrollCinematicSection } from "@/components/motion/scroll-cinematic-section";
import { SectionBridge } from "@/components/system/section-bridge";
import { CursorGlow } from "@/components/system/cursor-glow";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { CityIntelligenceSection } from "@/components/sections/city-intelligence-section";
import { NeuralNetworkSection } from "@/components/sections/neural-network-section";
import { SystemsPreview } from "@/components/sections/systems-preview";
import { TerminalSection } from "@/components/sections/terminal-section";
import { AccessSection } from "@/components/sections/access-section";

export function LandingPage() {
  return (
    <div className="landing-canvas relative min-h-screen bg-void text-white selection:bg-nexus-lime/30 selection:text-white">
      <AnimatedGrid />
      <EnvironmentalDetail />
      <AtmosphericGlow />
      <CinematicAtmosphere />
      <MidDepthField />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />

        <SectionBridge from="void" to="cyan" />
        <ScrollCinematicSection>
          <CityIntelligenceSection />
        </ScrollCinematicSection>

        <SectionBridge from="cyan" to="lime" />
        <ScrollCinematicSection>
          <NeuralNetworkSection />
        </ScrollCinematicSection>

        <SectionBridge from="lime" to="void" />
        <ScrollCinematicSection id="systems">
          <SystemsPreview />
        </ScrollCinematicSection>

        <SectionBridge from="void" to="lime" />
        <ScrollCinematicSection>
          <TerminalSection />
        </ScrollCinematicSection>

        <SectionBridge from="lime" to="void" />
        <ScrollCinematicSection id="access">
          <AccessSection />
        </ScrollCinematicSection>
      </main>
    </div>
  );
}
