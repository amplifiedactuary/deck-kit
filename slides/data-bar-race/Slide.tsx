"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import race from "./data/race.json";

export const meta: SlideMeta = {
  id: "data-bar-race",
  title: "Tool-call bar race",
  steps: 3,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

type Counts = Record<string, number>;
interface Tool {
  id: string;
  label: string;
  color: string;
}
interface Phase {
  label: string;
  counts: Counts;
}

const TOOLS = race.tools as Tool[];
const PHASES = race.phases as Phase[];
const LAST = PHASES.length - 1;

/** ms each race keyframe holds before advancing to the next. */
const PHASE_MS = 1700;
/** Bar geometry (absolute px on the 1920×1080 canvas). */
const LABEL_W = 210;
const MAX_BAR_W = 1330;
const BAR_H = 52;
const ROW_GAP = 16;

function totalOf(counts: Counts): number {
  return TOOLS.reduce((sum, t) => sum + (counts[t.id] ?? 0), 0);
}

function sortedByCount(counts: Counts): Tool[] {
  return [...TOOLS].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));
}

/** Spring-animated integer counter (running total and per-bar counts). */
function Ticker({ value, className, style }: { value: number; className?: string; style?: CSSProperties }) {
  const raw = useMotionValue(value);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    raw.set(value);
  }, [raw, value]);
  return (
    <motion.span className={className} style={style}>
      {text}
    </motion.span>
  );
}

export default function Slide({ step, isActive, restartKey, safeMode }: SlideProps) {
  // Step → mode: 0 = opening standings, 1 = race in flight, 2+ = final standings.
  const mode = step <= 0 ? "start" : step === 1 ? "race" : "end";

  // ---- Static poster (safeMode): final standings, no motion components. ----
  if (safeMode) {
    const fin = PHASES[LAST].counts;
    const finLeader = Math.max(...TOOLS.map((t) => fin[t.id] ?? 0));
    return (
      <div className="relative h-full w-full" style={{ padding: "70px 90px 0" }}>
        <Header phaseLabel={PHASES[LAST].label} totalNode={totalOf(fin).toLocaleString("en-US")} />
        <div className="absolute" style={{ top: 244, left: 90, right: 90 }}>
          {sortedByCount(fin).map((t) => (
            <div key={t.id} className="flex items-center" style={{ height: BAR_H, marginBottom: ROW_GAP }}>
              <RowLabel tool={t} />
              <div
                style={{
                  width: Math.max(6, ((fin[t.id] ?? 0) / finLeader) * MAX_BAR_W),
                  height: BAR_H,
                  borderRadius: 10,
                  background: `linear-gradient(90deg, ${t.color}55, ${t.color})`,
                }}
              />
              <span className="font-mono text-ink" style={{ fontSize: 28, marginLeft: 18 }}>
                {(fin[t.id] ?? 0).toLocaleString("en-US")}
              </span>
            </div>
          ))}
        </div>
        <Caption visible />
      </div>
    );
  }

  // ---- Animated race. Keyed remount resets the keyframe index whenever the
  // mode changes or the presenter replays (restartKey) — no state reset in effects.
  return <RaceStage key={`${restartKey}-${mode}`} mode={mode} running={mode === "race" && isActive} />;
}

function RaceStage({ mode, running }: { mode: "start" | "race" | "end"; running: boolean }) {
  // Race driver: a single interval advances the keyframe index while the race plays.
  const [racePhase, setRacePhase] = useState(0);
  useEffect(() => {
    if (!running) return;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setRacePhase(i);
      if (i >= LAST) clearInterval(timer);
    }, PHASE_MS);
    return () => clearInterval(timer);
  }, [running]);

  const phaseIdx = mode === "start" ? 0 : mode === "end" ? LAST : Math.min(racePhase, LAST);
  const phase = PHASES[phaseIdx];
  const counts = phase.counts;
  const leader = Math.max(...TOOLS.map((t) => counts[t.id] ?? 0));
  const rows = sortedByCount(counts);

  return (
    <div className="relative h-full w-full" style={{ padding: "70px 90px 0" }}>
      <Header
        phaseLabel={
          <motion.span
            key={phaseIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-block"
          >
            {phase.label}
          </motion.span>
        }
        totalNode={<Ticker value={totalOf(counts)} />}
      />

      <div className="absolute" style={{ top: 244, left: 90, right: 90 }}>
        {rows.map((t) => {
          const n = counts[t.id] ?? 0;
          return (
            <motion.div
              key={t.id}
              layout
              transition={{ layout: { type: "spring", stiffness: 90, damping: 22 } }}
              className="flex items-center"
              style={{ height: BAR_H, marginBottom: ROW_GAP }}
            >
              <RowLabel tool={t} />
              <motion.div
                animate={{ width: Math.max(6, (n / leader) * MAX_BAR_W) }}
                transition={{ type: "spring", stiffness: 70, damping: 24 }}
                style={{
                  height: BAR_H,
                  borderRadius: 10,
                  background: `linear-gradient(90deg, ${t.color}55, ${t.color})`,
                  boxShadow: `0 0 24px ${t.color}33`,
                }}
              />
              <Ticker value={n} className="font-mono text-ink" style={{ fontSize: 28, marginLeft: 18 }} />
            </motion.div>
          );
        })}
      </div>

      <Caption visible={mode === "end"} animated />
    </div>
  );
}

function RowLabel({ tool }: { tool: Tool }) {
  return (
    <div className="flex items-center" style={{ width: LABEL_W, flexShrink: 0 }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: tool.color, marginRight: 16 }} />
      <span className="font-display font-semibold text-ink" style={{ fontSize: 30 }}>
        {tool.label}
      </span>
    </div>
  );
}

function Header({ phaseLabel, totalNode }: { phaseLabel: ReactNode; totalNode: ReactNode }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="font-mono uppercase text-dim" style={{ fontSize: 22, letterSpacing: "0.22em" }}>
          Northwind Insurance · product-line GWP race
        </p>
        <h1 className="font-display font-semibold text-ink" style={{ fontSize: 58, marginTop: 10 }}>
          Every product line, racing
        </h1>
      </div>
      <div className="text-right">
        <p className="font-mono text-amber" style={{ fontSize: 26 }}>
          {phaseLabel}
        </p>
        <p className="font-mono font-semibold text-ink" style={{ fontSize: 52, marginTop: 4 }}>
          {totalNode}
          <span className="text-dim" style={{ fontSize: 28, marginLeft: 14 }}>
            $K GWP
          </span>
        </p>
      </div>
    </div>
  );
}

function Caption({ visible, animated = false }: { visible: boolean; animated?: boolean }) {
  return (
    <div className="absolute" style={{ left: 90, right: 90, bottom: 48 }}>
      <Reveal show={visible} safeMode={!animated}>
        <p className="font-display text-ink" style={{ fontSize: 34 }}>
          <span className="text-amber">Motor</span> led from the start — but Life and Commercial
          closed the gap. By Q2 2025 every product line had more than doubled its launch-quarter GWP.
        </p>
        <p className="font-mono text-dim" style={{ fontSize: 20, marginTop: 12 }}>
          Fictional sample data · Northwind Insurance · all values illustrative.
        </p>
      </Reveal>
    </div>
  );
}
