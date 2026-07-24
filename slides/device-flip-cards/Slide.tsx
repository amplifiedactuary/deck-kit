"use client";

import { motion } from "framer-motion";
import type { SlideMeta, SlideProps } from "@/lib/types";
import data from "./data/pairs.json";

export const meta: SlideMeta = {
  id: "device-flip-cards",
  title: "Assumption flip-cards",
  steps: 8,
  themes: ["clarity", "evidence", "impact"],
  group: "devices",
  hasSafeMode: true,
};

const PAIRS = data.pairs;

/* ── geometry (1920×1080 canvas, absolute px) ───────────────────────── */
const GRID = { left: 196, top: 248, cols: 3, gap: 44 };
const CARD = { w: 480, h: 320 };

function cardPosition(i: number) {
  const col = i % GRID.cols;
  const row = Math.floor(i / GRID.cols);
  return {
    left: GRID.left + col * (CARD.w + GRID.gap),
    top: GRID.top + row * (CARD.h + GRID.gap),
  };
}

/* ── card faces (shared by animated + safe-mode branches) ───────────── */

function CardFront({ tag, front }: { tag: string; front: string }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-between rounded-2xl border border-edge bg-panel"
      style={{
        padding: 40,
        boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
        backfaceVisibility: "hidden",
      }}
    >
      <span
        className="font-mono uppercase text-dim"
        style={{ fontSize: 22, letterSpacing: 4 }}
      >
        Assume · {tag}
      </span>
      <p
        className="font-display font-medium text-ink"
        style={{ fontSize: 42, lineHeight: 1.22, opacity: 0.82 }}
      >
        {front}
      </p>
      <span className="font-mono text-dim" style={{ fontSize: 20, opacity: 0.6 }}>
        what you assume
      </span>
    </div>
  );
}

function CardBack({ tag, back }: { tag: string; back: string }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-between rounded-2xl border bg-panel"
      style={{
        padding: 40,
        borderColor: "var(--color-amber)",
        boxShadow: "0 0 36px rgba(251,191,36,0.32), 0 18px 40px rgba(0,0,0,0.5)",
        backgroundImage:
          "linear-gradient(160deg, rgba(251,191,36,0.10) 0%, rgba(251,191,36,0.02) 60%)",
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        position: "absolute",
        inset: 0,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 22, letterSpacing: 4, color: "var(--color-amber)" }}
      >
        Actually · {tag}
      </span>
      <p
        className="font-display font-semibold text-ink"
        style={{ fontSize: 42, lineHeight: 1.22 }}
      >
        {back}
      </p>
      <span
        className="font-mono"
        style={{ fontSize: 20, color: "var(--color-amber)", opacity: 0.8 }}
      >
        what actually happened
      </span>
    </div>
  );
}

/** One flip card. `flipped` is derived purely from `step` — no setState. */
function FlipCard({
  pair,
  index,
  flipped,
  safeMode,
}: {
  pair: (typeof PAIRS)[number];
  index: number;
  flipped: boolean;
  safeMode: boolean;
}) {
  const pos = cardPosition(index);

  // Safe mode: no 3D animation. Render genuinely distinct static markup — the
  // back (revealed) face when flipped, the front otherwise — with no rotateY.
  if (safeMode) {
    return (
      <div className="absolute" style={{ ...pos, width: CARD.w, height: CARD.h }}>
        {flipped ? (
          <StaticBack tag={pair.tag} back={pair.back} />
        ) : (
          <CardFront tag={pair.tag} front={pair.front} />
        )}
      </div>
    );
  }

  return (
    <div
      className="absolute"
      style={{ ...pos, width: CARD.w, height: CARD.h, perspective: 1600 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <CardFront tag={pair.tag} front={pair.front} />
        <CardBack tag={pair.tag} back={pair.back} />
      </motion.div>
    </div>
  );
}

/** Flat (un-rotated) version of the back face for safe-mode static rendering. */
function StaticBack({ tag, back }: { tag: string; back: string }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-between rounded-2xl border bg-panel"
      style={{
        padding: 40,
        borderColor: "var(--color-amber)",
        boxShadow: "0 0 36px rgba(251,191,36,0.32), 0 18px 40px rgba(0,0,0,0.5)",
        backgroundImage:
          "linear-gradient(160deg, rgba(251,191,36,0.10) 0%, rgba(251,191,36,0.02) 60%)",
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 22, letterSpacing: 4, color: "var(--color-amber)" }}
      >
        Actually · {tag}
      </span>
      <p
        className="font-display font-semibold text-ink"
        style={{ fontSize: 42, lineHeight: 1.22 }}
      >
        {back}
      </p>
      <span
        className="font-mono"
        style={{ fontSize: 20, color: "var(--color-amber)", opacity: 0.8 }}
      >
        what actually happened
      </span>
    </div>
  );
}

function Header({ revealedCount }: { revealedCount: number }) {
  return (
    <div className="absolute left-0 top-0 w-full text-center" style={{ paddingTop: 72 }}>
      <p
        className="font-mono uppercase text-accent"
        style={{ fontSize: 24, letterSpacing: 8, marginBottom: 14 }}
      >
        what you assume · what actually happened
      </p>
      <h1
        className="font-display font-semibold text-ink"
        style={{ fontSize: 88, lineHeight: 1, letterSpacing: 1 }}
      >
        The business assumption <span className="text-amber">flips</span>
      </h1>
      <p className="font-mono text-dim" style={{ fontSize: 26, marginTop: 18 }}>
        {revealedCount} / {PAIRS.length} assumptions turned over
      </p>
    </div>
  );
}

function Footer() {
  return (
    <p
      className="absolute w-full text-center font-mono text-dim"
      style={{ bottom: 26, fontSize: 19, opacity: 0.7 }}
    >
      fictional sample data · Northwind Insurance · assumption↔reality pairs are illustrative
    </p>
  );
}

/* ── slide ──────────────────────────────────────────────────────────── */

export default function Slide({ step, safeMode }: SlideProps) {
  // step 0 → all front; step k (1..6) → first k cards flipped; step 7 → all flipped.
  const flippedCount = Math.min(step, PAIRS.length);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Header revealedCount={flippedCount} />

      {PAIRS.map((pair, i) => (
        <FlipCard
          key={pair.tag}
          pair={pair}
          index={i}
          flipped={i < flippedCount}
          safeMode={safeMode}
        />
      ))}

      <Footer />
    </div>
  );
}
