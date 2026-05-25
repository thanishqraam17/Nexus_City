/** Canonical section registry for scroll targeting and scrollspy. */

export const SCROLL_OFFSET = 88;

export interface NavSection {
  id: string;
  label: string;
  /** Nav label when different from section title */
  navLabel?: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview", navLabel: "Overview" },
  { id: "intelligence", label: "Intelligence" },
  { id: "neural-map", label: "Neural Map" },
  { id: "terminal", label: "Command Terminal", navLabel: "Command" },
  { id: "access", label: "Access" },
];

export const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

export function getSectionIdFromHash(hash: string): string | null {
  const id = hash.replace(/^#/, "");
  return SECTION_IDS.includes(id) ? id : null;
}
