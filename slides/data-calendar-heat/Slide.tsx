"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import calendar from "./data/calendar.json";

export const meta: SlideMeta = {
  id: "data-calendar-heat",
  title: "Calendar heatmap",
  steps: 3,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

/* ---------------------------------------------------------------- layout */

const GRID_LEFT = 156;
const GRID_TOP = 330;
const CELL_W = 66;
const CELL_H = 100;
const GAP_X = 6;
const GAP_Y = 10;

const colX = (hour: number) => GRID_LEFT + hour * (CELL_W + GAP_X);
const rowY = (day: number) => GRID_TOP + day * (CELL_H + GAP_Y);
const GRID_BOTTOM = rowY(2) + CELL_H;

/* ---------------------------------------------------------------- colour */

/** 5-stop heat ramp: near-bg slot → hot amber. */
const HEAT = ["#1a1d24", "#41301c", "#7a4d1d", "#c47a1f", "#ffa62b"];
const SLOT_BG = "#161922";
const FLASH = "#ffe7bd";
const NO_GLOW = "0 0 0px rgba(255,166,43,0)";
const FLASH_GLOW = "0 0 42px rgba(255,222,160,0.65)";
const OVERNIGHT_GLOW = "0 0 34px rgba(255,166,43,0.45)";
const HOT_GLOW = "0 0 20px rgba(255,166,43,0.26)";

/* ---------------------------------------------------------------- timing */

const IGNITE_BASE = 0.15;
const PER_HOUR = 0.05;
const DAY_STRIDE = 24 * PER_HOUR + 0.2; // full day sweep + a breath between days

/* ------------------------------------------------------------------ data */

const { days, counts, thresholds, legendLabels, callouts } = calendar;

function levelFor(count: number): number {
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (count >= thresholds[i]) level = i + 1;
  }
  return level;
}

const isOvernight = (hour: number) => hour >= 22 || hour <= 5;
const inWindow = (day: number, hour: number) =>
  !(day === 0 && hour === 0) && !(day === 2 && hour > 14);

interface CellAnim {
  color: string;
  shadow: string;
  delay: number;
}

function cellAnim(day: number, hour: number, count: number): CellAnim {
  const level = levelFor(count);
  const shadow =
    isOvernight(hour) && count > 0
      ? OVERNIGHT_GLOW
      : level === 4
        ? HOT_GLOW
        : NO_GLOW;
  return {
    color: HEAT[level],
    shadow,
    delay: IGNITE_BASE + day * DAY_STRIDE + hour * PER_HOUR,
  };
}

const cellVariants: Variants = {
  empty: { backgroundColor: SLOT_BG, boxShadow: NO_GLOW },
  lit: (c: CellAnim) => ({
    backgroundColor: [SLOT_BG, FLASH, c.color],
    boxShadow: [NO_GLOW, FLASH_GLOW, c.shadow],
    transition: { duration: 0.9, times: [0, 0.32, 1], ease: "easeOut", delay: c.delay },
  }),
};

/* -------------------------------------------------------------- callouts */

const CALLOUT_LAYOUT: Record<string, { left: number; top: number; width: number }> = {
  slept: { left: 120, top: 712, width: 360 },
  deadzone: { left: 330, top: 856, width: 410 },
  peak: { left: 840, top: 712, width: 380 },
};

const calloutCenterX = (hour: number, span: number) =>
  colX(hour) + (span * (CELL_W + GAP_X) - GAP_X) / 2;

const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21];

/* ------------------------------------------------------------- component */

