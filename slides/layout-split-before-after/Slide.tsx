"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import metrics from "./data/metrics.json";
import oldWay from "./data/old-way.json";
import laneData from "./data/lanes.json";

export const meta: SlideMeta = {
  id: "layout-split-before-after",
  title: "Before / after split",
  steps: 3,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/* ---------- canvas geometry (1920×1080, absolute px) ---------- */

const SPLIT_X = 960;

// Left (old way) panel — content lives at x 96..872
const L_PAD = 96;
const L_LABEL_W = 196; // gantt row label column
const L_AXIS_X = L_PAD + L_LABEL_W + 16; // 308
const L_AXIS_W = 872 - L_AXIS_X;
const L_PX_PER_MONTH = L_AXIS_W / oldWay.axisMonths;
const L_CHART_Y = 332; // canvas-absolute
const L_ROW_H = 58;
const L_BAR_H = 32;

// Right (streamlined way) panel — content lives at x 1048..1824
const R_X = 1048;
const R_W = 1824 - R_X;
const R_PX_PER_HOUR = R_W / laneData.axisHours;
const R_CHART_Y = 332;
const R_LANE_H = 28;
const R_BAR_H = 13;

const PANEL_TOP = 176; // both half-panels start here
const AXIS_Y = L_CHART_Y + oldWay.phases.length * L_ROW_H + 22; // shared baseline

/* ---------- small pieces ---------- */

function StatChip({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "amber" | "accent";
}) {
  return (
    <div
      className="flex items-baseline gap-3 rounded-lg border px-5 py-3"
      style={{
        borderColor: tone === "amber" ? "rgba(251,191,36,0.22)" : "rgba(125,211,252,0.30)",
        background: tone === "amber" ? "rgba(251,191,36,0.05)" : "rgba(125,211,252,0.07)",
      }}
    >
      <span
        className={`font-mono text-3xl font-semibold ${
          tone === "amber" ? "text-amber/80" : "text-accent"
        }`}
      >
        {value}
      </span>
      <span className="text-xl text-dim">{label}</span>
    </div>
  );
}

/** A single parallel task bar; pulses gently when animation is allowed. */
function AgentSpan({
  left,
  width,
  top,
  animate,
  delay,
}: {
  left: number;
  width: number;
  top: number;
  animate: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left,
        width,
        top,
        height: R_BAR_H,
        background: "linear-gradient(90deg, rgba(125,211,252,0.55), rgba(125,211,252,0.95))",
        boxShadow: "0 0 10px rgba(125,211,252,0.35)",
      }}
      animate={animate ? { opacity: [0.55, 1, 0.55] } : { opacity: 0.9 }}
      transition={
        animate ? { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay } : { duration: 0 }
      }
    />
  );
}

/* ---------- slide ---------- */

