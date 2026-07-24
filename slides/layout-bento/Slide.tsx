"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { SlideMeta, SlideProps } from "@/lib/types";
import metrics from "./data/metrics.json";

export const meta: SlideMeta = {
  id: "layout-bento",
  title: "Bento board",
  steps: 3,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/* ---------------------------------------------------------------- grid math
 * 4 columns × 3 rows on the fixed 1920×1080 canvas, absolute px.
 */
const X0 = 88;
const Y0 = 88;
const COL = 415;
const ROW = 282;
const GAP = 28;

const gx = (c: number) => X0 + c * (COL + GAP);
const gy = (r: number) => Y0 + r * (ROW + GAP);
const gw = (span: number) => span * COL + (span - 1) * GAP;
const gh = (span: number) => span * ROW + (span - 1) * GAP;

const fmt = (n: number) => n.toLocaleString("en-US");

/* ---------------------------------------------------------------- tile shell */

function Tile({
  c,
  r,
  cs = 1,
  rs = 1,
  show,
  safeMode,
  delay = 0,
  children,
}: {
  c: number;
  r: number;
  cs?: number;
  rs?: number;
  show: boolean;
  safeMode: boolean;
  delay?: number;
  children: ReactNode;
}) {
  const style: CSSProperties = {
    left: gx(c),
    top: gy(r),
    width: gw(cs),
    height: gh(rs),
  };
  const cls =
    "absolute overflow-hidden rounded-[28px] border border-edge bg-panel";

  if (safeMode) {
    // Distinct static markup: no motion components at all.
    return (
      <div className={cls} style={{ ...style, opacity: show ? 1 : 0 }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cls}
      style={style}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={
        show
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 36, scale: 0.96 }
      }
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 19,
        mass: 0.9,
        delay: show ? delay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

function Label({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[18px] font-medium uppercase tracking-[0.24em] text-dim ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- sparkline (NPS trend) */

function Sparkline({ show, safeMode }: { show: boolean; safeMode: boolean }) {
  const series = metrics.sparkline.series;
  const W = 786;
  const H = 116;
  const max = Math.max(...series);
  const px = (i: number) => (i / (series.length - 1)) * W;
  const py = (v: number) => H - (v / max) * (H - 6) - 3;

  const line = series
    .map(
      (v, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`
    )
    .join(" ");
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;

  const strokeStyle: CSSProperties = {
    fill: "none",
    stroke: "var(--color-accent)",
    strokeWidth: 3,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };

  return (
    <svg width={W} height={H} aria-hidden="true">
      <path d={area} style={{ fill: "var(--color-accent)", opacity: 0.08 }} />
      {safeMode ? (
        <path d={line} style={strokeStyle} />
      ) : (
        <motion.path
          d={line}
          style={strokeStyle}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        />
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- mini bars (product mix) */

function ProductBars({ show, safeMode }: { show: boolean; safeMode: boolean }) {
  const max = metrics.productMix[0].value;
  return (
    <div className="flex flex-col gap-[22px]">
      {metrics.productMix.map((t, i) => (
        <div key={t.name}>
          <div className="mb-[8px] flex items-baseline justify-between">
            <span className="font-mono text-[20px] text-ink">{t.name}</span>
            <span className="font-mono text-[20px] text-dim">
              {t.value}%
            </span>
          </div>
          <div className="h-[10px] w-full rounded-full bg-edge">
            {safeMode ? (
              <div
                className="h-[10px] rounded-full"
                style={{
                  width: `${(t.value / max) * 100}%`,
                  background: "var(--color-accent)",
                }}
              />
            ) : (
              <motion.div
                className="h-[10px] origin-left rounded-full"
                style={{
                  width: `${(t.value / max) * 100}%`,
                  background: "var(--color-accent)",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: show ? 1 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 20,
                  delay: show ? 0.3 + i * 0.12 : 0,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- chips */

const CHIPS: { value: string; label: string }[] = [
  { value: `$${metrics.revenueM}M`, label: "full-year revenue" },
  { value: `+${metrics.growthPct}%`, label: "year-on-year growth" },
  { value: fmt(metrics.customers), label: "active policyholders" },
  { value: `${metrics.retentionPct}%`, label: "retention rate" },
  { value: `${metrics.claimsRatio}`, label: "claims ratio" },
  { value: `${metrics.satisfaction}/5`, label: "customer satisfaction" },
];

/* ---------------------------------------------------------------- slide */

export default function Slide({ step, safeMode }: SlideProps) {
  const s0 = step >= 0;
  const s1 = step >= 1;
  const s2 = step >= 2;

  return (
    <div className="relative h-full w-full">
      {/* ---- cluster 1 · framing: hero number + kicker ---- */}
      <Tile c={0} r={0} cs={2} rs={2} show={s0} safeMode={safeMode}>
        <div className="flex h-full flex-col justify-between p-[46px]">
          <Label>Full-year revenue</Label>
          <div className="font-display text-[252px] font-semibold leading-[0.9] tracking-[-0.02em] text-ink">
            ${metrics.revenueM}M
          </div>
          <div>
            <div
              className="mb-[20px] h-[3px] w-[120px] rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="text-[24px] text-dim">
              +{metrics.growthPct}% on prior year · {fmt(metrics.customers)} policyholders · FY2025
            </div>
          </div>
        </div>
      </Tile>

      <Tile c={2} r={1} show={s0} safeMode={safeMode} delay={0.12}>
        <div className="flex h-full flex-col justify-between p-[36px]">
          <div
            className="text-[18px] font-medium uppercase tracking-[0.24em]"
            style={{ color: "var(--color-accent)" }}
          >
            Northwind Insurance
          </div>
          <p className="text-[24px] leading-[1.45] text-ink">
            Four product lines, {fmt(metrics.customers)} policyholders, and a claims ratio that keeps falling — FY2025 in numbers.
          </p>
        </div>
      </Tile>

      {/* ---- cluster 2 · telemetry: sparkline + chips + bars ---- */}
      <Tile c={2} r={0} cs={2} show={s1} safeMode={safeMode}>
        <div className="flex h-full flex-col p-[36px]">
          <div className="flex items-start justify-between">
            <Label>NPS trend · monthly</Label>
            <div className="text-right">
              <div className="font-display text-[56px] font-semibold leading-none text-ink">
                {metrics.sparkline.series[metrics.sparkline.series.length - 1]}
              </div>
              <Label className="mt-[6px]">NPS (Dec)</Label>
            </div>
          </div>
          <div className="mt-auto">
            <Sparkline show={s1} safeMode={safeMode} />
          </div>
        </div>
      </Tile>

      <Tile c={0} r={2} cs={2} show={s1} safeMode={safeMode} delay={0.1}>
        <div className="flex h-full flex-col p-[36px]">
          <Label>Business vitals</Label>
          <div className="mt-[26px] flex flex-wrap gap-[14px]">
            {CHIPS.map((chip) => (
              <div
                key={chip.label}
                className="flex items-baseline gap-[10px] rounded-full border border-edge px-[22px] py-[10px]"
              >
                <span
                  className="font-mono text-[22px] font-medium"
                  style={{ color: "var(--color-accent)" }}
                >
                  {chip.value}
                </span>
                <span className="text-[17px] uppercase tracking-[0.14em] text-dim">
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Tile>

      <Tile c={2} r={2} show={s1} safeMode={safeMode} delay={0.18}>
        <div className="flex h-full flex-col p-[36px]">
          <Label className="mb-[26px]">Product mix</Label>
          <ProductBars show={s1} safeMode={safeMode} />
        </div>
      </Tile>

      {/* ---- cluster 3 · human notes: quote + claims ---- */}
      <Tile c={3} r={1} show={s2} safeMode={safeMode}>
        <div className="flex h-full flex-col justify-between p-[36px]">
          <div
            className="font-display text-[64px] leading-none"
            style={{ color: "var(--color-accent)" }}
          >
            &ldquo;
          </div>
          <p className="text-[25px] leading-[1.4] text-ink">
            The claims ratio improvement didn&rsquo;t happen on its own — it came from better data reaching the right people faster.
          </p>
          <Label>Board review · FY2025</Label>
        </div>
      </Tile>

      <Tile c={3} r={2} show={s2} safeMode={safeMode} delay={0.12}>
        <div className="flex h-full flex-col justify-between p-[36px]">
          <Label>Claims ratio</Label>
          <div
            className="font-display text-[84px] font-semibold leading-none tracking-[-0.01em]"
            style={{ color: "var(--color-amber)" }}
          >
            {metrics.claimsRatio}
          </div>
          <div className="font-mono text-[17px] text-dim">
            down from 0.71 in FY2022 · Motor 0.62 · Home 0.54 · Life 0.51
          </div>
        </div>
      </Tile>
    </div>
  );
}
