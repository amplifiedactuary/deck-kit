"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import type { SlideMeta, SlideProps } from "@/lib/types";
import { headlineKpis } from "@/lib/sampleData";

export const meta: SlideMeta = {
  id: "type-numerals",
  title: "Giant tabular numerals",
  steps: 4,
  themes: [],
  group: "typography",
  hasSafeMode: true,
};

interface Numeral {
  /** Numeric target the count-up animates toward. */
  value: number;
  /** Decimal places held in the figure. */
  decimals: number;
  /** Glyph kerned tight against the figure (e.g. × or h), or empty. */
  unit: string;
  /** Whether the unit hugs the number inline, or there is no inline unit. */
  unitInline: boolean;
  /** Small caption beneath the monument. */
  caption: string;
  /** Provenance tag rendered as an eyebrow. */
  tag: string;
}

// Headline KPIs from lib/sampleData.ts — fictional Northwind Insurance sample data.
const NUMERALS: Numeral[] = [
  {
    value: headlineKpis.revenueM,
    decimals: 1,
    unit: "M",
    unitInline: true,
    caption: "full-year revenue, across all product lines",
    tag: "FY2025 · total revenue",
  },
  {
    value: headlineKpis.growthPct,
    decimals: 0,
    unit: "%",
    unitInline: true,
    caption: "year-on-year growth — ahead of market benchmark",
    tag: "FY2025 · revenue growth",
  },
  {
    value: headlineKpis.customers,
    decimals: 0,
    unit: "",
    unitInline: false,
    caption: "active policyholders at year end",
    tag: "FY2025 · customers",
  },
  {
    value: headlineKpis.satisfaction,
    decimals: 1,
    unit: "",
    unitInline: false,
    caption: "average customer satisfaction score out of 5.0",
    tag: "FY2025 · CSAT",
  },
];

/** Format the running value with locked decimals + thousands grouping. */
function formatFigure(value: number, decimals: number): string {
  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toLocaleString("en-US");
}

/** Slightly longer count for bigger numbers, so each landing feels weighted. */
function countDuration(value: number): number {
  return 1.0 + Math.log10(Math.abs(value) + 1) * 0.32;
}

const FIGURE_CLASS =
  "font-display font-semibold leading-[0.82] tracking-[-0.02em] text-ink";
const UNIT_CLASS = "font-display font-medium text-accent align-baseline";

/** Animated monument: count-up driven by a MotionValue (no setState loops). */
function AnimatedFigure({ n, replayKey }: { n: Numeral; replayKey: number }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => formatFigure(v, n.decimals));

  useEffect(() => {
    const controls = animate(mv, n.value, {
      duration: countDuration(n.value),
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
    // replayKey forces a fresh count from 0 when the figure changes / slide replays.
  }, [mv, n.value, replayKey]);

  return (
    <span
      className={`${FIGURE_CLASS} text-[440px]`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <motion.span>{text}</motion.span>
      {n.unitInline && (
        <span className={`${UNIT_CLASS} ml-[18px] text-[200px]`}>{n.unit}</span>
      )}
    </span>
  );
}

/** safeMode monument: final value, no motion. */
function StaticFigure({ n }: { n: Numeral }) {
  return (
    <span
      className={`${FIGURE_CLASS} text-[440px]`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {formatFigure(n.value, n.decimals)}
      {n.unitInline && (
        <span className={`${UNIT_CLASS} ml-[18px] text-[200px]`}>{n.unit}</span>
      )}
    </span>
  );
}

export default function Slide({ step, safeMode, restartKey }: SlideProps) {
  // Clamp the active index to the declared step range.
  const idx = Math.min(Math.max(step, 0), NUMERALS.length - 1);
  const n = NUMERALS[idx];
  // A new key on every (index, restart) so the count-up re-runs cleanly.
  const replayKey = idx + restartKey * 100;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Eyebrow / provenance tag, top-left. */}
      <div className="absolute left-[96px] top-[88px] font-mono text-[24px] uppercase tracking-[0.34em] text-dim">
        {n.tag}
      </div>

      {/* Step pips, top-right — quiet index of where we are in the sequence. */}
      <div className="absolute right-[96px] top-[96px] flex items-center gap-4">
        {NUMERALS.map((item, i) => (
          <span
            key={item.tag}
            className="block h-[12px] rounded-full"
            style={{
              width: i === idx ? "40px" : "12px",
              background: i === idx ? "#7dd3fc" : "#2a3344",
            }}
          />
        ))}
      </div>

      {/* The monument: re-keyed per index so framer-motion remounts and recounts. */}
      <motion.div
        key={safeMode ? `static-${idx}` : `live-${replayKey}`}
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={safeMode ? false : { opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          safeMode ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="flex items-baseline">
          {safeMode ? (
            <StaticFigure n={n} />
          ) : (
            <AnimatedFigure n={n} replayKey={replayKey} />
          )}
        </div>

        {/* Caption beneath the figure, centred. */}
        <p className="mt-[40px] max-w-[1400px] text-center font-display text-[44px] font-medium text-dim">
          {n.caption}
        </p>
      </motion.div>
    </div>
  );
}