export default function Slide({ step, safeMode }: SlideProps) {
  const live = !safeMode; // safeMode = fully static poster: no sweep, no pulse, no draw-on

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Title band */}
      <Reveal show safeMode={safeMode}>
        <div className="absolute left-0 top-0 w-[1920px] pt-[58px] text-center">
          <div className="font-mono text-[17px] uppercase tracking-[0.3em] text-dim">
            Manual process · streamlined process
          </div>
          <h1 className="mt-3 font-display text-[52px] font-semibold leading-tight text-ink">
            The same task. Two ways to tackle it.
          </h1>
        </div>
      </Reveal>

      {/* ---------- LEFT · the old way (step 0) ---------- */}
      <Reveal show safeMode={safeMode}>
        <div className="absolute left-0 h-[790px] w-[960px]" style={{ top: PANEL_TOP }}>
          {/* muted amber wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(251,191,36,0.045) 0%, rgba(251,191,36,0.012) 55%, transparent 100%)",
            }}
          />
          <div className="absolute left-[96px] top-[36px]">
            <div className="font-mono text-[19px] uppercase tracking-[0.28em] text-amber/70">
              Before
            </div>
            <div className="mt-2 text-[24px] text-dim">
              One analyst · one task at a time · month after month
            </div>
          </div>

          {/* sequential gantt */}
          {oldWay.phases.map((p, i) => {
            const rowTop = L_CHART_Y - PANEL_TOP + i * L_ROW_H;
            return (
              <div key={p.label}>
                <div
                  className="absolute text-right text-[19px] text-dim/85"
                  style={{ left: L_PAD, top: rowTop + 4, width: L_LABEL_W }}
                >
                  {p.label}
                </div>
                <div
                  className="absolute rounded-[4px]"
                  style={{
                    left: L_AXIS_X + p.startM * L_PX_PER_MONTH,
                    width: (p.endM - p.startM) * L_PX_PER_MONTH,
                    top: rowTop,
                    height: L_BAR_H,
                    background: "rgba(251,191,36,0.16)",
                    border: "1px solid rgba(251,191,36,0.34)",
                  }}
                />
                {/* dependency tick: each phase waits for the previous one */}
                {i > 0 && (
                  <div
                    className="absolute"
                    style={{
                      left: L_AXIS_X + p.startM * L_PX_PER_MONTH,
                      top: rowTop - L_ROW_H + L_BAR_H,
                      width: 1,
                      height: L_ROW_H - L_BAR_H,
                      background: "rgba(251,191,36,0.22)",
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* month axis */}
          {Array.from({ length: oldWay.axisMonths + 1 }, (_, m) => (
            <div
              key={m}
              className="absolute font-mono text-[15px] text-dim/70"
              style={{ left: L_AXIS_X + m * L_PX_PER_MONTH - 12, top: AXIS_Y - PANEL_TOP }}
            >
              M{m}
            </div>
          ))}

          {/* old-way stats */}
          <div className="absolute left-[96px] top-[672px] flex gap-5">
            <StatChip value="1" label="task at a time" tone="amber" />
            <StatChip value="≈ 6 mo" label="elapsed (illustrative)" tone="amber" />
          </div>
        </div>
      </Reveal>

      {/* ---------- the divide ---------- */}
      <div
        className="absolute"
        style={{
          left: SPLIT_X - 1,
          top: PANEL_TOP,
          width: 2,
          height: 790,
          background:
            "linear-gradient(180deg, transparent, rgba(125,211,252,0.45) 18%, rgba(125,211,252,0.45) 82%, transparent)",
          boxShadow: step >= 1 ? "0 0 18px rgba(125,211,252,0.35)" : "none",
        }}
      />

      {/* ---------- RIGHT · the streamlined way (step 1) ---------- */}
      <Reveal show={step >= 1} safeMode={safeMode}>
        <div className="absolute left-[960px] h-[790px] w-[960px]" style={{ top: PANEL_TOP }}>
          {/* accent-lit wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(225deg, rgba(125,211,252,0.07) 0%, rgba(125,211,252,0.02) 55%, transparent 100%)",
            }}
          />
          <div className="absolute left-[88px] top-[36px]">
            <div className="font-mono text-[19px] uppercase tracking-[0.28em] text-accent">
              After
            </div>
            <div className="mt-2 text-[24px] text-dim">
              Northwind Insurance · {metrics.agentLaunches} parallel streams ·{" "}
              <span className="text-ink">{metrics.windowHours} hours</span>
            </div>
          </div>

          {/* parallel agent lanes */}
          {laneData.lanes.map((lane, li) =>
            lane.spans.map((sp, si) => (
              <AgentSpan
                key={`${li}-${si}`}
                left={R_X - 960 + sp.s * R_PX_PER_HOUR}
                width={Math.max(8, (sp.e - sp.s) * R_PX_PER_HOUR)}
                top={R_CHART_Y - PANEL_TOP + li * R_LANE_H}
                animate={live && step >= 1}
                delay={(li * 0.17 + si * 0.41) % 1.8}
              />
            )),
          )}

          {/* hour axis */}
          {[0, 12, 24, 36, 48, 60].map((h) => (
            <div
              key={h}
              className="absolute font-mono text-[15px] text-dim/70"
              style={{ left: R_X - 960 + h * R_PX_PER_HOUR - 14, top: AXIS_Y - PANEL_TOP }}
            >
              {h}h
            </div>
          ))}

          {/* sweeping playhead — live mode only; safeMode omits it entirely */}
          {live ? (
            <motion.div
              className="absolute"
              style={{
                left: R_X - 960,
                top: R_CHART_Y - PANEL_TOP - 8,
                width: 2,
                height: laneData.lanes.length * R_LANE_H + 10,
                background: "rgba(125,211,252,0.8)",
                boxShadow: "0 0 12px rgba(125,211,252,0.6)",
              }}
              animate={{ x: [0, R_W] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
            />
          ) : null}

          {/* streamlined stats */}
          <div className="absolute left-[88px] top-[672px] flex gap-5">
            <StatChip value={String(metrics.commits)} label="tasks completed" tone="accent" />
            <StatChip
              value={String(metrics.peakConcurrentAgents)}
              label="streams at peak"
              tone="accent"
            />
            <StatChip
              value={`${metrics.stackedAgentHours} h`}
              label="parallel work-hours"
              tone="accent"
            />
          </div>
        </div>
      </Reveal>

      {/* ---------- step 2 · delta callout lands across the divide ---------- */}
      <Reveal show={step >= 2} safeMode={safeMode} y={36}>
        <div className="absolute left-0 top-0 h-[1080px] w-[1920px]">
          {/* bridging arrow, amber → accent, piercing the card */}
          <svg
            className="absolute left-0 top-0"
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            fill="none"
          >
            <defs>
              <linearGradient
                id="lsba-delta"
                x1="540"
                y1="0"
                x2="1380"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fbbf24" stopOpacity="0.85" />
                <stop offset="1" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 540 522 H 1356 l -26 -18 M 1356 522 l -26 18"
              stroke="url(#lsba-delta)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: step >= 2 ? 1 : 0 }}
              transition={live ? { duration: 0.9, ease: "easeOut", delay: 0.25 } : { duration: 0 }}
            />
          </svg>

          {/* the headline multiple */}
          <div
            className="absolute rounded-2xl border border-edge bg-panel/95 text-center"
            style={{
              left: SPLIT_X - 300,
              top: 408,
              width: 600,
              padding: "34px 40px 30px",
              boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(125,211,252,0.12)",
            }}
          >
            <div className="font-mono text-[88px] font-semibold leading-none text-accent">
              {metrics.trueLeverage}×
            </div>
            <div className="mt-2 text-[26px] text-ink">productivity gain</div>
            <div className="mt-3 text-[21px] text-dim">
              <span className="font-mono text-amber/80">{metrics.attendedHours} h</span> attended →{" "}
              <span className="font-mono text-accent">{metrics.stackedAgentHours} h</span> of
              parallel work
            </div>
            <div className="mt-4 border-t border-edge pt-3 font-mono text-[15px] tracking-wide text-dim/80">
              {metrics.attendedHours} attended · {metrics.machineHours} machine ·{" "}
              {metrics.windowHours} window · {metrics.stackedAgentHours} stacked
            </div>
          </div>
        </div>
      </Reveal>

      {/* footer source line */}
      <Reveal show safeMode={safeMode}>
        <div className="absolute left-0 top-[1006px] w-[1920px] text-center font-mono text-[15px] text-dim/60">
          Northwind Insurance · {metrics.buildWindowLabel} · illustrative sample data
        </div>
      </Reveal>
    </div>
  );
}
