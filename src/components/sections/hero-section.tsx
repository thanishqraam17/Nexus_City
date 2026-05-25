"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { NexusButton } from "@/components/ui/nexus-button";
import { HeroHologram } from "@/components/hero-core/hero-hologram";
import { MicroLabel } from "@/components/ui/micro-label";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TelemetryRail } from "@/components/ui/telemetry-widget";
import { HeroCommandBar } from "@/components/layout/hero-command-bar";

const METRICS = [
  { stat: "847", label: "Nodes Active" },
  { stat: "12ms", label: "Avg Response" },
  { stat: "4.2M", label: "Events / sec" },
  { stat: "∞", label: "Scale Ready" },
] as const;

export function HeroSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const motionReady = mounted && !reduceMotion;

  useEffect(() => {
    if (!motionReady || !titleRef.current) return;
    const chars = titleRef.current.querySelectorAll(".hero-char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.04,
        ease: "power3.out",
        delay: 0.35,
      }
    );
  }, [motionReady]);

  return (
    <section id="command" className="hero-section">
      <HeroHologram />

      <div className="hero-shell">
        <div className="hero-grid">
          <div className="hero-grid-left">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <MicroLabel accent="lime" pulse={mounted}>
                Smart City Operating System
              </MicroLabel>
              <MicroLabel accent="cyan">Sector Alpha-7 Online</MicroLabel>
            </div>

            <h1
              ref={titleRef}
              className="font-display font-extralight leading-[0.85] tracking-[-0.04em] text-white"
            >
              <span className="block">
                <span className="flex flex-wrap">
                  {"NEXUS".split("").map((char, i) => (
                    <span
                      key={`l1-${i}`}
                      className="hero-char inline-block text-[clamp(3rem,10vw,9rem)]"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
              <span className="mt-[-0.05em] block text-nexus-lime">
                <span className="flex flex-wrap">
                  {"CITY".split("").map((char, i) => (
                    <span
                      key={`l2-${i}`}
                      className="hero-char inline-block text-[clamp(3rem,10vw,9rem)] text-shadow-nexus-lime"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p className="nexus-support max-w-md lg:max-w-lg">
              The neural command layer for tomorrow&apos;s metropolis. Real-time
              telemetry, autonomous infrastructure, and cinematic control at
              planetary scale.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <NexusButton href="#access" variant="primary">
                Enter Command Center
                <ArrowUpRight size={16} />
              </NexusButton>
              <NexusButton href="#systems" variant="ghost">
                View Systems
                <ChevronRight size={14} />
              </NexusButton>
            </div>

            <div className="hero-metrics">
              {METRICS.map((item) => (
                <GlassPanel
                  key={item.label}
                  variant="hud"
                  className="p-4"
                  glow="cyan"
                  revealOnView={false}
                >
                  <p className="font-display text-xl text-white sm:text-2xl">
                    {item.stat}
                  </p>
                  <MicroLabel accent="muted" className="mt-2 text-[8px]">
                    {item.label}
                  </MicroLabel>
                </GlassPanel>
              ))}
            </div>
          </div>

          <div className="hero-grid-center" aria-hidden />

          <div className="hero-grid-right">
            <TelemetryRail />
          </div>
        </div>
      </div>

      <HeroCommandBar />
    </section>
  );
}
