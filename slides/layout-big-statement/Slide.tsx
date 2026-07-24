"use client";

import { motion } from "framer-motion";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "layout-big-statement",
  title: "Big statement",
  steps: 5,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/**
 * PLACEHOLDER spine sentence (invented for the layout lab, not talk content).
 * One sentence, four typographic chunks — one chunk lands per step.
 */
const CHUNKS = [
  { text: "The customer", size: 168, accent: false },
  { text: "is never", size: 168, accent: false },
  { text: "the problem.", size: 168, accent: false },
  { text: "Clarity is.", size: 220, accent: true },
];

const KICKER = "northwind insurance";
const FOOTER = "one insurer · four product lines · 84,200 customers served";

/** Step at which the closing rule + footer land (after all chunks). */
const FOOTER_STEP = CHUNKS.length;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Centered big-statement layout. The newest chunk carries full emphasis;
 * previously revealed chunks dim and shrink slightly so attention always
 * rides the most recent words. The final step settles the poster with a
 * hairline rule and a one-line footer.
 */
export default function Slide({ step, safeMode }: SlideProps) {
  // Index of the chunk currently carrying emphasis. Once the footer step
  // arrives, the last chunk keeps the emphasis so the poster stays strong.
  const currentChunk = Math.min(step, CHUNKS.length - 1);
  const footerShown = step >= FOOTER_STEP;

  if (safeMode) {
    return (
      <StaticStatement currentChunk={currentChunk} footerShown={footerShown} step={step} />
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      style={{ paddingLeft: 160, paddingRight: 160 }}
    >
      {/* Kicker — bright with the first chunk, recedes once the sentence builds. */}
      <motion.p
        className="font-mono uppercase text-dim"
        style={{ fontSize: 26, letterSpacing: 14, marginBottom: 56 }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: step >= 1 ? 0.45 : 0.9, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {KICKER}
      </motion.p>

      {/* The statement. */}
      <div className="flex flex-col items-center" style={{ gap: 18 }}>
        {CHUNKS.map((chunk, i) => {
          const revealed = step >= i;
          const isCurrent = revealed && i === currentChunk;
          return (
            <motion.div
              key={chunk.text}
              className={`font-display font-semibold ${
                chunk.accent ? "text-accent" : "text-ink"
              }`}
              style={{
                fontSize: chunk.size,
                lineHeight: 0.95,
                letterSpacing: -3,
                whiteSpace: "nowrap",
                transformOrigin: "center",
              }}
              initial={{ opacity: 0, y: 44, scale: 1 }}
              animate={
                !revealed
                  ? { opacity: 0, y: 44, scale: 1 }
                  : isCurrent
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0.34, y: 0, scale: 0.96 }
              }
              transition={{ duration: 0.65, ease: EASE }}
            >
              {chunk.text}
            </motion.div>
          );
        })}
      </div>

      {/* Closing hairline + footer — the settle beat. Fixed height: no reflow. */}
      <div
        className="flex flex-col items-center"
        style={{ marginTop: 72, gap: 28, height: 80 }}
      >
        <motion.div
          className="bg-edge"
          style={{ height: 1, transformOrigin: "center" }}
          initial={{ width: 0, opacity: 0 }}
          animate={footerShown ? { width: 560, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.p
          className="font-mono text-dim"
          style={{ fontSize: 24, letterSpacing: 4 }}
          initial={{ opacity: 0, y: 14 }}
          animate={footerShown ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.6, ease: EASE, delay: footerShown ? 0.25 : 0 }}
        >
          {FOOTER}
        </motion.p>
      </div>
    </div>
  );
}

/** Distinct static markup for safeMode — no motion components at all. */
function StaticStatement({
  currentChunk,
  footerShown,
  step,
}: {
  currentChunk: number;
  footerShown: boolean;
  step: number;
}) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      style={{ paddingLeft: 160, paddingRight: 160 }}
    >
      <p
        className="font-mono uppercase text-dim"
        style={{
          fontSize: 26,
          letterSpacing: 14,
          marginBottom: 56,
          opacity: step >= 1 ? 0.45 : 0.9,
        }}
      >
        {KICKER}
      </p>
      <div className="flex flex-col items-center" style={{ gap: 18 }}>
        {CHUNKS.map((chunk, i) => {
          const revealed = step >= i;
          const isCurrent = revealed && i === currentChunk;
          return (
            <div
              key={chunk.text}
              className={`font-display font-semibold ${
                chunk.accent ? "text-accent" : "text-ink"
              }`}
              style={{
                fontSize: chunk.size,
                lineHeight: 0.95,
                letterSpacing: -3,
                whiteSpace: "nowrap",
                opacity: !revealed ? 0 : isCurrent ? 1 : 0.34,
                transform: revealed && !isCurrent ? "scale(0.96)" : undefined,
                transformOrigin: "center",
              }}
            >
              {chunk.text}
            </div>
          );
        })}
      </div>
      <div
        className="flex flex-col items-center"
        style={{ marginTop: 72, gap: 28, height: 80 }}
      >
        <div
          className="bg-edge"
          style={{ height: 1, width: 560, opacity: footerShown ? 1 : 0 }}
        />
        <p
          className="font-mono text-dim"
          style={{ fontSize: 24, letterSpacing: 4, opacity: footerShown ? 0.85 : 0 }}
        >
          {FOOTER}
        </p>
      </div>
    </div>
  );
}
