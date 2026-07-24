"use client";

import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import metrics from "./data/metrics.json";

export const meta: SlideMeta = {
  id: "device-scoreboard",
  title: "Device — scoreboard",
  steps: 4,
  themes: [],
  group: "devices",
  hasSafeMode: true,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Scoreboard digits get a flat, mechanical look — fixed width, tabular figures. */
const SCORE: CSSProperties = {
  fontVariantNumeric: "tabular-nums",
  fontWeight: 700,
  letterSpacing: "0.01em",
};

/**
 * Period motif — four "quarters" map onto the four steps so the slide reads
 * like a game clock advancing. Q1 sets the stage, Q2 lights the target side,
 * Q3 lights the actual side, Q4 posts the final uplift ratio.
 */
const PERIODS = ["Q1", "Q2", "Q3", "Q4"];

/**
 * Count-up driven by framer-motion's imperative `animate()` on a MotionValue.
 * This is ESLint-safe: no synchronous setState inside the effect — the motion
 * value is mutated by the animation loop, and the DOM text updates via a
 * subscription that framer manages internally (motion.span children).
 */
function ScoreNumber({
  target,
  active,
  decimals = 1,
  fontSize,
  color,
}: {
  target: number;
  active: boolean;
  decimals?: number;
  fontSize: number;
  color: string;
}) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    const controls = animate(mv, active ? target : 0, {
      duration: active ? 1.1 : 0,
      ease: EASE,
    });
    return controls.stop;
  }, [mv, target, active]);

  return (
    <motion.span
      className={color}
      style={{ ...SCORE, fontSize, display: "inline-block" }}
    >
      {text}
    </motion.span>
  );
}

function Kicker() {
  return (
    <div
      className="absolute font-mono text-dim"
      style={{ left: 64, top: 52, fontSize: 17, letterSpacing: "0.3em" }}
    >
      NORTHWIND INSURANCE · FULL-YEAR SCOREBOARD
    </div>
  );
}

/** The lit period indicator — a row of quarter chips, the current one glowing. */
function PeriodStrip({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 18 }}>
      {PERIODS.map((p, i) => {
        const on = i <= current;
        const live = i === current;
        return (
          <div
            key={p}
            className="font-mono"
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.18em",
              padding: "8px 20px",
              borderRadius: 8,
              border: `1.5px solid ${live ? "#fbbf24" : on ? "#1d2533" : "#10141c"}`,
              color: live ? "#fbbf24" : on ? "#e8edf5" : "#3a4252",
              background: live ? "rgba(251,191,36,0.08)" : "transparent",
              transition: "color .4s, border-color .4s, background .4s",
            }}
          >
            {p}
          </div>
        );
      })}
    </div>
  );
}

/** One team's panel: label plate over a giant scoreboard number. */
function TeamPanel({
  label,
  unit,
  accent,
  number,
  footnote,
  align,
}: {
  label: string;
  unit: string;
  accent: string;
  number: ReactNode;
  footnote: string;
  align: "left" | "right";
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        width: 700,
        alignItems: align === "left" ? "flex-start" : "flex-end",
        gap: 26,
      }}
    >
      {/* Team plate */}
      <div
        className="font-mono"
        style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: accent,
          borderBottom: `2px solid ${accent}`,
          paddingBottom: 12,
        }}
      >
        {label}
      </div>

      {/* Big number on its scoreboard plate */}
      <div
        className="flex items-baseline"
        style={{
          gap: 18,
          padding: "28px 40px",
          borderRadius: 18,
          background: "#10141c",
          border: "1px solid #1d2533",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
          flexDirection: align === "left" ? "row" : "row-reverse",
        }}
      >
        {number}
        <span
          className="text-dim font-mono"
          style={{ fontSize: 40, fontWeight: 600 }}
        >
          {unit}
        </span>
      </div>

      <div
        className="text-dim font-mono"
        style={{ fontSize: 21, textAlign: align }}
      >
        {footnote}
      </div>
    </div>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  if (safeMode) return <StaticPoster />;
  return <LiveSlide step={step} />;
}

