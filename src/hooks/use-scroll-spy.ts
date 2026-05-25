"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/lib/navigation/sections";

/** Highlights nav item for the section occupying the viewport center band. */
export function useScrollSpy(): string {
  const [active, setActive] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-32% 0px -48% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
