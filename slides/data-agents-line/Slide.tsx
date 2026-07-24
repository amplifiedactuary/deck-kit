"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import series from "./data/agents-series.json";

export const meta: SlideMeta = {
  id: "data-agents-line",
  title: "NPS over time",
  steps: 2,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Geometry (fixed 1920×1080 canvas; SVG sits at left:115 top:252)     */
/* ------------------------------------------------------------------ */

const TOTAL_H = series.totalHours; // 11 months: Jan (0) → Dec (11)
const SVG_W = 1690;
const SVG_H = 645;
const X0 = 70; // plot left
const PLOT_W = 1600;
const X1 = X0 + PLOT_W;
const Y_TOP = 40; // y at 80 NPS
const Y_BASE = 572; // y at 0 NPS
const PX_PER_AGENT = (Y_BASE - Y_TOP) / 80;

const xFor = (h: number) => X0 + (h / TOTAL_H) * PLOT_W;
const yFor = (v: number) => Y_BASE - v * PX_PER_AGENT;

/* ------------------------------------------------------------------ */
/* Monotone cubic interpolation (Fritsch–Carlson) over the series      */
/* ------------------------------------------------------------------ */

const HS: number[] = series.points.map((p) => p[0]);
const VS: number[] = series.points.map((p) => p[1]);

const TANGENTS: number[] = (() => {
  const n = HS.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((VS[i + 1] - VS[i]) / (HS[i + 1] - HS[i]));
  const m: number[] = new Array(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / d[i];
      const b = m[i + 1] / d[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        m[i] = t * a * d[i];
        m[i + 1] = t * b * d[i];
      }
    }
  }
  return m;
})();

/** NPS value at month h (smooth, monotone — no overshoot). */
function valueAt(h: number): number {
  const n = HS.length;
  if (h <= HS[0]) return VS[0];
  if (h >= HS[n - 1]) return VS[n - 1];
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (HS[mid] <= h) lo = mid;
    else hi = mid;
  }
  const dx = HS[hi] - HS[lo];
  const t = (h - HS[lo]) / dx;
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return Math.max(
    0,
    h00 * VS[lo] + h10 * dx * TANGENTS[lo] + h01 * VS[hi] + h11 * dx * TANGENTS[hi],
  );
}

/* ------------------------------------------------------------------ */
/* Dense sampling → path strings + arc-length table                    */
/* ------------------------------------------------------------------ */

const N_SAMPLES = 400; // every 4 px
const SAMPLE_Y: number[] = [];
for (let i = 0; i <= N_SAMPLES; i++) {
  SAMPLE_Y.push(yFor(valueAt((i / N_SAMPLES) * TOTAL_H)));
}

