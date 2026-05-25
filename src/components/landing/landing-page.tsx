"use client";

import { AnimatedGrid } from "@/components/background/animated-grid";
import { EnvironmentalDetail } from "@/components/background/environmental-detail";
import { AtmosphericGlow } from "@/components/background/atmospheric-glow";
import { CinematicAtmosphere } from "@/components/atmosphere/cinematic-atmosphere";
import { MidDepthField } from "@/components/atmosphere/mid-depth-field";
import { ScrollCinematicSection } from "@/components/motion/scroll-cinematic-section";
import { SectionBridge } from "@/components/system/section-bridge";
import { CinematicCursor } from "@/components/cinematic/cinematic-cursor";
import { SystemBoot } from "@/components/cinematic/system-boot";
import { ScrollEnvironment } from "@/components/cinematic/scroll-environment";
import { AmbientPulse } from "@/components/cinematic/ambient-pulse";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { CityIntelligenceSection } from "@/components/sections/city-intelligence-section";
import { NeuralNetworkSection } from "@/components/sections/neural-network-section";
import { SystemsPreview } from "@/components/sections/systems-preview";
import { TerminalSection } from "@/components/sections/terminal-section";
import { AccessSection } from "@/components/sections/access-section";

export function LandingPage() {
  return (
    <div className="landing-canvas relative min-h-screen bg-void text-white nexus-selection">
      <AnimatedGrid />
      <EnvironmentalDetail />
      <AtmosphericGlow />
      <CinematicAtmosphere />
      <MidDepthField />
      <ScrollEnvironment />
      <CinematicCursor />
      <AmbientPulse />
      <SystemBoot />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />

        <SectionBridge from="void" to="cyan" label="Descent · Layer 01" />
        <ScrollCinematicSection atmosphere="intelligence" depth={1}>
          <CityIntelligenceSection />
        </ScrollCinematicSection>

        <SectionBridge from="cyan" to="lime" label="Neural interface" />
        <ScrollCinematicSection atmosphere="neural" depth={2}>
          <NeuralNetworkSection />
        </ScrollCinematicSection>

        <SectionBridge from="lime" to="void" label="Systems mesh" />
        <ScrollCinematicSection atmosphere="systems" depth={3}>
          <SystemsPreview />
        </ScrollCinematicSection>

        <SectionBridge from="void" to="lime" label="Command uplink" />
        <ScrollCinematicSection atmosphere="terminal" depth={4}>
          <TerminalSection />
        </ScrollCinematicSection>

        <SectionBridge from="lime" to="void" label="Access gateway" />
        <ScrollCinematicSection atmosphere="access" depth={5}>
          <AccessSection />
        </ScrollCinematicSection>
      </main>
    </div>
  );
}
