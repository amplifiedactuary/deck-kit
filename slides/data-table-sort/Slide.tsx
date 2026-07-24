"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import lanesJson from "./data/lanes.json";

export const meta: SlideMeta = {
  id: "data-table-sort",
  title: "Living table",
  steps: 4,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ data */

interface Lane {
  id: string;
  label: string;
  pct: number;
  launches: number;
}

const LANES: Lane[] = lanesJson.lanes;
const MAX_PCT = Math.max(...LANES.map((l) => l.pct));
const MAX_LAUNCHES = Math.max(...LANES.map((l) => l.launches));

type SortKey = "alpha" | "pct" | "launches";
type BarMetric = "pct" | "launches";

/** Sort regime per step: alphabetical → % desc → launches desc → % desc (spotlight). */
const STEP_SORT: SortKey[] = ["alpha", "pct", "launches", "pct"];

function sortLanes(key: SortKey): Lane[] {
  const copy = [...LANES];
  if (key === "alpha") copy.sort((a, b) => a.label.localeCompare(b.label));
  else copy.sort((a, b) => b[key] - a[key]);
  return copy;
}

const CAPTIONS = [
  {
    eyebrow: "The regions",
    text: "Five regions — alphabetical, no story yet. Every premium dollar and every NPS response sits in exactly one row.",
  },
  {
    eyebrow: "Where is the premium?",
    text: "Sorted by GWP share. ‘Other / international’ is the emerging book — East is the largest named region, at 31% of total GWP.",
  },
  {
    eyebrow: "Where is satisfaction highest?",
    text: "Re-sorted by NPS. Premium share and satisfaction don’t perfectly align — West punches above its weight on customer experience.",
  },
  {
    eyebrow: "The takeaway",
    text: "East drives volume, but the growth opportunity sits where satisfaction already leads.",
  },
];

/* -------------------------------------------------------------- geometry */

const TABLE_LEFT = 120;
const TABLE_TOP = 332;
const ROW_W = 1110;
const ROW_H = 88;
const ROW_GAP = 12;
const ROW_PAD_X = 30;
const COL = { lane: 366, pct: 168, launches: 212 } as const;
const BAR_MAX_W = 252;
const BAR_PAD_L = 42;

const EDGE = "#1d2533";
const ACCENT = "#7dd3fc";
const AMBER = "#fbbf24";
const PANEL_ROW = "rgba(16, 20, 28, 0.72)";
const AMBER_BG = "rgba(251, 191, 36, 0.09)";
const AMBER_EDGE = "rgba(251, 191, 36, 0.5)";

/* ------------------------------------------------------------ sub-pieces */

function barWidth(lane: Lane, metric: BarMetric): number {
  const frac =
    metric === "launches" ? lane.launches / MAX_LAUNCHES : lane.pct / MAX_PCT;
  return Math.round(frac * BAR_MAX_W);
}

function HeaderCell({
  label,
  width,
  align,
  active,
  spotlight,
}: {
  label: string;
  width: number;
  align: "left" | "right";
  active: boolean;
  spotlight: boolean;
}) {
  return (
    <div
      className={`font-mono ${active ? (spotlight ? "text-amber" : "text-accent") : "text-dim"}`}
      style={{
        width,
        fontSize: 19,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textAlign: align,
        flex: "none",
      }}
    >
      {label}
      {active ? " ▾" : ""}
    </div>
  );
}

function HeaderRow({ sortKey, spotlight }: { sortKey: SortKey; spotlight: boolean }) {
  return (
    <div
      className="flex items-center"
      style={{
        width: ROW_W,
        height: 46,
        paddingLeft: ROW_PAD_X,
        paddingRight: ROW_PAD_X,
        marginBottom: 14,
        borderBottom: `1px solid ${EDGE}`,
      }}
    >
      <HeaderCell label="Region" width={COL.lane} align="left" active={sortKey === "alpha"} spotlight={false} />
      <HeaderCell label="% GWP" width={COL.pct} align="right" active={sortKey === "pct"} spotlight={spotlight} />
      <HeaderCell label="NPS score" width={COL.launches} align="right" active={sortKey === "launches"} spotlight={false} />
      <div style={{ flex: 1 }} />
    </div>
  );
}

function RowCells({
  lane,
  metric,
  highlighted,
  animated,
}: {
  lane: Lane;
  metric: BarMetric;
  highlighted: boolean;
  animated: boolean;
}) {
  const w = barWidth(lane, metric);
  const barColor = highlighted ? AMBER : ACCENT;
  return (
    <>
      <div
        className={`font-display font-semibold ${highlighted ? "text-amber" : "text-ink"}`}
        style={{ width: COL.lane, fontSize: 31, flex: "none" }}
      >
        {lane.label}
      </div>
      <div
        className="font-mono text-ink"
        style={{ width: COL.pct, fontSize: 31, textAlign: "right", flex: "none" }}
      >
        {lane.pct}%
      </div>
      <div
        className="font-mono text-ink"
        style={{ width: COL.launches, fontSize: 31, textAlign: "right", flex: "none" }}
      >
        {lane.launches}
      </div>
      <div style={{ flex: 1, paddingLeft: BAR_PAD_L }}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: w }}
            transition={{ type: "spring", stiffness: 160, damping: 26 }}
            style={{ height: 12, borderRadius: 6, backgroundColor: barColor }}
          />
        ) : (
          <div style={{ width: w, height: 12, borderRadius: 6, backgroundColor: barColor }} />
        )}
      </div>
    </>
  );
}

