"use client";

import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "type-serif-display",
  title: "Serif display — trials",
  steps: 3,
  themes: [],
  group: "typography",
  hasSafeMode: false,
};

/**
 * A web-safe serif DISPLAY stack. No font files shipped: these faces ship with
 * the OS, so the slide renders identically offline at presentation time.
 * To drop in a real self-hosted display serif, see notes.md → "Templatise".
 */
const SERIF =
  "Georgia, 'Iowan Old Style', 'Apple Garamond', 'Times New Roman', 'Source Serif 4', ui-serif, serif";

/** Refined ligatures / kerning for display-scale serif. */
const REFINED: CSSProperties = {
  fontFamily: SERIF,
  fontFeatureSettings: "'liga' 1, 'dlig' 1, 'kern' 1, 'calt' 1",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
};

export default function Slide({ step, safeMode }: SlideProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-center px-[180px]">
      {/* faint rules to anchor the editorial measure */}
      <div className="pointer-events-none absolute inset-x-[180px] top-[150px] h-px bg-edge/60" />
      <div className="pointer-events-none absolute inset-x-[180px] bottom-[150px] h-px bg-edge/60" />

      {/* masthead eyebrow */}
      <Reveal show safeMode={safeMode}>
        <div
          className="mb-12 text-[22px] text-dim"
          style={{
            ...REFINED,
            fontVariant: "small-caps",
            letterSpacing: "0.42em",
            fontStyle: "italic",
          }}
        >
          A Specimen · Display Serif Trials
        </div>
      </Reveal>

      {/* TRIAL 1 — giant headline with drop cap (step 0) */}
      <Reveal show safeMode={safeMode}>
        <h1
          className="text-ink"
          style={{
            ...REFINED,
            fontSize: "150px",
            lineHeight: 0.96,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            maxWidth: "1380px",
          }}
        >
          <span
            style={{
              float: "left",
              fontSize: "228px",
              lineHeight: 0.74,
              paddingRight: "26px",
              marginTop: "14px",
              fontWeight: 500,
              color: "var(--color-amber)",
            }}
          >
            T
          </span>
          he quiet authority of a serif set large.
        </h1>
      </Reveal>

      {/* TRIAL 2 — italic pull-line, lighter weight (step 1) */}
      <Reveal show={step >= 1} safeMode={safeMode} delay={0.05}>
        <p
          className="mt-14 text-dim"
          style={{
            ...REFINED,
            fontSize: "52px",
            lineHeight: 1.32,
            fontStyle: "italic",
            fontWeight: 300,
            maxWidth: "1240px",
          }}
        >
          Set in generous measure, an old serif still reads as{" "}
          <span className="text-ink" style={{ fontStyle: "normal", fontWeight: 500 }}>
            craft
          </span>
          —not nostalgia.
        </p>
      </Reveal>

      {/* TRIAL 3 — small-caps colophon line, heavier display cut (step 2) */}
      <Reveal show={step >= 2} safeMode={safeMode} delay={0.1}>
        <div className="mt-16 flex items-baseline gap-10">
          <span
            className="text-accent"
            style={{
              ...REFINED,
              fontSize: "40px",
              fontWeight: 600,
              fontVariant: "small-caps",
              letterSpacing: "0.18em",
            }}
          >
            Roman · Italic · Small-Caps
          </span>
          <span
            className="text-dim"
            style={{ ...REFINED, fontSize: "30px", fontStyle: "italic" }}
          >
            three cuts, one voice
          </span>
        </div>
      </Reveal>
    </div>
  );
}
