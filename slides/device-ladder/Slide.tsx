"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "device-ladder",
  title: "Maturity Ladder",
  steps: 4,
  themes: [],
  group: "devices",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Scene data — all coordinates on the fixed 1920×1080 canvas.         */
/*                                                                     */
/* Three stacked rungs that climb up-and-to-the-right. Each rung is a  */
/* platform whose bar height encodes the leverage multiple. Heights    */
/* are anchored to the top rung as the visual ceiling.                  */
/* ------------------------------------------------------------------ */

const FLOOR = 920; // y of the baseline ground

interface Rung {
  /** Reveal step (1-based) that lights this rung. */
  step: number;
  value: string;
  /** Numeric multiple, used to scale bar height. */
  mult: number;
  label: string;
  caption: string;
  /** Provenance tag shown small under the value. */
  tag: string;
  /** Left edge x of this rung's column. */
  x: number;
  /** Accent gradient id for the lit fill. */
  litId: string;
  /** Accent stroke / text colour when lit. */
  accent: string;
}

const COL_W = 360;
const PX_PER_X = 78; // vertical pixels of bar per 1× of leverage

const RUNGS: Rung[] = [
  {
    step: 1,
    value: "1×",
    mult: 1,
    label: "Manual",
    caption: "paper-based processes, high error rate, no real-time visibility.",
    tag: "baseline",
    x: 250,
    litId: "lad-lit-1",
    accent: "#8b95a7",
  },
  {
    step: 2,
    value: "2×",
    mult: 2,
    label: "Assisted",
    caption: "digital tools supporting staff — $20.4M revenue, 23% growth vs prior year.",
    tag: "current state · FY2025",
    x: 780,
    litId: "lad-lit-2",
    accent: "#7dd3fc",
  },
  {
    step: 3,
    value: "4×",
    mult: 4,
    label: "Optimised",
    caption: "end-to-end automation with human oversight — the strategic target.",
    tag: "target · 3-year plan",
    x: 1310,
    litId: "lad-lit-3",
    accent: "#fbbf24",
  },
];

/** Top y of a rung's bar given its multiple. */
const topOf = (mult: number) => FLOOR - mult * PX_PER_X;

