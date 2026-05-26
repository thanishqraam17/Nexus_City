"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Menu, X, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItem } from "@/lib/motion/variants";
import { springHoverReact } from "@/lib/motion/transitions";
import { NexusButton } from "@/components/ui/nexus-button";
import { MicroLabel } from "@/components/ui/micro-label";
import { useUIStore } from "@/store/ui-store";
import { NAV_SECTIONS } from "@/lib/navigation/sections";
import { useScrollTo } from "@/context/scroll-context";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navOpen = useUIStore((s) => s.navOpen);
  const toggleNav = useUIStore((s) => s.toggleNav);
  const setNavOpen = useUIStore((s) => s.setNavOpen);
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const toggleTelemetryPanel = useUIStore((s) => s.toggleTelemetryPanel);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();
  const activeSection = useScrollSpy();
  const { scrollTo } = useScrollTo();

  const { scrollY } = useScroll();
  const navBlur = useTransform(scrollY, [0, 120], ["blur(0px)", "blur(12px)"]);
  const navBg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(3, 3, 8, 0)", "rgba(3, 3, 8, 0.85)"]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const navLinks = NAV_SECTIONS.filter((s) => s.id !== "overview").map((s) => ({
    href: `#${s.id}`,
    label: s.navLabel ?? s.label,
    id: s.id,
  }));

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12",
          "transition-[padding] duration-500",
          scrolled ? "py-3" : "py-6"
        )}
        style={
          !mounted || reduceMotion
            ? { backgroundColor: scrolled ? "rgba(3,3,8,0.9)" : "transparent" }
            : { backgroundColor: navBg, backdropFilter: navBlur }
        }
        initial={false}
        animate={
          mounted && !reduceMotion
            ? { y: 0, opacity: 1 }
            : undefined
        }
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <nav
          className="mx-auto flex max-w-[1800px] items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            href="#overview"
            className="group relative flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("overview");
              setNavOpen(false);
            }}
          >
            <motion.div
              className="relative flex h-10 w-10 items-center justify-center border border-nexus-lime/30 bg-black/50"
              whileHover={{ scale: 1.05, borderColor: "rgba(212,255,0,0.6)" }}
              transition={springHoverReact}
            >
              <span className="font-display text-sm font-bold text-nexus-lime">NX</span>
              <span className="absolute -inset-px bg-nexus-lime/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="font-display text-sm font-semibold tracking-[0.2em] text-white/95">
                NEXUS
              </p>
              <MicroLabel accent="cyan" className="text-[8px]">
                City OS v2.4
              </MicroLabel>
            </div>
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-8">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={navItem}
                    initial={false}
                    animate={mounted && !reduceMotion ? "visible" : false}
                  >
                    <a
                      href={link.href}
                      className={cn(
                        "group relative font-mono text-xs uppercase tracking-[0.22em] transition-colors duration-500",
                        isActive
                          ? "text-nexus-lime"
                          : "text-white/58 hover:text-white/95"
                      )}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 h-px bg-nexus-lime/80 transition-all duration-500",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4">
              <StatusPill
                live={mounted && telemetryLive}
                onOpen={toggleTelemetryPanel}
              />
              <NexusButton href="#access" variant="outline">
                Initialize
              </NexusButton>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border border-white/10 bg-black/40 text-white lg:hidden"
            onClick={toggleNav}
            aria-expanded={navOpen}
            aria-label={navOpen ? "Close menu" : "Open menu"}
          >
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <motion.div
          className="mx-auto mt-3 hidden h-px max-w-[1800px] origin-left bg-gradient-to-r from-nexus-lime/50 via-nexus-cyan/30 to-transparent lg:block"
          initial={false}
          animate={
            mounted && !reduceMotion
              ? { scaleX: scrolled ? 1 : 0.3 }
              : { scaleX: 0.3 }
          }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.header>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-void/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex flex-1 flex-col justify-center gap-8 px-8 pt-24">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <a
                    href={link.href}
                    className={cn(
                      "font-display text-4xl font-light",
                      activeSection === link.id
                        ? "text-nexus-lime"
                        : "text-white/90"
                    )}
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
              <StatusPill
                live={mounted && telemetryLive}
                onOpen={toggleTelemetryPanel}
                className="mt-4"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatusPill({
  live,
  className,
  onOpen,
}: {
  live: boolean;
  className?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "status-pill flex items-center gap-2 border border-white/[0.1] bg-black/35 px-3 py-1.5 backdrop-blur-md",
        "transition-colors duration-500 hover:border-nexus-lime/25 hover:bg-black/50",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-nexus-lime/50",
        className
      )}
      aria-label={live ? "Open live feed diagnostics" : "Open telemetry diagnostics"}
    >
      <motion.span
        animate={live ? { opacity: [1, 0.35, 1] } : { opacity: 0.5 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      >
        <Radio size={12} className="text-nexus-lime" />
      </motion.span>
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
        {live ? "Live Feed" : "Standby"}
      </span>
    </button>
  );
}