function LiveSlide({ step }: { step: number }) {
  // Target side lights on step 1, actual side on step 2, ratio on step 3.
  const targetActive = step >= 1;
  const actualActive = step >= 2;
  const ratioActive = step >= 3;

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <Kicker />

      <div style={{ height: 84 }} />

      {/* Scoreboard header band */}
      <Reveal show safeMode={false}>
        <div
          className="font-display text-ink"
          style={{ fontSize: 40, fontWeight: 600, letterSpacing: "0.02em" }}
        >
          The year, on the scoreboard
        </div>
      </Reveal>

      <div style={{ height: 28 }} />

      <PeriodStrip current={step} />

      <div style={{ height: 16 }} />

      {/* The two sides, divided by a centre VS column. */}
      <div
        className="flex w-full items-stretch justify-center"
        style={{ gap: 56, flex: 1, paddingTop: 24 }}
      >
        <TeamPanel
          label="ANNUAL TARGET"
          unit="$M"
          accent="#fbbf24"
          align="right"
          footnote="board-approved full-year revenue target"
          number={
            <ScoreNumber
              target={metrics.targetRevenue}
              active={targetActive}
              fontSize={150}
              color="text-amber"
            />
          }
        />

        {/* Centre column: VS + score ratio. */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: 320, gap: 18 }}
        >
          <div
            className="font-display text-dim"
            style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.3em" }}
          >
            VS
          </div>

          <div
            style={{
              width: 1.5,
              flex: 1,
              maxHeight: 180,
              background:
                "linear-gradient(180deg, transparent, #1d2533 30%, #1d2533 70%, transparent)",
            }}
          />

          {/* Score ratio — the final beat. */}
          <Reveal show={ratioActive} safeMode={false} delay={0.15}>
            <div className="flex flex-col items-center" style={{ gap: 6 }}>
              <div
                className="font-mono text-dim"
                style={{ fontSize: 16, letterSpacing: "0.28em" }}
              >
                UPLIFT
              </div>
              <ScoreNumberSuffix active={ratioActive} />
            </div>
          </Reveal>
        </div>

        <TeamPanel
          label="ACTUAL REVENUE"
          unit="$M"
          accent="#7dd3fc"
          align="left"
          footnote="delivered full-year revenue · FY2025"
          number={
            <ScoreNumber
              target={metrics.actualRevenue}
              active={actualActive}
              fontSize={150}
              color="text-accent"
            />
          }
        />
      </div>

      {/* Final-step caption ties the ratio to its meaning. */}
      <div style={{ height: 56 }} />
      <div style={{ height: 60 }}>
        <Reveal show={ratioActive} safeMode={false} delay={0.4}>
          <div
            className="font-mono text-dim"
            style={{ fontSize: 24, textAlign: "center" }}
          >
            <span className="text-amber" style={{ fontWeight: 700 }}>
              +{metrics.growthPct}%
            </span>{" "}
            — revenue beat target by ${(metrics.actualRevenue - metrics.targetRevenue).toFixed(1)}M
          </div>
        </Reveal>
      </div>

      <div
        className="absolute font-mono text-dim"
        style={{ left: 64, bottom: 48, fontSize: 17 }}
      >
        Northwind Insurance · target ${metrics.targetRevenue}M vs actual ${metrics.actualRevenue}M
      </div>
    </div>
  );
}

/** The %-suffixed uplift number for the centre UPLIFT plate. */
function ScoreNumberSuffix({ active }: { active: boolean }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toFixed(0));

  useEffect(() => {
    const controls = animate(mv, active ? metrics.growthPct : 0, {
      duration: active ? 1.0 : 0,
      ease: EASE,
    });
    return controls.stop;
  }, [mv, active]);

  return (
    <div className="flex items-baseline">
      <span
        className="text-ink font-mono"
        style={{ fontSize: 40, fontWeight: 700 }}
      >
        +
      </span>
      <motion.span
        className="text-ink"
        style={{ ...SCORE, fontSize: 88, display: "inline-block" }}
      >
        {text}
      </motion.span>
      <span
        className="text-ink"
        style={{ ...SCORE, fontSize: 64 }}
      >
        %
      </span>
    </div>
  );
}