/** Faint guide-grid lines marking each ×-level the rungs reach. */
const GRID_LEVELS = [1, 2, 4];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Slide({ step, safeMode }: SlideProps) {
  const isLit = (r: Rung) => safeMode || step >= r.step;
  const closingOn = safeMode || step >= 3;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        className="absolute inset-0"
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        aria-hidden
      >
        <defs>
          <linearGradient id="lad-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#070b11" />
            <stop offset="60%" stopColor="#090d15" />
            <stop offset="100%" stopColor="#0c1119" />
          </linearGradient>
          <linearGradient id="lad-lit-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4252" />
            <stop offset="100%" stopColor="#222936" />
          </linearGradient>
          <linearGradient id="lad-lit-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#56b4e0" />
            <stop offset="100%" stopColor="#205a7c" />
          </linearGradient>
          <linearGradient id="lad-lit-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#b8821a" />
          </linearGradient>
          <filter id="lad-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <rect x={0} y={0} width={1920} height={1080} fill="url(#lad-bg)" />

        {/* --- Level guide-grid -------------------------------------------- */}
        {GRID_LEVELS.map((lv) => {
          const y = topOf(lv);
          return (
            <g key={`grid-${lv}`}>
              <line
                x1={150}
                y1={y}
                x2={1770}
                y2={y}
                stroke="#1d2533"
                strokeWidth={1}
                strokeDasharray="3 10"
                opacity={0.6}
              />
              <text
                x={132}
                y={y + 8}
                textAnchor="end"
                fill="#3b4456"
                fontSize={22}
                className="font-mono"
              >
                {lv}×
              </text>
            </g>
          );
        })}

        {/* --- Ground line -------------------------------------------------- */}
        <line x1={150} y1={FLOOR} x2={1770} y2={FLOOR} stroke="#2a3344" strokeWidth={2} />

        {/* --- The ascending climb arrow (lit progressively) --------------- */}
        {RUNGS.slice(0, -1).map((r, i) => {
          const next = RUNGS[i + 1];
          const x1 = r.x + COL_W / 2;
          const y1 = topOf(r.mult);
          const x2 = next.x + COL_W / 2;
          const y2 = topOf(next.mult);
          const on = safeMode || step >= next.step;
          return (
            <motion.line
              key={`climb-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#7dd3fc"
              strokeWidth={2}
              strokeDasharray="2 12"
              initial={false}
              animate={{ opacity: on ? 0.55 : 0 }}
              transition={safeMode ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
            />
          );
        })}

        {/* --- Rungs -------------------------------------------------------- */}
        {RUNGS.map((r) => {
          const lit = isLit(r);
          const top = topOf(r.mult);
          const h = FLOOR - top;
          return (
            <g key={r.value}>
              {/* Unlit ghost column — always faintly present so layout is stable */}
              <rect
                x={r.x}
                y={top}
                width={COL_W}
                height={h}
                fill="#10141c"
                stroke="#1d2533"
                strokeWidth={1.5}
                opacity={0.7}
              />
              {/* Lit fill rises from the floor on its step */}
              <motion.g
                initial={false}
                animate={{ opacity: lit ? 1 : 0 }}
                transition={safeMode ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
              >
                <motion.rect
                  x={r.x}
                  width={COL_W}
                  fill={`url(#${r.litId})`}
                  stroke={r.accent}
                  strokeWidth={2}
                  strokeOpacity={0.7}
                  initial={false}
                  animate={lit ? { y: top, height: h } : { y: FLOOR, height: 0 }}
                  transition={
                    safeMode
                      ? { duration: 0 }
                      : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
                  }
                />
                {/* Top cap glow line */}
                <motion.rect
                  x={r.x}
                  width={COL_W}
                  height={4}
                  fill={r.accent}
                  filter="url(#lad-glow)"
                  initial={false}
                  animate={lit ? { y: top } : { y: FLOOR }}
                  transition={
                    safeMode
                      ? { duration: 0 }
                      : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* ---------------- HTML overlays -------------------------------- */}

      {/* Heading */}
      <div className="absolute" style={{ left: 150, top: 80, width: 900 }}>
        <Reveal show safeMode={safeMode}>
          <div
            className="font-mono"
            style={{ fontSize: 22, letterSpacing: 6, color: "#7dd3fc" }}
          >
            NORTHWIND INSURANCE · STRATEGIC ROADMAP
          </div>
          <h1
            className="font-display font-semibold"
            style={{ fontSize: 60, lineHeight: 1.05, marginTop: 14 }}
          >
            The maturity ladder
          </h1>
        </Reveal>
      </div>

      {/* Rung captions — anchored above each bar's top, revealed on its step */}
      {RUNGS.map((r) => {
        const lit = isLit(r);
        const top = topOf(r.mult);
        return (
          <div
            key={`cap-${r.value}`}
            className="absolute"
            style={{ left: r.x - 20, top: top - 226, width: COL_W + 40 }}
          >
            <Reveal show={lit} safeMode={safeMode} delay={0.2} y={22}>
              <div className="text-center">
                <div
                  className="font-display font-semibold"
                  style={{ fontSize: 92, lineHeight: 1, color: r.accent }}
                >
                  {r.value}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 19,
                    letterSpacing: 3,
                    color: "#6b7589",
                    marginTop: 10,
                    textTransform: "uppercase",
                  }}
                >
                  {r.tag}
                </div>
              </div>
            </Reveal>
          </div>
        );
      })}

      {/* Rung labels + captions — sit on the ground beneath each column */}
      {RUNGS.map((r) => {
        const lit = isLit(r);
        return (
          <div
            key={`lbl-${r.value}`}
            className="absolute"
            style={{ left: r.x - 20, top: FLOOR + 26, width: COL_W + 40 }}
          >
            <Reveal show={lit} safeMode={safeMode} delay={0.3} y={18}>
              <div className="text-center">
                <div
                  className="font-display font-semibold"
                  style={{ fontSize: 32, color: "#e8edf5" }}
                >
                  {r.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#8b95a7",
                    marginTop: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {r.caption}
                </div>
              </div>
            </Reveal>
          </div>
        );
      })}

      {/* Closing line (step 3) */}
      <div
        className="absolute text-center"
        style={{ left: 0, right: 0, top: 28 }}
      >
        <div className="absolute" style={{ right: 150, top: 52, width: 640 }}>
          <Reveal show={closingOn} safeMode={safeMode} delay={0.35} y={20}>
            <div
              className="font-display"
              style={{ fontSize: 30, color: "#e8edf5", lineHeight: 1.3, textAlign: "right" }}
            >
              Each rung compounds on the last —
              <br />
              the roadmap is how we capture the gains.
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
