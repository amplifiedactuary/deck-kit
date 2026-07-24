import type { ComponentType } from "react";

/** 1 = forward navigation, -1 = backward. Slides may use it for animation hints. */
export type Direction = 1 | -1;

/** The contract every slide component receives. */
export interface SlideProps {
  /** Current step within this slide, 0-based. */
  step: number;
  /** Total steps this slide declared in its meta. */
  totalSteps: number;
  /** True when this slide is the one on screen (false in overview mini-renders). */
  isActive: boolean;
  direction: Direction;
  /** Starts at 0; increments each time the presenter triggers a replay (R) — remounts the slide. */
  restartKey: number;
  /** When true, render a static (no/minimal animation) version. Simple slides may ignore it. */
  safeMode: boolean;
}

/** The metadata every slide module exports alongside its component. */
export interface SlideMeta {
  /** Kebab-case, matches the folder name under slides/. */
  id: string;
  /** Shown in overview mode. */
  title: string;
  /** Step count, >= 1. A slide with no internal steps has steps: 1. */
  steps: number;
  /** Theme ids (from deck/themes.ts) this slide touches. Empty array is fine. */
  themes: string[];
  /**
   * Optional overview-gallery section (kebab-case, e.g. "layouts"). Slides with the
   * same group render under one heading in Overview; ungrouped slides appear first.
   * Has no effect on presentation order — that stays owned by deck/deck.ts.
   */
  group?: string;
  /** True if the slide provides a distinct static fallback when safeMode is on. */
  hasSafeMode: boolean;
}

/** One entry in the deck registry. */
export interface DeckEntry {
  meta: SlideMeta;
  Component: ComponentType<SlideProps>;
}

/** Optional gallery rating buckets for triaging slide forms.
 *  "pass" = seen and rejected (distinct from "unrated" = not yet looked at). */
export type Rating = "loved" | "maybe" | "inspiration" | "pass" | "unrated";

/**
 * Per-slide curation metadata — a separate, frequently-edited concern from the
 * stable ordering in deck/deck.ts. Lives in deck/curation.ts, keyed by slide id,
 * so the slide folders and the registry stay untouched as ratings churn.
 */
export interface Curation {
  /** Stable display number shown in the corner badge and on Overview cards. */
  no: string;
  /** Curation bucket; defaults to "unrated". */
  rating: Rating;
  /** For a built variation: the slide id of the form it descends from. */
  variantOf?: string;
  /** Optional free-form tag linking a slide to a section of your deck. */
  servesSegment?: string;
  /**
   * Marks a slide as part of your curated deck (vs. an exploratory gallery
   * form). Curated slides surface in the dedicated Overview view and the
   * curated-only present path; exploration forms recede. Absent = exploration.
   */
  track?: "talk";
}
