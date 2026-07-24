"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SlideMeta, SlideProps } from "@/lib/types";
import mosaic from "./data/mosaic.json";

export const meta: SlideMeta = {
  id: "layout-mosaic-2x2",
  title: "2×2 mosaic",
  steps: 4,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/* ---------------------------------------------------------------- layout */

const PAD = 96; // outer margin on all sides
const GUTTER = 32; // gap between cells
const CELL_W = (1920 - PAD * 2 - GUTTER) / 2; // 848
const CELL_H = (1080 - PAD * 2 - GUTTER) / 2; // 428
const CX = 1920 / 2; // junction x
const CY = 1080 / 2; // junction y

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DIM_OPACITY = 0.16;

/* ------------------------------------------------------------ cell shell */

function CellShell({
  lit,
  safeMode,
  x,
  y,
  children,
}: {
  lit: boolean;
  safeMode: boolean;
  x: number;
  y: number;
  children: ReactNode;
}) {
  const className =
    "absolute overflow-hidden rounded-2xl border border-edge bg-panel";
  const style = { left: x, top: y, width: CELL_W, height: CELL_H, padding: 40 };

  if (safeMode) {
    // Distinct static markup: plain div, no motion, instant lit/dim state.
    return (
      <div className={className} style={{ ...style, opacity: lit ? 1 : DIM_OPACITY }}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: DIM_OPACITY, scale: 0.985 }}
      animate={{ opacity: lit ? 1 : DIM_OPACITY, scale: lit ? 1 : 0.985 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CellTag({ index, label, lit }: { index: number; label: string; lit: boolean }) {
  return (
    <div className="font-mono text-[19px] uppercase tracking-[0.28em]">
      <span className={lit ? "text-accent" : "text-dim"}>{`0${index}`}</span>
      <span className="text-dim">{` · ${label}`}</span>
    </div>
  );
}

/* ------------------------------------------------------ cell A: big stat */

function StatCell({ lit }: { lit: boolean }) {
  const { stat } = mosaic;
  return (
    <div className="flex h-full flex-col">
      <CellTag index={1} label="metric" lit={lit} />
      <div className="mt-auto">
        <div className="flex items-baseline gap-5">
          <span className="font-display text-[168px] font-semibold leading-none text-ink">
            {stat.value}
          </span>
          <span className="font-display text-[60px] font-medium text-dim">{stat.unit}</span>
        </div>
        <p className="mt-4 text-[28px] leading-snug text-dim">{stat.label}</p>
        <p className="mt-3 font-mono text-[21px] text-accent">{stat.subline}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- cell B: quote */

function QuoteCell({ lit }: { lit: boolean }) {
  const { quote } = mosaic;
  return (
    <div className="flex h-full flex-col">
      <CellTag index={2} label="voice" lit={lit} />
      <div className="mt-auto">
        <div className="font-display text-[96px] leading-[0.6] text-amber">&ldquo;</div>
        <p className="mt-6 font-display text-[36px] leading-[1.35] text-ink">{quote.text}</p>
        <p className="mt-5 font-mono text-[20px] text-dim">{`— ${quote.attribution}`}</p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- cell C: bar chart */

const CHART_W = 760;
const CHART_H = 200;
const CHART_BASE = 186;
const CHART_MAX_H = 148;
const BAR_W = 58;
const BAR_GAP = 18;

function CadenceCell({ lit, safeMode }: { lit: boolean; safeMode: boolean }) {
  const { cadence } = mosaic;
  const max = Math.max(...cadence.blocks);
  return (
    <div className="flex h-full flex-col">
      <CellTag index={3} label="trend" lit={lit} />
      <div className="mt-auto">
        <p className="mb-3 font-mono text-[20px] text-dim">{cadence.label}</p>
        <svg width={CHART_W} height={CHART_H} aria-hidden="true">
          <line
            x1={0}
            y1={CHART_BASE}
            x2={CHART_W}
            y2={CHART_BASE}
            className="stroke-edge"
            strokeWidth={2}
          />
          {cadence.blocks.map((v, i) => {
            const h = (v / max) * CHART_MAX_H;
            const x = 9 + i * (BAR_W + BAR_GAP);
            const isPeak = v === max;
            const fill = isPeak ? "fill-amber" : "fill-accent";
            const opacity = isPeak ? 1 : 0.8;
            if (safeMode || !lit) {
              return (
                <rect
                  key={i}
                  x={x}
                  y={CHART_BASE - h}
                  width={BAR_W}
                  height={h}
                  rx={4}
                  className={fill}
                  opacity={opacity}
                />
              );
            }
            return (
              <motion.rect
                key={i}
                x={x}
                width={BAR_W}
                rx={4}
                className={fill}
                opacity={opacity}
                initial={{ height: 0, y: CHART_BASE }}
                animate={{ height: h, y: CHART_BASE - h }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: EASE }}
              />
            );
          })}
        </svg>
        <div className="mt-1 flex justify-between font-mono text-[18px] text-dim">
          <span>{cadence.axisStart}</span>
          <span>{cadence.axisEnd}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- cell D: diagram */

const DIAG_W = 760;
const DIAG_H = 226;
const AGENT_X = 380; // centre of agent squares
const AGENT_YS = [22, 55, 88, 122, 155, 188];
const HUMAN_CX = 82;
const HUMAN_CY = 105;
const HEX_CX = 652;
const HEX_CY = 105;

const HEX_POINTS = "696,105 674,143 630,143 608,105 630,67 674,67";

function DiagramCell({ lit, safeMode }: { lit: boolean; safeMode: boolean }) {
  const { diagram } = mosaic;
  const animate = lit && !safeMode;

  const shapes = (
    <>
      {/* fan-out lines: human → agents, agents → output */}
      {AGENT_YS.map((yc, i) => (
        <g key={i}>
          <line
            x1={HUMAN_CX + 30}
            y1={HUMAN_CY}
            x2={AGENT_X - 16}
            y2={yc}
            className="stroke-edge"
            strokeWidth={2}
          />
          <line
            x1={AGENT_X + 16}
            y1={yc}
            x2={HEX_CX - 44}
            y2={HEX_CY}
            className="stroke-edge"
            strokeWidth={2}
          />
          <rect
            x={AGENT_X - 14}
            y={yc - 14}
            width={28}
            height={28}
            rx={6}
            className="fill-panel stroke-accent"
            strokeWidth={2.5}
          />
        </g>
      ))}
      <circle
        cx={HUMAN_CX}
        cy={HUMAN_CY}
        r={30}
        className="fill-panel stroke-amber"
        strokeWidth={3}
      />
      <polygon points={HEX_POINTS} className="fill-panel stroke-accent" strokeWidth={3} />
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <CellTag index={4} label="system" lit={lit} />
      <div className="mt-auto">
        <svg width={DIAG_W} height={DIAG_H} aria-hidden="true">
          {animate ? (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {shapes}
            </motion.g>
          ) : (
            <g>{shapes}</g>
          )}
        </svg>
        <div className="relative h-[26px] w-[760px] font-mono text-[19px] text-dim">
          <span className="absolute -translate-x-1/2" style={{ left: HUMAN_CX }}>
            {diagram.human}
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: AGENT_X }}>
            {`${diagram.agents} agents`}
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: HEX_CX }}>
            {diagram.output}
          </span>
        </div>
        <p className="mt-3 text-[25px] text-ink">{diagram.caption}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------- junction: unifying crosshair */

function Junction({ show, safeMode }: { show: boolean; safeMode: boolean }) {
  const hStyle = { left: PAD, top: CY - 1, width: 1920 - PAD * 2, height: 2 };
  const vStyle = { left: CX - 1, top: PAD, width: 2, height: 1080 - PAD * 2 };
  const diamondStyle = { left: CX - 9, top: CY - 9, width: 18, height: 18 };

  if (safeMode) {
    // Distinct static markup: crosshair fully drawn (or absent), no motion.
    if (!show) return null;
    return (
      <>
        <div className="absolute bg-accent opacity-70" style={hStyle} />
        <div className="absolute bg-accent opacity-70" style={vStyle} />
        <div className="absolute rotate-45 border-2 border-accent bg-bg" style={diamondStyle} />
      </>
    );
  }
  return (
    <>
      <motion.div
        className="absolute bg-accent"
        style={hStyle}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={show ? { scaleX: 1, opacity: 0.7 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: show ? 0.35 : 0 }}
      />
      <motion.div
        className="absolute bg-accent"
        style={vStyle}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={show ? { scaleY: 1, opacity: 0.7 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: show ? 0.35 : 0 }}
      />
      <motion.div
        className="absolute rotate-45 border-2 border-accent bg-bg"
        style={diamondStyle}
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={show ? { opacity: 1, scale: 1, rotate: 45 } : { opacity: 0, scale: 0, rotate: 45 }}
        transition={{ duration: 0.5, ease: EASE, delay: show ? 0.9 : 0 }}
      />
    </>
  );
}

/* ----------------------------------------------------------------- slide */

export default function Slide({ step, safeMode }: SlideProps) {
  const lit = [true, step >= 1, step >= 2, step >= 3];
  return (
    <div className="relative h-full w-full">
      <Junction show={step >= 3} safeMode={safeMode} />
      <CellShell lit={lit[0]} safeMode={safeMode} x={PAD} y={PAD}>
        <StatCell lit={lit[0]} />
      </CellShell>
      <CellShell lit={lit[1]} safeMode={safeMode} x={PAD + CELL_W + GUTTER} y={PAD}>
        <QuoteCell lit={lit[1]} />
      </CellShell>
      <CellShell lit={lit[2]} safeMode={safeMode} x={PAD} y={PAD + CELL_H + GUTTER}>
        <CadenceCell lit={lit[2]} safeMode={safeMode} />
      </CellShell>
      <CellShell
        lit={lit[3]}
        safeMode={safeMode}
        x={PAD + CELL_W + GUTTER}
        y={PAD + CELL_H + GUTTER}
      >
        <DiagramCell lit={lit[3]} safeMode={safeMode} />
      </CellShell>
    </div>
  );
}