const LINE_PATH: string = (() => {
  let d = "";
  for (let i = 0; i <= N_SAMPLES; i++) {
    const x = X0 + (i / N_SAMPLES) * PLOT_W;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${SAMPLE_Y[i].toFixed(2)}`;
  }
  return d;
})();

const AREA_PATH = `${LINE_PATH}L${X1},${Y_BASE}L${X0},${Y_BASE}Z`;

/** Cumulative arc length at each sample, normalised to [0,1]. */
const ARC_TABLE: number[] = (() => {
  const cum: number[] = [0];
  const dxStep = PLOT_W / N_SAMPLES;
  for (let i = 1; i <= N_SAMPLES; i++) {
    const dy = SAMPLE_Y[i] - SAMPLE_Y[i - 1];
    cum.push(cum[i - 1] + Math.hypot(dxStep, dy));
  }
  const total = cum[N_SAMPLES];
  return cum.map((c) => c / total);
})();

/** Fraction of total path arc length at x-progress p — keeps the
 *  pathLength-driven stroke tip aligned with the x-driven head dot. */
function arcFrac(p: number): number {
  const f = Math.min(Math.max(p, 0), 1) * N_SAMPLES;
  const i = Math.floor(f);
  if (i >= N_SAMPLES) return 1;
  return ARC_TABLE[i] + (ARC_TABLE[i + 1] - ARC_TABLE[i]) * (f - i);
}

/* ------------------------------------------------------------------ */
/* Custom draw easing: linger through the peak, ease into the finish   */
/* ------------------------------------------------------------------ */

const DRAW_SECONDS = 10.5;
const DRAW_DELAY = 0.5;

const EASE_N = 512;
const EASE_TIME_AT_P: number[] = (() => {
  // "Drag" slows the sweep around key x-positions (p = x-fraction).
  const peakP = 3.5 / TOTAL_H;
  const sprintP = 6.5 / TOTAL_H;
  const drag = (p: number) =>
    1 +
    3.0 * Math.exp(-((p - peakP) ** 2) / (2 * 0.045 ** 2)) +
    1.5 * Math.exp(-((p - sprintP) ** 2) / (2 * 0.05 ** 2)) +
    1.2 * Math.exp(-((p - 1) ** 2) / (2 * 0.07 ** 2)) +
    0.8 * Math.exp(-(p ** 2) / (2 * 0.04 ** 2));
  const t: number[] = [0];
  for (let i = 1; i <= EASE_N; i++) t.push(t[i - 1] + drag((i - 0.5) / EASE_N));
  const total = t[EASE_N];
  return t.map((v) => v / total);
})();

/** Easing fn: time fraction → x-progress (monotone inverse of the table). */
function drawEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let lo = 0;
  let hi = EASE_N;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (EASE_TIME_AT_P[mid] < t) lo = mid;
    else hi = mid;
  }
  const t0 = EASE_TIME_AT_P[lo];
  const t1 = EASE_TIME_AT_P[hi];
  const f = t1 > t0 ? (t - t0) / (t1 - t0) : 0;
  return (lo + f) / EASE_N;
}

/* ------------------------------------------------------------------ */
/* Annotations: content from JSON, layout here                         */
/* ------------------------------------------------------------------ */

interface CalloutSpec {
  h: number;
  label: string;
  px: number;
  py: number;
  textX: number;
  textY: number;
  anchor: "start" | "middle" | "end";
  leader: "v" | "h";
  at: number; // x-progress at which the head crosses this point
}

const LAYOUT: { dx: number; dy: number; anchor: "start" | "middle" | "end"; leader: "v" | "h" }[] =
  [
    { dx: -10, dy: -64, anchor: "start", leader: "v" }, // campaign launch
    { dx: 32, dy: 8, anchor: "start", leader: "h" }, // peak: 64 NPS
    { dx: 0, dy: -96, anchor: "middle", leader: "v" }, // product refresh
    { dx: 0, dy: -58, anchor: "middle", leader: "v" }, // end-of-year dip
  ];

const CALLOUTS: CalloutSpec[] = series.annotations.map((a, i) => {
  const px = xFor(a.h);
  const py = yFor(valueAt(a.h));
  const l = LAYOUT[i];
  return {
    h: a.h,
    label: a.label,
    px,
    py,
    textX: px + l.dx,
    textY: py + l.dy,
    anchor: l.anchor,
    leader: l.leader,
    at: a.h / TOTAL_H,
  };
});

/* No night bands for NPS monthly series. */
const NIGHT_BANDS: { from: number; to: number }[] = [];

const AVG = series.facts.avgConcurrency; // 51.2 NPS
const AVG_Y = yFor(AVG);

/* ------------------------------------------------------------------ */
/* Shared chart chrome (axes, grid, ticks, night bands)                */
/* ------------------------------------------------------------------ */

function ChartFrame() {
  return (
    <g>
      {NIGHT_BANDS.map((b) => (
        <rect
          key={b.from}
          x={xFor(b.from)}
          y={Y_TOP - 14}
          width={xFor(b.to) - xFor(b.from)}
          height={Y_BASE - Y_TOP + 14}
          fill="var(--color-panel)"
          opacity={0.55}
        />
      ))}
      {[0, 20, 40, 60, 80].map((v) => (
        <g key={v}>
          <line
            x1={X0}
            x2={X1}
            y1={yFor(v)}
            y2={yFor(v)}
            stroke="var(--color-edge)"
            strokeWidth={v === 0 ? 1.5 : 1}
            opacity={v === 0 ? 1 : 0.6}
          />
          <text
            x={X0 - 14}
            y={yFor(v) + 7}
            textAnchor="end"
            className="font-mono"
            fontSize={20}
            fill="var(--color-dim)"
          >
            {v}
          </text>
        </g>
      ))}
      <text x={0} y={16} className="font-mono" fontSize={17} fill="var(--color-dim)" opacity={0.9}>
        NET PROMOTER SCORE
      </text>
      {series.ticks.map((t, i) => {
        const x = xFor(t.h);
        const anchor = i === 0 ? "start" : i === series.ticks.length - 1 ? "end" : "middle";
        const isMidnight = false; // no midnight dividers for monthly NPS series
        return (
          <g key={t.h}>
            {isMidnight && (
              <line
                x1={x}
                x2={x}
                y1={Y_TOP - 14}
                y2={Y_BASE}
                stroke="var(--color-edge)"
                strokeWidth={1}
                opacity={0.5}
              />
            )}
            <line
              x1={x}
              x2={x}
              y1={Y_BASE}
              y2={Y_BASE + 8}
              stroke="var(--color-edge)"
              strokeWidth={1.5}
            />
            <text
              x={i === 0 ? x - 4 : i === series.ticks.length - 1 ? x + 4 : x}
              y={Y_BASE + 36}
              textAnchor={anchor}
              className="font-mono"
              fontSize={20}
              fill="var(--color-dim)"
            >
              {t.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function calloutBody(c: CalloutSpec) {
  return (
    <>
      <circle cx={c.px} cy={c.py} r={5} fill="var(--color-amber)" />
      {c.leader === "v" ? (
        <line
          x1={c.px}
          x2={c.px}
          y1={c.py - 12}
          y2={c.textY + 10}
          stroke="var(--color-amber)"
          strokeWidth={1.2}
          strokeDasharray="2 5"
          opacity={0.7}
        />
      ) : (
        <line
          x1={c.px + 12}
          x2={c.textX - 8}
          y1={c.py}
          y2={c.py}
          stroke="var(--color-amber)"
          strokeWidth={1.2}
          strokeDasharray="2 5"
          opacity={0.7}
        />
      )}
      <text
        x={c.textX}
        y={c.textY}
        textAnchor={c.anchor}
        className="font-mono"
        fontSize={23}
        fill="var(--color-amber)"
      >
        {c.label}
      </text>
    </>
  );
}

/** Animated callout: pops in as the line head crosses its x-position. */
function CalloutLive({ c, progress }: { c: CalloutSpec; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [c.at, Math.min(c.at + 0.018, 1)], [0, 1]);
  const rise = useTransform(progress, [c.at, Math.min(c.at + 0.034, 1)], [14, 0]);
  return <motion.g style={{ opacity, y: rise }}>{calloutBody(c)}</motion.g>;
}

function AvgReference() {
  return (
    <g>
      <line
        x1={X0}
        x2={X1}
        y1={AVG_Y}
        y2={AVG_Y}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
        strokeDasharray="7 9"
        opacity={0.55}
      />
      <text
        x={X1 - 4}
        y={AVG_Y - 12}
        textAnchor="end"
        className="font-mono"
        fontSize={20}
        fill="var(--color-ink)"
        opacity={0.75}
      >
        average ≈ {AVG.toFixed(0)} NPS
      </text>
    </g>
  );
}

function ChartDefs() {
  return (
    <defs>
      <linearGradient id="dal-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.26} />
        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
      </linearGradient>
      <filter id="dal-glow" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/* Animated chart (live presentation mode)                             */
/* ------------------------------------------------------------------ */

function AnimatedChart({ step, restartKey }: { step: number; restartKey: number }) {
  const progress = useMotionValue(0);
  const areaClipRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: DRAW_SECONDS,
      delay: DRAW_DELAY,
      ease: drawEase,
    });
    return () => controls.stop();
  }, [progress, restartKey]);

  // Stroke tip via pathLength (arc-length mapped so it tracks x-progress).
  const strokeFrac = useTransform(progress, (p) => Math.max(arcFrac(p), 0.0001));
  // Area fill follows beneath the stroke via a widening clip rect.
  useMotionValueEvent(progress, "change", (p) => {
    areaClipRef.current?.setAttribute("width", (p * PLOT_W).toFixed(1));
  });
  // Glowing head dot rides the line.
  const headX = useTransform(progress, (p) => X0 + p * PLOT_W);
  const headY = useTransform(progress, (p) => yFor(valueAt(p * TOTAL_H)));
  const headOpacity = useTransform(progress, [0, 0.004], [0, 1]);

  return (
    <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} aria-hidden="true">
      <ChartDefs />
      <defs>
        <clipPath id="dal-clip">
          <rect ref={areaClipRef} x={X0} y={0} width={0} height={SVG_H} />
        </clipPath>
      </defs>
      <ChartFrame />
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <AvgReference />
      </motion.g>
      <g clipPath="url(#dal-clip)">
        <path d={AREA_PATH} fill="url(#dal-area)" />
      </g>
      <motion.path
        d={LINE_PATH}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={3.5}
        strokeLinecap="round"
        style={{ pathLength: strokeFrac }}
      />
      {CALLOUTS.map((c) => (
        <CalloutLive key={c.label} c={c} progress={progress} />
      ))}
      <motion.g style={{ x: headX, y: headY, opacity: headOpacity }}>
        <circle r={13} fill="var(--color-accent)" opacity={0.5} filter="url(#dal-glow)" />
        <circle r={6.5} fill="var(--color-accent)" opacity={0.55} />
        <circle r={4} fill="#e8f7ff" />
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Static chart (safe mode / overview poster)                          */
/* ------------------------------------------------------------------ */

function StaticChart({ step }: { step: number }) {
  return (
    <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} aria-hidden="true">
      <ChartDefs />
      <ChartFrame />
      {step >= 1 && <AvgReference />}
      <path d={AREA_PATH} fill="url(#dal-area)" />
      <path
        d={LINE_PATH}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {CALLOUTS.map((c) => (
        <g key={c.label}>{calloutBody(c)}</g>
      ))}
      <g transform={`translate(${X1},${SAMPLE_Y[N_SAMPLES]})`}>
        <circle r={6.5} fill="var(--color-accent)" opacity={0.55} />
        <circle r={4} fill="#e8f7ff" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Slide                                                               */
/* ------------------------------------------------------------------ */

export default function Slide({ step, safeMode, restartKey }: SlideProps) {
  return (
    <div className="relative h-full w-full">
      {/* Header */}
      <div className="absolute" style={{ left: 120, top: 84 }}>
        <p
          className="font-mono"
          style={{ fontSize: 20, letterSpacing: "0.22em", color: "var(--color-accent)" }}
        >
          NORTHWIND INSURANCE · CUSTOMER SATISFACTION
        </p>
        <h1
          className="font-display font-semibold"
          style={{ fontSize: 58, lineHeight: 1.1, marginTop: 14, color: "var(--color-ink)" }}
        >
          Net Promoter Score by month
        </h1>
        <p style={{ fontSize: 22, marginTop: 10, color: "var(--color-dim)" }}>
          monthly NPS across the 2025 survey year
        </p>
      </div>

      {/* Fact strip (real anchors) */}
      <div className="absolute flex" style={{ right: 120, top: 100, gap: 56 }}>
        {[
          { v: String(series.facts.launches), l: "SURVEY RESPONDENTS", amber: false },
          { v: String(series.facts.peak), l: "PEAK NPS", amber: true },
          { v: String(series.facts.windowHours), l: "SURVEY MONTHS", amber: false },
        ].map((s) => (
          <div key={s.l} style={{ textAlign: "right" }}>
            <p
              className="font-display font-semibold"
              style={{ fontSize: 44, color: s.amber ? "var(--color-amber)" : "var(--color-ink)" }}
            >
              {s.v}
            </p>
            <p
              className="font-mono"
              style={{
                fontSize: 15,
                letterSpacing: "0.14em",
                marginTop: 4,
                color: "var(--color-dim)",
              }}
            >
              {s.l}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="absolute" style={{ left: 115, top: 252 }}>
        {safeMode ? (
          <StaticChart step={step} />
        ) : (
          <AnimatedChart key={restartKey} step={step} restartKey={restartKey} />
        )}
      </div>

      {/* Step 1: takeaway */}
      <div className="absolute" style={{ left: 0, right: 0, top: 936, textAlign: "center" }}>
        <Reveal show={step >= 1} safeMode={safeMode}>
          <p style={{ fontSize: 30, color: "var(--color-ink)" }}>
            NPS held above 40 through the year — peaked at{" "}
            <span className="font-semibold" style={{ color: "var(--color-amber)" }}>
              64
            </span>{" "}
            in April, supported by campaign and product launches.
          </p>
        </Reveal>
      </div>

      {/* Provenance footnote */}
      <p
        className="absolute font-mono"
        style={{ right: 120, bottom: 26, fontSize: 15, color: "var(--color-dim)", opacity: 0.7 }}
      >
        curve shape illustrative · Northwind Insurance · NPS survey year 2025
      </p>
    </div>
  );
}
