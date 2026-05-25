"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { MicroLabel } from "@/components/ui/micro-label";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TelemetryCluster } from "@/components/ui/telemetry-widget";
import { heroTitle, fadeUp, lineDraw } from "@/lib/motion/variants";
import { staggerContainer } from "@/lib/motion/transitions";
import { useParallaxMouse } from "@/lib/motion/hooks";

export function HeroSection() {
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { x, y } = useParallaxMouse(0.02);
  const motionReady = mounted && !reduceMotion;

  useEffect(() => {
    if (!motionReady || !titleRef.current) return;
    const chars = titleRef.current.querySelectorAll(".hero-char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 60, rotateX: -40, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.04,
        ease: "power4.out",
        delay: 0.4,
      }
    );
  }, [motionReady]);

  const titleLine1 = "NEXUS";
  const titleLine2 = "CITY";

  return (
    <section
      id="command"
      className="relative min-h-[100dvh] overflow-hidden pt-28 pb-20 sm:pt-32 lg:pb-28"
    >
      <motion.div
        className="relative z-10 mx-auto grid max-w-[1800px] grid-cols-1 gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12"
        style={motionReady ? { x, y } : undefined}
      >
        <div className="lg:col-span-8 lg:col-start-1">
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial={false}
            animate={motionReady ? "visible" : false}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <MicroLabel accent="lime" pulse>
                Smart City Operating System
              </MicroLabel>
              <span className="hidden h-px w-16 bg-nexus-lime/30 sm:block" />
              <MicroLabel accent="cyan">Sector Alpha-7 Online</MicroLabel>
            </motion.div>

            <div className="relative">
              <motion.div
                variants={lineDraw}
                className="absolute -left-4 top-1/2 hidden h-24 w-px origin-top bg-gradient-to-b from-nexus-lime to-transparent lg:block"
              />
              <h1
                ref={titleRef}
                className="font-display font-extralight leading-[0.85] tracking-[-0.04em] text-white"
                style={{ perspective: "800px" }}
              >
                <span className="block overflow-hidden">
                  <span className="flex flex-wrap">
                    {titleLine1.split("").map((char, i) => (
                      <motion.span
                        key={`l1-${i}`}
                        custom={i}
                        variants={heroTitle}
                        initial={false}
                        animate={motionReady ? "visible" : false}
                        className="hero-char inline-block text-[clamp(4rem,14vw,11rem)]"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </span>
                <span className="mt-[-0.05em] block overflow-hidden text-nexus-lime">
                  <span className="flex flex-wrap">
                    {titleLine2.split("").map((char, i) => (
                      <motion.span
                        key={`l2-${i}`}
                        custom={i + 6}
                        variants={heroTitle}
                        initial={false}
                        animate={motionReady ? "visible" : false}
                        className="hero-char inline-block text-[clamp(4rem,14vw,11rem)] text-shadow-nexus-lime"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </span>
              </h1>
            </div>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base leading-relaxed text-white/45 sm:text-lg lg:ml-2 lg:max-w-md"
            >
              The neural command layer for tomorrow&apos;s metropolis. Real-time
              telemetry, autonomous infrastructure, and cinematic control at
              planetary scale.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 pt-4 lg:ml-2"
            >
              <motion.a
                href="#access"
                className="group relative flex items-center gap-3 overflow-hidden bg-nexus-lime px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-void"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 50px rgba(212, 255, 0, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Enter Command Center
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </motion.a>
              <motion.a
                href="#systems"
                className="flex items-center gap-2 border border-white/15 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-nexus-cyan/40 hover:text-white"
                whileHover={{ x: 4 }}
              >
                View Systems
                <ChevronRight size={14} />
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-24 lg:max-w-2xl"
            initial={false}
            animate={
              motionReady
                ? { opacity: 1, y: 0 }
                : false
            }
            transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { stat: "847", label: "Nodes Active" },
              { stat: "12ms", label: "Avg Response" },
              { stat: "4.2M", label: "Events / sec" },
              { stat: "∞", label: "Scale Ready" },
            ].map((item) => (
              <GlassPanel
                key={item.label}
                variant="hud"
                className="p-4"
                glow="cyan"
              >
                <p className="font-display text-xl text-white sm:text-2xl">
                  {item.stat}
                </p>
                <MicroLabel accent="muted" className="mt-2 text-[8px]">
                  {item.label}
                </MicroLabel>
              </GlassPanel>
            ))}
          </motion.div>
        </div>

        <div className="relative lg:col-span-4 lg:col-start-9">
          <motion.div
            className="lg:absolute lg:right-0 lg:top-8"
            initial={false}
            animate={
              motionReady
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : false
            }
            transition={{ delay: 0.8, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex justify-end">
              <MicroLabel accent="orange">Live Telemetry</MicroLabel>
            </div>
            <TelemetryCluster className="lg:items-end" />
          </motion.div>

          <motion.div
            className="mt-8 hidden lg:block lg:absolute lg:-left-32 lg:bottom-32"
            initial={false}
            animate={motionReady ? { opacity: 1, rotate: 0 } : false}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <GlassPanel variant="command" glow="orange" className="w-48 p-4" cornerMarks>
              <MicroLabel accent="orange">Atmospheric</MicroLabel>
              <p className="mt-2 font-mono text-xs text-white/40 leading-relaxed">
                Depth layers active. Parallax field synchronized with cursor
                vector.
              </p>
            </GlassPanel>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        initial={false}
        animate={motionReady ? { opacity: 1 } : false}
        transition={{ delay: 2 }}
      >
        <MicroLabel accent="muted">Scroll to descend</MicroLabel>
        {motionReady && (
          <motion.div
            className="h-12 w-px bg-gradient-to-b from-nexus-lime/60 to-transparent"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      <div
        className="pointer-events-none absolute right-0 top-1/3 hidden h-[40vh] w-px bg-gradient-to-b from-transparent via-nexus-cyan/30 to-transparent lg:block"
        aria-hidden
      />
    </section>
  );
}
