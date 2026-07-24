"use client";

import { animate, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import data from "./data/commits.json";

export const meta: SlideMeta = {
  id: "data-dot-grid",
  title: "Commit dot grid",
  steps: 3,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

/* ---- Grid geometry (absolute px on the 1920×1080 canvas) ---- */
const COLS = 25;
const DOT = 24; // ≥18px projector rule
const PITCH_X = 53;
const PITCH_Y = 40;
const GRID_LEFT = 120;
const GRID_TOP = 192;
const RAIN_STAGGER = 0.0042; // s per dot → full cascade ≈ 2.05s
const SWEEP_STAGGER = 0.0016; // s per dot for the recolour sweep

const TOTAL = data.totalCommits;
const RUN = data.callouts.recoveryRun;
const MERGE_INDEX = data.callouts.mergeDot.index;

type Phase = (typeof data.phases)[number];

function phaseOf(i: number): Phase {
  return data.phases.find((p) => i >= p.start && i <= p.end) ?? data.phases[0];
}

function dotX(i: number): number {
  return GRID_LEFT + (i % COLS) * PITCH_X;
}

function dotY(i: number): number {
  return GRID_TOP + Math.floor(i / COLS) * PITCH_Y;
}

/* Derived callout geometry (run sits entirely in one row by construction). */
const RUN_OUTLINE = {
  left: dotX(RUN.start) - 8,
  top: dotY(RUN.start) - 8,
  width: dotX(RUN.end) - dotX(RUN.start) + DOT + 16,
  height: DOT + 16,
};
const RUN_LABEL_X = GRID_LEFT + (COLS - 1) * PITCH_X + DOT + 26;
const MERGE_X = dotX(MERGE_INDEX);
const MERGE_Y = dotY(MERGE_INDEX);

/** Ticks 0 → target while `run` is true; otherwise pinned at target. */
function CountTicker({ target, run }: { target: number; run: boolean }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    const controls = animate(0, target, {
      duration: TOTAL * RAIN_STAGGER + 0.15,
      ease: "linear",
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return () => controls.stop();
  }, [run, target]);
  return <>{run ? value : target}</>;
}

export default function Slide({ step, safeMode }: SlideProps) {
  // safeMode renders the FINAL state as a static poster, regardless of step.
  const s = safeMode ? 2 : step;
  const coloured = s >= 1;
  const calloutsOn = s >= 2;

  const dots = Array.from({ length: TOTAL }, (_, i) => {
    const phase = phaseOf(i);
    const colour = coloured ? phase.color : data.neutralColor;
    const inRun = i >= RUN.start && i <= RUN.end;
    const isMerge = i === MERGE_INDEX;
    const highlighted = inRun || isMerge;
    const opacity = calloutsOn && !highlighted ? 0.55 : 1;
    const glow =
      calloutsOn && highlighted
        ? `0 0 16px 3px ${phase.color}99`
        : "0 0 0px 0px rgba(0,0,0,0)";
    const base = {
      left: dotX(i),
      top: dotY(i),
      width: DOT,
      height: DOT,
    };

    if (safeMode) {
      return (
        <div
          key={i}
          className="absolute rounded-full"
          style={{ ...base, backgroundColor: colour, opacity, boxShadow: glow }}
        />
      );
    }

    const transition: Transition =
      s === 0
        ? { delay: i * RAIN_STAGGER, duration: 0.32, ease: "easeOut" }
        : s === 1
          ? {
              duration: 0.3,
              backgroundColor: { delay: i * SWEEP_STAGGER, duration: 0.4 },
            }
          : { duration: 0.45 };

    return (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={base}
        initial={{ opacity: 0, y: -34, scale: 0.5, backgroundColor: data.neutralColor }}
        animate={{ opacity, y: 0, scale: 1, backgroundColor: colour, boxShadow: glow }}
        transition={transition}
      />
    );
  });

  return (
    <div className="relative h-full w-full">
      {/* Header */}
      <Reveal show safeMode={safeMode} className="absolute left-[120px] top-[56px]">
        <h1 className="font-display text-[56px] font-semibold leading-none text-ink">
          One dot. One policy.
        </h1>
        <p className="mt-[16px] text-[26px] text-dim">
          Northwind Insurance Q4 — every policy as a visible unit
        </p>
      </Reveal>

      {/* Count ticker */}
      <div className="absolute right-[120px] top-[40px] text-right">
        <div className="font-mono text-[92px] font-bold leading-none text-ink tabular-nums">
          <CountTicker target={TOTAL} run={!safeMode && s === 0} />
        </div>
        <div className="mt-[8px] font-mono text-[24px] tracking-[0.18em] text-dim">
          POLICIES · INCL. {data.mergeCommits} RENEWALS
        </div>
        <Reveal show={coloured} safeMode={safeMode}>
          <div className="mt-[6px] text-[20px] italic text-dim">
            product bands illustrative
          </div>
        </Reveal>
      </div>

      {/* The wall of dots */}
      <div className="absolute inset-0">{dots}</div>

      {/* Callout: recovery run bracket */}
      <Reveal show={calloutsOn} safeMode={safeMode} y={14}>
        <div
          className="absolute rounded-[22px] border-[2.5px]"
          style={{ ...RUN_OUTLINE, borderColor: "#f0647a" }}
        />
        <div
          className="absolute h-[3px] w-[18px]"
          style={{
            left: RUN_OUTLINE.left + RUN_OUTLINE.width + 2,
            top: RUN_OUTLINE.top + RUN_OUTLINE.height / 2 - 1,
            backgroundColor: "#f0647a",
          }}
        />
        <div
          className="absolute leading-tight"
          style={{ left: RUN_LABEL_X, top: RUN_OUTLINE.top - 16 }}
        >
          <div className="text-[26px] text-ink">{RUN.labelTop}</div>
          <div className="text-[26px] font-semibold" style={{ color: "#f0647a" }}>
            {RUN.labelBottom}
          </div>
        </div>
      </Reveal>

      {/* Callout: the merge dot */}
      <Reveal show={calloutsOn} safeMode={safeMode} y={14} delay={safeMode ? 0 : 0.25}>
        <div
          className="absolute rounded-full border-[3px] border-ink"
          style={{ left: MERGE_X - 9, top: MERGE_Y - 9, width: DOT + 18, height: DOT + 18 }}
        />
        <div
          className="absolute text-[28px] font-semibold text-amber"
          style={{ left: MERGE_X + DOT + 30, top: MERGE_Y - 4 }}
        >
          {data.callouts.mergeDot.label}
        </div>
      </Reveal>

      {/* Legend */}
      <Reveal
        show={coloured}
        safeMode={safeMode}
        y={16}
        className="absolute left-0 right-0 top-[1014px]"
      >
        <div className="flex items-center justify-center gap-[44px]">
          {data.phases.map((p) => (
            <div key={p.id} className="flex items-center gap-[12px]">
              <span
                className="inline-block h-[22px] w-[22px] rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-[24px] text-dim">{p.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