export default function Slide({ step, safeMode }: SlideProps) {
  // If the slide mounts already on its final step (e.g. navigating backwards),
  // skip the ignition sweep and render the settled state instantly.
  const [mountedAtStep] = useState(step);
  const instant = safeMode || mountedAtStep >= 2;

  const ignited = safeMode || step >= 1;
  const showCallouts = safeMode || step >= 2;

  return (
    <div className="relative h-full w-full">
      {/* Title block */}
      <div className="absolute" style={{ left: GRID_LEFT, top: 78 }}>
        <Reveal show safeMode={instant}>
          <p className="font-mono text-[19px] tracking-[0.25em] text-amber">
            NORTHWIND INSURANCE · CUSTOMER CONTACTS BY HOUR
          </p>
          <h1 className="mt-3 font-display text-[58px] font-semibold leading-tight">
            72 hours, hour by hour
          </h1>
          <p className="mt-2 text-[24px] text-dim">
            Inbound customer contacts · Mon–Wed peak week · each cell = one hour of contact activity
          </p>
        </Reveal>
      </div>

      {/* Hour axis */}
      {HOUR_LABELS.map((h) => (
        <div
          key={`hl-${h}`}
          className="absolute text-center font-mono text-[18px] text-dim"
          style={{ left: colX(h), top: GRID_TOP - 38, width: CELL_W }}
        >
          {String(h).padStart(2, "0")}
        </div>
      ))}

      {/* Day axis */}
      {days.map((d, di) => (
        <div
          key={d.label}
          className="absolute text-right"
          style={{ left: 24, top: rowY(di) + 22, width: 112 }}
        >
          <div className="font-display text-[26px] font-semibold leading-none">{d.label}</div>
          <div className="mt-2 font-mono text-[15px] text-dim">{d.date}</div>
        </div>
      ))}

      {/* The grid */}
      {counts.map((row, di) =>
        row.map((count, hi) => {
          const left = colX(hi);
          const top = rowY(di);
          const windowed = inWindow(di, hi);
          const key = `c-${di}-${hi}`;

          // Hours outside the build window: fainter voids. Zero hours inside the
          // window: empty slots that the sweep passes over in silence.
          if (count === 0) {
            return (
              <div
                key={key}
                className="absolute rounded-md"
                style={{
                  left,
                  top,
                  width: CELL_W,
                  height: CELL_H,
                  backgroundColor: windowed ? SLOT_BG : "transparent",
                  border: `1px solid rgba(255,255,255,${windowed ? 0.05 : 0.03})`,
                }}
              />
            );
          }

          const anim = cellAnim(di, hi, count);

          if (instant) {
            return (
              <div
                key={key}
                className="absolute rounded-md"
                style={{
                  left,
                  top,
                  width: CELL_W,
                  height: CELL_H,
                  backgroundColor: ignited ? anim.color : SLOT_BG,
                  boxShadow: ignited ? anim.shadow : NO_GLOW,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              />
            );
          }

          return (
            <motion.div
              key={key}
              className="absolute rounded-md"
              style={{
                left,
                top,
                width: CELL_W,
                height: CELL_H,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              custom={anim}
              initial="empty"
              animate={ignited ? "lit" : "empty"}
              variants={cellVariants}
            />
          );
        })
      )}

      {/* Footnote — keep the honesty label on screen throughout */}
      <div
        className="absolute font-mono text-[15px] text-dim"
        style={{ left: GRID_LEFT, top: 1006 }}
      >
        Cell intensities illustrative — fictional sample data for Northwind Insurance.
      </div>

      {/* Callouts + legend */}
      <Reveal show={showCallouts} safeMode={instant}>
        {/* Connector lines */}
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          aria-hidden="true"
        >
          {callouts.map((c) => {
            const layout = CALLOUT_LAYOUT[c.id];
            const x = calloutCenterX(c.hour, c.span);
            return (
              <g key={`ln-${c.id}`} stroke="rgba(255,255,255,0.7)" strokeWidth={2}>
                <line x1={x} y1={rowY(c.day) + CELL_H + 6} x2={x} y2={layout.top - 4} />
                <circle
                  cx={x}
                  cy={rowY(c.day) + CELL_H + 6}
                  r={3.5}
                  fill="#ffffff"
                  stroke="none"
                />
              </g>
            );
          })}
        </svg>

        {/* Target rings */}
        {callouts.map((c) => (
          <div
            key={`ring-${c.id}`}
            className="absolute rounded-lg"
            style={{
              left: colX(c.hour) - 5,
              top: rowY(c.day) - 5,
              width: c.span * (CELL_W + GAP_X) - GAP_X + 10,
              height: CELL_H + 10,
              border:
                c.span > 1
                  ? "2px dashed rgba(255,255,255,0.45)"
                  : "2px solid rgba(255,255,255,0.8)",
            }}
          />
        ))}

        {/* Cards */}
        {callouts.map((c, i) => {
          const layout = CALLOUT_LAYOUT[c.id];
          return (
            <Reveal
              key={`card-${c.id}`}
              show={showCallouts}
              safeMode={instant}
              delay={0.1 * i}
              y={16}
            >
              <div
                className="absolute rounded-xl border border-edge bg-panel px-6 py-4"
                style={{ left: layout.left, top: layout.top, width: layout.width }}
              >
                <p className="font-mono text-[16px] tracking-[0.18em] text-amber">{c.tag}</p>
                <p className="mt-1.5 text-[25px] leading-snug">{c.text}</p>
              </div>
            </Reveal>
          );
        })}

        {/* Legend */}
        <div className="absolute" style={{ left: 1452, top: 96, width: 412 }}>
          <p className="font-mono text-[15px] tracking-[0.22em] text-dim">EVENTS / HOUR</p>
          <div className="mt-3 flex gap-2">
            {HEAT.map((colour, i) => (
              <div key={`lg-${i}`} style={{ width: 76 }}>
                <div
                  className="rounded"
                  style={{
                    height: 22,
                    backgroundColor: colour,
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: i === 4 ? HOT_GLOW : undefined,
                  }}
                />
                <p className="mt-1.5 text-center font-mono text-[15px] text-dim">
                  {legendLabels[i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Overnight-glow hint, revealed with the callouts */}
      <Reveal show={showCallouts} safeMode={instant} delay={0.3} y={12}>
        <div
          className="absolute font-mono text-[16px] text-dim"
          style={{ left: 1280, top: GRID_BOTTOM + 64 }}
        >
          <span className="text-amber">glowing cells</span> = overnight hours with unusually
          high contact volume
        </div>
      </Reveal>
    </div>
  );
}
