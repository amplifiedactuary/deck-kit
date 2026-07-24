"use client";

import type { CSSProperties } from "react";

import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "palette-bw-contrast",
  title: "Black / white",
  steps: 3,
  themes: [],
  group: "palettes",
  hasSafeMode: true,
};

/** Greys used sparingly for hierarchy — no hue anywhere on this slide. */
const INK = "#000000";
const PAPER = "#ffffff";
const GREY = "#595959";
const GREY_ON_BLACK = "#a6a6a6";

interface Stat {
  value: string;
  unit: string;
  desc: string;
  inverted?: boolean;
}

const STATS: Stat[] = [
  { value: "20.4", unit: "REVENUE $M", desc: "annual premium income" },
  { value: "91", unit: "RETENTION %", desc: "customers renewing each year" },
  { value: "84,200", unit: "CUSTOMERS", desc: "active policyholders" },
  { value: "23", unit: "GROWTH %", desc: "year-on-year revenue growth", inverted: true },
];

function Kicker() {
  return (
    <div>
      <div style={{ width: 64, height: 6, background: INK, marginBottom: 26 }} />
      <p
        className="font-mono"
        style={{
          fontSize: 22,
          letterSpacing: "0.38em",
          fontWeight: 600,
          color: INK,
        }}
      >
        NORTHWIND IN FOUR NUMBERS
      </p>
    </div>
  );
}

function Headline() {
  return (
    <h1
      className="font-display"
      style={{
        fontSize: 104,
        lineHeight: 1.04,
        fontWeight: 800,
        color: INK,
        maxWidth: 1480,
        marginTop: 40,
        letterSpacing: "-0.015em",
      }}
    >
      The portfolio grew.
      <br />
      So did the margin.
    </h1>
  );
}

function StatCell({ stat }: { stat: Stat }) {
  const inverted = stat.inverted === true;
  return (
    <div
      style={{
        flex: 1,
        background: inverted ? INK : PAPER,
        color: inverted ? PAPER : INK,
        padding: "44px 36px 40px",
        borderLeft: `2px solid ${INK}`,
      }}
    >
      <div
        className="font-display"
        style={{
          fontSize: 128,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {stat.value}
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: 19,
          letterSpacing: "0.3em",
          fontWeight: 600,
          marginTop: 22,
        }}
      >
        {stat.unit}
      </div>
      <div
        style={{
          fontSize: 21,
          marginTop: 10,
          color: inverted ? GREY_ON_BLACK : GREY,
        }}
      >
        {stat.desc}
      </div>
    </div>
  );
}

function StatStrip({ showInverted }: { showInverted: boolean }) {
  return (
    <div
      style={{
        marginTop: 92,
        width: 1680,
        borderTop: `4px solid ${INK}`,
        display: "flex",
      }}
    >
      {STATS.map((stat) => (
        <div
          key={stat.unit}
          style={{
            flex: 1,
            display: "flex",
            // Reserve the inverted cell's space before it appears, so the strip never reflows.
            visibility: stat.inverted && !showInverted ? "hidden" : "visible",
          }}
        >
          <StatCell stat={stat} />
        </div>
      ))}
    </div>
  );
}

function ClosingLine() {
  return (
    <p style={{ fontSize: 30, marginTop: 72, color: GREY }}>
      Same team. Same year.{" "}
      <span style={{ color: INK, fontWeight: 700 }}>
        Revenue up 23% while claims ratio fell to 59%.
      </span>
    </p>
  );
}

/** Shared white-canvas frame; all palette work happens in pure #000/#fff plus two greys. */
const FRAME: CSSProperties = {
  height: "100%",
  width: "100%",
  background: PAPER,
  color: INK,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "0 120px",
};

/** Distinct static markup for safeMode / overview thumbnails: no motion components at all. */
function StaticSlide({ step }: { step: number }) {
  return (
    <div style={FRAME}>
      <Kicker />
      <Headline />
      <div style={{ visibility: step >= 1 ? "visible" : "hidden" }}>
        <StatStrip showInverted={step >= 2} />
      </div>
      <div style={{ visibility: step >= 2 ? "visible" : "hidden" }}>
        <ClosingLine />
      </div>
    </div>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  if (safeMode) {
    return <StaticSlide step={step} />;
  }

  return (
    <div style={FRAME}>
      <Reveal show safeMode={false}>
        <Kicker />
        <Headline />
      </Reveal>
      <Reveal show={step >= 1} safeMode={false} y={36}>
        <StatStrip showInverted={step >= 2} />
      </Reveal>
      <Reveal show={step >= 2} safeMode={false} y={20} delay={0.12}>
        <ClosingLine />
      </Reveal>
    </div>
  );
}