function TitleBlock() {
  return (
    <div style={{ position: "absolute", left: TABLE_LEFT, top: 108 }}>
      <div
        className="font-mono text-accent"
        style={{ fontSize: 20, letterSpacing: "0.32em", textTransform: "uppercase" }}
      >
        Northwind Insurance · regional performance
      </div>
      <h1 className="font-display font-semibold text-ink" style={{ fontSize: 66, marginTop: 16 }}>
        Where the premium went
      </h1>
    </div>
  );
}

function Footnote() {
  return (
    <div
      className="font-mono text-dim"
      style={{ position: "absolute", left: TABLE_LEFT, top: 988, fontSize: 17 }}
    >
      GWP share: Northwind Insurance FY 2025 regional book ·
      NPS scores: illustrative · all values fictional sample data
    </div>
  );
}

/* --------------------------------------------------------------- static */

function StaticPoster() {
  const sorted = sortLanes("pct");
  return (
    <div className="relative h-full w-full">
      <TitleBlock />
      <div style={{ position: "absolute", left: TABLE_LEFT, top: TABLE_TOP }}>
        <HeaderRow sortKey="pct" spotlight />
        {sorted.map((lane) => {
          const highlighted = lane.id === "east";
          return (
            <div
              key={lane.id}
              className="flex items-center"
              style={{
                width: ROW_W,
                height: ROW_H,
                paddingLeft: ROW_PAD_X,
                paddingRight: ROW_PAD_X,
                marginBottom: ROW_GAP,
                borderRadius: 14,
                border: `1px solid ${highlighted ? AMBER_EDGE : EDGE}`,
                backgroundColor: highlighted ? AMBER_BG : PANEL_ROW,
                opacity: highlighted ? 1 : 0.35,
              }}
            >
              <RowCells lane={lane} metric="pct" highlighted={highlighted} animated={false} />
            </div>
          );
        })}
      </div>
      <div
        className="rounded-2xl bg-panel"
        style={{
          position: "absolute",
          left: 1300,
          top: TABLE_TOP + 46,
          width: 500,
          padding: 36,
          border: `1px solid ${AMBER_EDGE}`,
        }}
      >
        <div
          className="font-mono text-amber"
          style={{ fontSize: 19, letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          {CAPTIONS[3].eyebrow}
        </div>
        <p className="font-display text-ink" style={{ fontSize: 31, lineHeight: 1.45, marginTop: 18 }}>
          {CAPTIONS[3].text}
        </p>
      </div>
      <Footnote />
    </div>
  );
}

/* ----------------------------------------------------------------- live */

function LiveTable({ step }: { step: number }) {
  const clamped = Math.min(Math.max(step, 0), 3);
  const sortKey = STEP_SORT[clamped];
  const sorted = sortLanes(sortKey);
  const metric: BarMetric = clamped === 2 ? "launches" : "pct";
  const spotlight = clamped === 3;
  const caption = CAPTIONS[clamped];

  return (
    <div className="relative h-full w-full">
      <Reveal show safeMode={false}>
        <TitleBlock />
      </Reveal>

      <Reveal show safeMode={false} delay={0.12}>
        <div style={{ position: "absolute", left: TABLE_LEFT, top: TABLE_TOP }}>
          <HeaderRow sortKey={sortKey} spotlight={spotlight} />
          {sorted.map((lane) => {
            const highlighted = spotlight && lane.id === "east";
            const dimmed = spotlight && lane.id !== "east";
            return (
              <motion.div
                key={lane.id}
                layout
                initial={false}
                animate={{
                  opacity: dimmed ? 0.32 : 1,
                  backgroundColor: highlighted ? AMBER_BG : PANEL_ROW,
                  borderColor: highlighted ? AMBER_EDGE : EDGE,
                }}
                transition={{
                  layout: { type: "spring", stiffness: 240, damping: 30 },
                  duration: 0.45,
                }}
                className="flex items-center"
                style={{
                  width: ROW_W,
                  height: ROW_H,
                  paddingLeft: ROW_PAD_X,
                  paddingRight: ROW_PAD_X,
                  marginBottom: ROW_GAP,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <RowCells lane={lane} metric={metric} highlighted={highlighted} animated />
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      <motion.div
        key={clamped}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        className="rounded-2xl bg-panel"
        style={{
          position: "absolute",
          left: 1300,
          top: TABLE_TOP + 46,
          width: 500,
          padding: 36,
          border: `1px solid ${spotlight ? AMBER_EDGE : EDGE}`,
        }}
      >
        <div
          className={`font-mono ${spotlight ? "text-amber" : "text-accent"}`}
          style={{ fontSize: 19, letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          {caption.eyebrow}
        </div>
        <p className="font-display text-ink" style={{ fontSize: 31, lineHeight: 1.45, marginTop: 18 }}>
          {caption.text}
        </p>
      </motion.div>

      <Footnote />
    </div>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  if (safeMode) return <StaticPoster />;
  return <LiveTable step={step} />;
}
