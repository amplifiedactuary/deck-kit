"use client";

import { motion } from "framer-motion";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "type-variable-weight",
  title: "Weight as emphasis",
  steps: 5,
  themes: [],
  group: "typography",
  hasSafeMode: true,
};

/**
 * The statement, split into words. `emphasis` marks which spotlight step brings
 * this word to full black weight. Step 0 shows the whole line uniformly thin;
 * each subsequent step sweeps the heavy emphasis forward word by word; the final
 * step lets the entire line settle together into a confident medium weight.
 *
 * Words with emphasis 0 are connective tissue ("is", "the", ".") that never take
 * the spotlight — keeping the sweep landing on meaning-bearing words.
 */
const WORDS: { text: string; emphasis: number }[] = [
  { text: "Clarity", emphasis: 1 },
  { text: "is", emphasis: 0 },
  { text: "the", emphasis: 0 },
  { text: "new", emphasis: 2 },
  { text: "competitive", emphasis: 3 },
  { text: "advantage.", emphasis: 0 },
];

// Weight stops as numeric font-weights (100–900). The system font stack snaps these
// to discrete faces; a true variable font (next/font) would interpolate continuously.
const W_REST = 200; // thin resting weight for un-emphasised words
const W_HEAVY = 800; // near-black spotlight weight
const W_SETTLE = 500; // the calm medium the whole line lands on at the end

// Palette pulled from app/globals.css tokens.
const INK = "#e8edf5"; // --color-ink
const INK_SOFT = "#cfd6e2"; // settled, slightly softened ink
const REST_TONE = "#535d70"; // dim resting words, sits between --color-dim and --color-edge

/** Resolve the target font-weight for a word given the current step. */
function weightFor(emphasis: number, step: number, finalStep: number): number {
  if (step >= finalStep) return W_SETTLE; // everything settles together
  if (step === 0) return W_REST; // uniform thin opening
  return emphasis === step ? W_HEAVY : W_REST;
}

/** Spotlit words tighten their tracking slightly, reinforcing optical weight. */
function trackingFor(weight: number): string {
  return weight >= W_HEAVY ? "-0.02em" : "0.01em";
}

export default function Slide({ step, safeMode }: SlideProps) {
  const finalStep = meta.steps - 1;
  // SafeMode is a genuine static fallback: resolve the whole statement to its final
  // settled emphasis (no weight sweep), so the slide reads correctly with zero motion
  // — useful on slow projectors or when animation is undesirable.
  const effectiveStep = safeMode ? finalStep : step;
  const settled = effectiveStep >= finalStep;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-24 px-32">
      <p className="text-center font-display leading-[1.12]" style={{ fontSize: 152 }}>
        {WORDS.map((word, i) => {
          const target = weightFor(word.emphasis, effectiveStep, finalStep);
          const heavy = target >= W_HEAVY;
          return (
            <motion.span
              key={word.text + i}
              className="inline-block"
              style={{ marginRight: i === WORDS.length - 1 ? 0 : 30 }}
              initial={false}
              animate={{
                fontWeight: target,
                color: heavy ? INK : settled ? INK_SOFT : REST_TONE,
                letterSpacing: trackingFor(target),
                opacity: heavy || settled ? 1 : 0.78,
              }}
              transition={safeMode ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {word.text}
            </motion.span>
          );
        })}
      </p>

      <div
        className="font-mono uppercase"
        style={{ fontSize: 22, letterSpacing: "0.34em", color: REST_TONE }}
      >
        weight is a storytelling tool
      </div>
    </div>
  );
}
