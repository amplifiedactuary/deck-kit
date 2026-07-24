"use client";

import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import type { ReactNode } from "react";

export const meta: SlideMeta = {
  id: "palette-insurance-navy",
  title: "Insurance navy",
  steps: 3,
  themes: [],
  group: "palettes",
  hasSafeMode: true,
};

/* ---------------------------------------------------------------- palette */

const NAVY = "#10243e";
const NAVY_DEEP = "#0a1830";
const GOLD = "#c9a227";
const GOLD_BRIGHT = "#dcb945";
const GOLD_FAINT = "rgba(201, 162, 39, 0.35)";
const IVORY = "#f7f5ef";
const MUTED = "#92a6c0";

const STATS = [
  { value: "20.4", label: "Revenue ($M)" },
  { value: "23", label: "Growth (%)" },
  { value: "84.2", label: "Customers (K)" },
  { value: "4.6", label: "Satisfaction" },
];

/* ------------------------------------------------------------- ornaments */

/** Hairline gold rule with a small centred lozenge — annual-report detailing. */
function GoldRule({ width }: { width: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height: 9 }}
    >
      <div
        className="absolute left-0 right-0"
        style={{ top: 4, height: 1, backgroundColor: GOLD_FAINT }}
      />
      <div
        style={{
          width: 9,
          height: 9,
          transform: "rotate(45deg)",
          backgroundColor: NAVY,
          border: `1px solid ${GOLD}`,
        }}
      />
    </div>
  );
}

/** Discreet heraldic shield watermark, low-opacity gold strokes. */
function ShieldWatermark() {
  return (
    <svg
      aria-hidden
      width={760}
      height={880}
      viewBox="0 0 380 440"
      fill="none"
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -52%)",
        opacity: 0.06,
      }}
    >
      {/* shield outline */}
      <path
        d="M190 14 L352 58 V222 C352 320 286 392 190 428 C94 392 28 320 28 222 V58 Z"
        stroke={GOLD}
        strokeWidth={3}
      />
      {/* inner border */}
      <path
        d="M190 40 L328 78 V218 C328 302 272 364 190 398 C108 364 52 302 52 218 V78 Z"
        stroke={GOLD}
        strokeWidth={1.5}
      />
      {/* chevron */}
      <path d="M70 230 L190 160 L310 230" stroke={GOLD} strokeWidth={3} />
      <path d="M70 262 L190 192 L310 262" stroke={GOLD} strokeWidth={1.5} />
      {/* pale (vertical bar) above chevron */}
      <line x1={190} y1={64} x2={190} y2={148} stroke={GOLD} strokeWidth={3} />
      {/* three charges, abstracted as lozenges */}
      <rect
        x={124}
        y={96}
        width={14}
        height={14}
        transform="rotate(45 131 103)"
        stroke={GOLD}
        strokeWidth={1.5}
      />
      <rect
        x={242}
        y={96}
        width={14}
        height={14}
        transform="rotate(45 249 103)"
        stroke={GOLD}
        strokeWidth={1.5}
      />
      <rect
        x={183}
        y={300}
        width={14}
        height={14}
        transform="rotate(45 190 307)"
        stroke={GOLD}
        strokeWidth={1.5}
      />
    </svg>
  );
}

/* --------------------------------------------------------- content blocks */

function Kicker() {
  return (
    <div className="flex flex-col items-center" style={{ gap: 26 }}>
      <GoldRule width={560} />
      <div
        className="font-mono"
        style={{
          fontSize: 26,
          letterSpacing: "0.42em",
          color: GOLD_BRIGHT,
          textIndent: "0.42em", // balances the trailing tracking
        }}
      >
        NORTHWIND INSURANCE · FY 2025
      </div>
    </div>
  );
}

function Headline() {
  return (
    <h1
      className="font-display text-center"
      style={{
        fontSize: 76,
        lineHeight: 1.18,
        fontWeight: 600,
        color: IVORY,
        maxWidth: 1400,
      }}
    >
      A year of disciplined growth,
      <br />
      delivered with confidence.
    </h1>
  );
}

function StatStrip() {
  return (
    <div className="flex items-stretch justify-center">
      {STATS.map((s, i) => (
        <div key={s.label} className="flex items-stretch">
          {i > 0 && (
            <div
              style={{
                width: 1,
                backgroundColor: GOLD_FAINT,
                marginTop: 18,
                marginBottom: 18,
              }}
            />
          )}
          <div
            className="flex flex-col items-center justify-center"
            style={{ width: 356, gap: 18 }}
          >
            <div
              className="font-display"
              style={{
                fontSize: 148,
                lineHeight: 1,
                fontWeight: 600,
                color: IVORY,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 21,
                letterSpacing: "0.28em",
                textIndent: "0.28em",
                color: GOLD,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClosingLine() {
  return (
    <div className="flex flex-col items-center" style={{ gap: 30 }}>
      <p
        className="text-center"
        style={{ fontSize: 32, lineHeight: 1.4, color: MUTED, maxWidth: 1100 }}
      >
        The foundation was trust. The outcome was retention.
      </p>
      <GoldRule width={560} />
    </div>
  );
}

/* ------------------------------------------------------------------ frame */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 1400px 900px at 50% 42%, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
      }}
    >
      <ShieldWatermark />
      {/* conservative page border */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 48,
          right: 48,
          top: 44,
          bottom: 44,
          border: "1px solid rgba(201, 162, 39, 0.22)",
        }}
      />
      <div
        className="relative flex h-full w-full flex-col items-center justify-center"
        style={{ gap: 72, paddingLeft: 120, paddingRight: 120 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ slide */

export default function Slide({ step, safeMode }: SlideProps) {
  if (safeMode) {
    // Distinct static poster: full final composition, no motion wrappers.
    return (
      <Frame>
        <Kicker />
        <Headline />
        <StatStrip />
        <ClosingLine />
      </Frame>
    );
  }

  return (
    <Frame>
      <Reveal show safeMode={safeMode}>
        <Kicker />
      </Reveal>
      <Reveal show safeMode={safeMode} delay={0.15}>
        <Headline />
      </Reveal>
      <Reveal show={step >= 1} safeMode={safeMode}>
        <StatStrip />
      </Reveal>
      <Reveal show={step >= 2} safeMode={safeMode}>
        <ClosingLine />
      </Reveal>
    </Frame>
  );
}
