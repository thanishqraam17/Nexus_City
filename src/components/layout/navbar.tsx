"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { Menu, X, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItem } from "@/lib/motion/variants";
import { springSnappy } from "@/lib/motion/transitions";
import { MicroLabel } from "@/components/ui/micro-label";
import { useUIStore } from "@/store/ui-store";

const navLinks = [
  { href: "#command", label: "Command" },
  { href: "#systems", label: "Systems" },
  { href: "#telemetry", label: "Telemetry" },
  { href: "#access", label: "Access" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navOpen = useUIStore((s) => s.navOpen);
  const toggleNav = useUIStore((s) => s.toggleNav);
  const setNavOpen = useUIStore((s) => s.setNavOpen);
  const telemetryLive = useUIStore((s) => s.telemetryLive);
  const mounted = useMounted();
  const reduceMotion = useHydratedReducedMotion();

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
          <Link href="/" className="group relative flex items-center gap-3">
            <motion.div
              className="relative flex h-10 w-10 items-center justify-center border border-nexus-lime/30 bg-black/50"
              whileHover={{ scale: 1.05, borderColor: "rgba(212,255,0,0.6)" }}
              transition={springSnappy}
            >
              <span className="font-display text-sm font-bold text-nexus-lime">NX</span>
              <span className="absolute -inset-px bg-nexus-lime/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="font-display text-sm font-semibold tracking-[0.2em] text-white">
                NEXUS
              </p>
              <MicroLabel accent="cyan" className="text-[8px]">
                City OS v2.4
              </MicroLabel>
            </div>
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  custom={i}
                  variants={navItem}
                  initial={false}
                  animate={mounted && !reduceMotion ? "visible" : false}
                >
                  <Link
                    href={link.href}
                    className="group relative font-mono text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px w-0 bg-nexus-lime"
                      whileHover={{ width: "100%" }}
                      transition={springSnappy}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <StatusPill live={mounted && telemetryLive} />
              <motion.a
                href="#access"
                className="relative overflow-hidden border border-nexus-lime/40 bg-nexus-lime/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-nexus-lime"
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212,255,0,0.25)" }}
                whileTap={{ scale: 0.98 }}
                transition={springSnappy}
              >
                Initialize
              </motion.a>
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
                  <Link
                    href={link.href}
                    className="font-display text-4xl font-light text-white/90"
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <StatusPill live={mounted && telemetryLive} className="mt-4" />
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
}: {
  live: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-white/10 bg-black/30 px-3 py-1.5",
        className
      )}
    >
      <motion.span
        animate={live ? { opacity: [1, 0.3, 1] } : { opacity: 0.5 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Radio size={12} className="text-nexus-lime" />
      </motion.span>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
        {live ? "Live Feed" : "Standby"}
      </span>
    </div>
  );
}
