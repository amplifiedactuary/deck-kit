"use client";

import { motion, type Variants } from "framer-motion";

import type { SlideMeta, SlideProps } from "@/lib/types";
import {
  PHRASES,
  STATEMENT,
  type KineticPhrase,
  type KineticWord,
  type Vector,
} from "./data/script";

export const meta: SlideMeta = {
  id: "type-kinetic",
  title: "Kinetic typography",
  steps: 2,
  themes: [],
  group: "typography",
  hasSafeMode: true,
};

// ── Design tokens (absolute px on the 1920×1080 canvas) ──────────────────────
const SIZE_PX: Record<NonNullable<KineticWord["size"]>, number> = {
  sm: 88,
  md: 132,
  lg: 168,
  xl: 232,
};

const WEIGHT: Record<NonNullable<KineticWord["weight"]>, number> = {
  light: 300,
  normal: 400,
  semibold: 600,
  bold: 800,
};

const TONE: Record<NonNullable<KineticWord["tone"]>, string> = {
  ink: "var(--color-ink)",
  dim: "var(--color-dim)",
  accent: "var(--color-accent)",
  amber: "var(--color-amber)",
};

// Each entrance vector defines where a word travels FROM as it settles to rest.
const VECTOR_FROM: Record<
  Vector,
  { x?: number; y?: number; scale?: number; filter?: string }
> = {
  up: { y: 120 },
  drop: { y: -120 },
  left: { x: -180 },
  right: { x: 180 },
  scale: { scale: 0.4, y: 30 },
  blur: { filter: "blur(22px)", y: 24, scale: 1.08 },
};

const REST = { x: 0, y: 0, scale: 1, filter: "blur(0px)" };

// Container drives the per-word stagger; words land left→right, with the
// hero word delayed so it settles last (the musical "drop").
const containerVariants: Variants = {
  hidden: {},
  shown: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

function wordVariants(word: KineticWord): Variants {
  const from = VECTOR_FROM[word.vector];
  return {
    hidden: { opacity: 0, ...REST, ...from },
    shown: {
      opacity: 1,
      ...REST,
      transition: {
        // Hero word lands a beat later and with a softer, weightier curve.
        duration: word.hero ? 1.05 : 0.72,
        ease: word.hero ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
        delay: word.hero ? 0.28 : 0,
      },
    },
  };
}

function PhraseLine({
  phrase,
  active,
  safeMode,
}: {
  phrase: KineticPhrase;
  active: boolean;
  safeMode: boolean;
}) {
  return (
    <motion.div
      // Re-keying on `active` replays the choreography when the step lands.
      key={`${phrase.step}-${active ? "on" : "off"}`}
      className="flex flex-wrap items-baseline justify-center"
      style={{ gap: "0 36px", lineHeight: 1.02 }}
      variants={containerVariants}
      initial={safeMode ? "shown" : "hidden"}
      animate={active || safeMode ? "shown" : "hidden"}
    >
      {phrase.words.map((word, i) => (
        <motion.span
          key={`${word.text}-${i}`}
          className="font-display"
          variants={safeMode ? undefined : wordVariants(word)}
          style={{
            display: "inline-block",
            fontSize: SIZE_PX[word.size ?? "lg"],
            fontWeight: WEIGHT[word.weight ?? "semibold"],
            color: TONE[word.tone ?? "ink"],
            letterSpacing: "-0.025em",
            // Hero word gets a faint amber glow so it reads as the landing point.
            textShadow: word.hero
              ? "0 0 60px rgba(251, 191, 36, 0.28)"
              : undefined,
          }}
        >
          {word.text}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Ambient backdrop — a soft radial keeps large type off a flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% 42%, rgba(125,211,252,0.07), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center" style={{ gap: 56 }}>
        {PHRASES.map((phrase) => (
          <PhraseLine
            key={phrase.step}
            phrase={phrase}
            active={step >= phrase.step}
            safeMode={safeMode}
          />
        ))}
      </div>

      {/* Static-fallback accessibility caption (visually hidden). */}
      {safeMode && <span className="sr-only">{STATEMENT.join(" ")}</span>}
    </div>
  );
}