/**
 * Distinct static markup for safeMode — a clean poster of the final state:
 * both teams at their final numbers, the uplift posted, Q4 lit.
 */
function StaticPoster() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <Kicker />

      <div
        className="font-display text-ink"
        style={{ fontSize: 40, fontWeight: 600, letterSpacing: "0.02em" }}
      >
        The year, on the scoreboard
      </div>

      <div style={{ height: 28 }} />
      <PeriodStrip current={3} />
      <div style={{ height: 40 }} />

      <div
        className="flex items-stretch justify-center"
        style={{ gap: 56 }}
      >
        <PosterTeam
          label="ANNUAL TARGET"
          value={metrics.targetRevenue.toFixed(1)}
          unit="$M"
          accent="#fbbf24"
          color="text-amber"
          align="right"
          footnote="board-approved full-year revenue target"
        />

        <div
          className="flex flex-col items-center justify-center"
          style={{ width: 320, gap: 16 }}
        >
          <div
            className="font-display text-dim"
            style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.3em" }}
          >
            VS
          </div>
          <div
            style={{
              width: 1.5,
              height: 150,
              background:
                "linear-gradient(180deg, transparent, #1d2533 30%, #1d2533 70%, transparent)",
            }}
          />
          <div className="flex flex-col items-center" style={{ gap: 6 }}>
            <div
              className="font-mono text-dim"
              style={{ fontSize: 16, letterSpacing: "0.28em" }}
            >
              UPLIFT
            </div>
            <div className="flex items-baseline">
              <span
                className="text-ink font-mono"
                style={{ fontSize: 40, fontWeight: 700 }}
              >
                +
              </span>
              <span
                className="text-ink"
                style={{ ...SCORE, fontSize: 88 }}
              >
                {metrics.growthPct}
              </span>
              <span className="text-ink" style={{ ...SCORE, fontSize: 64 }}>
                %
              </span>
            </div>
          </div>
        </div>

        <PosterTeam
          label="ACTUAL REVENUE"
          value={metrics.actualRevenue.toFixed(1)}
          unit="$M"
          accent="#7dd3fc"
          color="text-accent"
          align="left"
          footnote="delivered full-year revenue · FY2025"
        />
      </div>

      <div style={{ height: 56 }} />
      <div
        className="font-mono text-dim"
        style={{ fontSize: 24, textAlign: "center" }}
      >
        <span className="text-amber" style={{ fontWeight: 700 }}>
          +{metrics.growthPct}%
        </span>{" "}
        — revenue beat target by ${(metrics.actualRevenue - metrics.targetRevenue).toFixed(1)}M
      </div>

      <div
        className="absolute font-mono text-dim"
        style={{ left: 64, bottom: 48, fontSize: 17 }}
      >
        Northwind Insurance · target ${metrics.targetRevenue}M vs actual ${metrics.actualRevenue}M
      </div>
    </div>
  );
}

function PosterTeam({
  label,
  value,
  unit,
  accent,
  color,
  align,
  footnote,
}: {
  label: string;
  value: string;
  unit: string;
  accent: string;
  color: string;
  align: "left" | "right";
  footnote: string;
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        width: 700,
        alignItems: align === "left" ? "flex-start" : "flex-end",
        gap: 26,
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: accent,
          borderBottom: `2px solid ${accent}`,
          paddingBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        className="flex items-baseline"
        style={{
          gap: 18,
          padding: "28px 40px",
          borderRadius: 18,
          background: "#10141c",
          border: "1px solid #1d2533",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
          flexDirection: align === "left" ? "row" : "row-reverse",
        }}
      >
        <span className={color} style={{ ...SCORE, fontSize: 150 }}>
          {value}
        </span>
        <span
          className="text-dim font-mono"
          style={{ fontSize: 40, fontWeight: 600 }}
        >
          {unit}
        </span>
      </div>
      <div
        className="text-dim font-mono"
        style={{ fontSize: 21, textAlign: align }}
      >
        {footnote}
      </div>
    </div>
  );
}
