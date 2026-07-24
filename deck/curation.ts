import type { Curation } from "@/lib/types";

/**
 * Per-slide curation, keyed by slide id. THIS is the churny file — ratings and
 * lineage change as the deck is curated; the stable ordering stays in deck.ts and
 * the slide folders are never touched. The `no` is a permanent, never-reused display
 * number (see Curation.no).
 *
 * The "why" behind each rating lives in your own feedback ledger — only the bucket
 * is mirrored here so the Overview gallery can float favourites to the top.
 */
export const curation: Record<string, Curation> = {
  // Layouts (1–6)
  "layout-big-statement": { no: "1", rating: "unrated" },
  "layout-split-before-after": { no: "2", rating: "unrated" },
  "layout-bento": { no: "3", rating: "unrated" },
  "layout-mosaic-2x2": { no: "4", rating: "unrated" },
  "layout-full-bleed": { no: "5", rating: "unrated" },
  "layout-poster": { no: "6", rating: "unrated" },

  // Data / metrics (7–13)
  "data-agents-line": { no: "7", rating: "unrated" },
  "data-bar-race": { no: "8", rating: "unrated" },
  "data-counter-wall": { no: "9", rating: "unrated" },
  "data-gauges": { no: "10", rating: "unrated" },
  "data-table-sort": { no: "11", rating: "unrated" },
  "data-calendar-heat": { no: "12", rating: "unrated" },
  "data-dot-grid": { no: "13", rating: "unrated" },

  // Diagrams / devices (14–20)
  "layout-hub-spoke": { no: "14", rating: "unrated" },
  "device-iceberg": { no: "15", rating: "unrated" },
  "device-flip-cards": { no: "16", rating: "unrated" },
  "device-scoreboard": { no: "17", rating: "unrated" },
  "device-ladder": { no: "18", rating: "unrated" },
  "device-reveal-stack": { no: "19", rating: "unrated" },
  "device-formula": { no: "20", rating: "unrated" },

  // Typography (21–24)
  "type-numerals": { no: "21", rating: "unrated" },
  "type-kinetic": { no: "22", rating: "unrated" },
  "type-serif-display": { no: "23", rating: "unrated" },
  "type-variable-weight": { no: "24", rating: "unrated" },

  // Palettes (25–26)
  "palette-insurance-navy": { no: "25", rating: "unrated" },
  "palette-bw-contrast": { no: "26", rating: "unrated" },

  // Chat (27)
  "chat-mobile-bubbles": { no: "27", rating: "unrated" },
};

/** Lookup helper — returns a safe default for any slide id not yet in the map. */
export function curationFor(id: string): Curation {
  return curation[id] ?? { no: "—", rating: "unrated" };
}
