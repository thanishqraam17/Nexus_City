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
import { GlobalAmbient } from "@/components/cinematic/global-ambient";
import { LiveFeedDiagnostics } from "@/components/cinematic/live-feed-diagnostics";
import { AmbientPulse } from "@/components/cinematic/ambient-pulse";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { CityIntelligenceSection } from "@/components/sections/city-intelligence-section";
import { NeuralNetworkSection } from "@/components/sections/neural-network-section";
import { SystemsPreview } from "@/components/sections/systems-preview";
import { TerminalSection } from "@/components/sections/terminal-section";
import { AccessSection } from "@/components/sections/access-section";
import { OsRuntimeProvider } from "@/components/os/os-runtime-provider";
import { OsStatusBar } from "@/components/os/os-status-bar";
import { AiAssistantLayer } from "@/components/os/ai-assistant-layer";

export function LandingPage() {
  return (
    <OsRuntimeProvider>
    <div className="landing-canvas relative min-h-screen bg-void text-white nexus-selection">
      <AnimatedGrid />
      <EnvironmentalDetail />
      <AtmosphericGlow />
      <GlobalAmbient />
      <CinematicAtmosphere />
      <MidDepthField />
      <ScrollEnvironment />
      <CinematicCursor />
      <AmbientPulse />
      <SystemBoot />
      <Navbar />
      <LiveFeedDiagnostics />
      <OsStatusBar />
      <AiAssistantLayer />
      <main className="relative z-10">
        <div data-os-layer="overview">
          <HeroSection />
        </div>

        <SectionBridge from="void" to="cyan" label="Descent · Layer 01" />
        <ScrollCinematicSection atmosphere="intelligence" depth={1} osLayer="intelligence">
          <CityIntelligenceSection />
        </ScrollCinematicSection>

        <SectionBridge from="cyan" to="lime" label="Neural interface" />
        <ScrollCinematicSection
          atmosphere="neural"
          depth={2}
          softMotion
          layoutStable
          osLayer="neural"
          className="overflow-visible"
        >
          <NeuralNetworkSection />
        </ScrollCinematicSection>

        <SectionBridge from="lime" to="void" label="Systems mesh" />
        <ScrollCinematicSection atmosphere="systems" depth={3} osLayer="systems">
          <SystemsPreview />
        </ScrollCinematicSection>

        <SectionBridge from="void" to="lime" label="Command uplink" />
        <ScrollCinematicSection atmosphere="terminal" depth={4} osLayer="terminal">
          <TerminalSection />
        </ScrollCinematicSection>

        <SectionBridge from="lime" to="void" label="Access gateway" />
        <ScrollCinematicSection
          atmosphere="access"
          depth={5}
          layoutStable
          softMotion
          osLayer="access"
        >
          <AccessSection />
        </ScrollCinematicSection>
      </main>
    </div>
    </OsRuntimeProvider>
  );
}
