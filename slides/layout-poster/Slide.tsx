"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "layout-poster",
  title: "Poster",
  steps: 3,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Poster constants — fixed 1920×1080 canvas, absolute px only.        */
/* High-contrast B/W treatment deliberately supersedes deck palette;   */
/* exactly ONE accent element (the strike bar).                        */
/* ------------------------------------------------------------------ */

const PAPER = "#000000";
const INK = "#FFFFFF";
const INK_DIM = "rgba(255, 255, 255, 0.55)";
const ACCENT = "#FF2D1F";

/** The colossal word. ~440px, tight tracking, bleeds off the left edge. */
const wordStyle: CSSProperties = {
  position: "absolute",
  left: -52,
  top: 296,
  margin: 0,
  fontSize: 440,
  lineHeight: 0.82,
  fontWeight: 800,
  letterSpacing: "-0.045em",
  color: INK,
  whiteSpace: "nowrap",
  userSelect: "none",
};

/** Full-bleed accent strike, cutting through the lower third of the letters. */
const strikeStyle: CSSProperties = {
  position: "absolute",
  left: -16,
  top: 514,
  width: 1952,
  height: 30,
  background: ACCENT,
};

/** The counter-scale subline: 14px against 440px is the whole drama. */
const sublineStyle: CSSProperties = {
  position: "absolute",
  left: 100,
  top: 752,
  fontSize: 14,
  letterSpacing: "0.34em",
  textTransform: "uppercase",
  color: INK,
  whiteSpace: "nowrap",
};

const cornerTopLeft: CSSProperties = {
  position: "absolute",
  left: 100,
  top: 88,
  fontSize: 14,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: INK_DIM,
};

const cornerBottomRight: CSSProperties = {
  position: "absolute",
  right: 100,
  bottom: 88,
  fontSize: 14,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: INK_DIM,
};

const SUBLINE =
  "Northwind Insurance · four product lines · 84,200 customers";
const CORNER_TL = "Northwind Insurance Group";
const CORNER_BR = "Nº 09 — FY 2025 Annual Review";

/* ------------------------------------------------------------------ */

/** Static poster: final state per step, no motion. Used in safeMode (and
 * therefore for overview thumbnails, which render the final step). */
function StaticPoster({ step }: { step: number }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: PAPER }}
    >
      <p className="font-mono" style={cornerTopLeft}>
        {CORNER_TL}
      </p>
      <h1 className="font-display" style={wordStyle}>
        GROWTH
      </h1>
      {step >= 2 && <div style={strikeStyle} />}
      {step >= 1 && (
        <p className="font-mono" style={sublineStyle}>
          {SUBLINE}
        </p>
      )}
      <p className="font-mono" style={cornerBottomRight}>
        {CORNER_BR}
      </p>
    </div>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  if (safeMode) {
    return <StaticPoster step={step} />;
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: PAPER }}
    >
      {/* Corner marks settle in quietly after the word has landed. */}
      <motion.p
        className="font-mono"
        style={cornerTopLeft}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        {CORNER_TL}
      </motion.p>

      {/* Step 0 — the word lands with weight: fast scale-down stamp. */}
      <motion.h1
        className="font-display"
        style={wordStyle}
        initial={{ opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        GROWTH
      </motion.h1>

      {/* Step 2 — the single accent gesture: a full-bleed strike. */}
      <motion.div
        style={{ ...strikeStyle, transformOrigin: "left center" }}
        initial={false}
        animate={{ scaleX: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.83, 0, 0.17, 1] }}
      />

      {/* Step 1 — the tiny counter-scale subline. */}
      <motion.p
        className="font-mono"
        style={sublineStyle}
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 8 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {SUBLINE}
      </motion.p>

      <motion.p
        className="font-mono"
        style={cornerBottomRight}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        {CORNER_BR}
      </motion.p>
    </div>
  );
}
