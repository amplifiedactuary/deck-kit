"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import gaugeData from "./data/gauges.json";

export const meta: SlideMeta = {
  id: "data-gauges",
  title: "Gauge cluster",
  steps: 3,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

/* ---------- data ---------- */

interface GaugeSpec {
  id: string;
  label: string;
  value: number;
  max: number;
  majorStep: number;
  minorStep: number;
  decimals: number;
  suffix: string;
  band: { from: number; to: number };
  metric: string;
  formula: string;
  caption: string;
}

const GAUGES: GaugeSpec[] = gaugeData.gauges;

/* ---------- dial geometry (420px instrument) ---------- */

const DIAL = 420;
const C = DIAL / 2;
const START_ANGLE = -120; // needle rest position (value 0)
const SWEEP = 240; // degrees from 0 → max
const NEEDLE_LEN = 140;
const TAIL_LEN = 34;

function angleFor(value: number, max: number): number {
  return START_ANGLE + (value / max) * SWEEP;
}

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const a = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) };
}

interface Tick {
  angle: number;
  major: boolean;
  label?: string;
}

function formatScale(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function buildTicks(max: number, majorStep: number, minorStep: number): Tick[] {
  const ticks: Tick[] = [];
  const n = Math.round(max / minorStep);
  const perMajor = Math.round(majorStep / minorStep);
  for (let i = 0; i <= n; i++) {
    const value = i * minorStep;
    const major = i % perMajor === 0;
    ticks.push({
      angle: angleFor(value, max),
      major,
      label: major ? formatScale(value) : undefined,
    });
  }
  return ticks;
}

function arcPath(fromValue: number, toValue: number, max: number, radius: number): string {
  const p1 = polar(angleFor(fromValue, max), radius);
  const p2 = polar(angleFor(toValue, max), radius);
  const large = ((toValue - fromValue) / max) * SWEEP > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
}

/* ---------- subcomponents ---------- */

/** Spring-counted value numeral beneath a dial; static text in safeMode. */
function GaugeValue({
  target,
  decimals,
  suffix,
  engaged,
  safeMode,
}: {
  target: number;
  decimals: number;
  suffix: string;
  engaged: boolean;
  safeMode: boolean;
}) {
  const spring = useSpring(0, { stiffness: 46, damping: 16 });
  useEffect(() => {
    spring.set(engaged ? target : 0);
  }, [spring, engaged, target]);
  const text = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`);
  if (safeMode) {
    return <span>{`${target.toFixed(decimals)}${suffix}`}</span>;
  }
  return <motion.span>{text}</motion.span>;
}

/** Flat-head screw detail for the instrument panel corners. */
function Screw({ left, top, slotAngle }: { left: number; top: number; slotAngle: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #59647a, #262d3c 65%, #161b26)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.18)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 2,
          top: 7,
          width: 12,
          height: 2,
          background: "rgba(0,0,0,0.65)",
          transform: `rotate(${slotAngle}deg)`,
        }}
      />
    </div>
  );
}

/** One 420px analogue instrument: bezel, tick ring, band, sprung needle, hub, glass. */
function Gauge({
  spec,
  engaged,
  safeMode,
}: {
  spec: GaugeSpec;
  engaged: boolean;
  safeMode: boolean;
}) {
  const ticks = buildTicks(spec.max, spec.majorStep, spec.minorStep);
  const parked = safeMode || engaged;
  const needleAngle = parked ? angleFor(spec.value, spec.max) : START_ANGLE;

  return (
    <div style={{ position: "absolute", left: 30, top: 56, width: DIAL, height: DIAL }}>
      {/* bezel: brushed-metal ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.025) 0deg 2deg, rgba(0,0,0,0.025) 2deg 4deg), conic-gradient(from 210deg, #2b3242, #535e73, #232a38, #4a5468, #1d2430, #3d475b, #2b3242)",
          boxShadow:
            "0 12px 34px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -1px 2px rgba(0,0,0,0.5)",
        }}
      />
      {/* recessed face */}
      <div
        style={{
          position: "absolute",
          inset: 16,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 32%, #1a2130 0%, #11161f 55%, #0a0e15 100%)",
          boxShadow:
            "inset 0 8px 20px rgba(0,0,0,0.7), inset 0 -2px 6px rgba(255,255,255,0.03)",
        }}
      />
      {/* tick ring, band, scale numerals */}
      <svg
        viewBox={`0 0 ${DIAL} ${DIAL}`}
        style={{ position: "absolute", inset: 0, width: DIAL, height: DIAL }}
        aria-hidden="true"
      >
        <path
          d={arcPath(0, spec.max, spec.max, 169)}
          fill="none"
          stroke="#222b3b"
          strokeWidth={7}
        />
        <path
          d={arcPath(spec.band.from, spec.band.to, spec.max, 169)}
          fill="none"
          stroke="#fbbf24"
          strokeOpacity={0.4}
          strokeWidth={7}
        />
        {ticks.map((tick) => {
          const outer = polar(tick.angle, 176);
          const inner = polar(tick.angle, tick.major ? 150 : 162);
          return (
            <line
              key={tick.angle}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke={tick.major ? "#cdd6e4" : "#5b667a"}
              strokeWidth={tick.major ? 3.5 : 2}
              strokeLinecap="round"
            />
          );
        })}
        {ticks
          .filter((tick) => tick.label !== undefined)
          .map((tick) => {
            const pos = polar(tick.angle, 122);
            return (
              <text
                key={tick.angle}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#aab4c6"
                fontSize={26}
                fontFamily="var(--font-mono)"
              >
                {tick.label}
              </text>
            );
          })}
        <text
          x={C}
          y={C + 70}
          textAnchor="middle"
          fill="#5b667a"
          fontSize={17}
          letterSpacing={4}
          fontFamily="var(--font-mono)"
        >
          {spec.suffix}
        </text>
      </svg>
      {/* needle */}
      <motion.div
        style={{
          position: "absolute",
          left: C - 5,
          top: C - NEEDLE_LEN,
          width: 10,
          height: NEEDLE_LEN + TAIL_LEN,
          transformOrigin: `5px ${NEEDLE_LEN}px`,
          filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.55))",
        }}
        initial={safeMode ? false : { rotate: START_ANGLE }}
        animate={{ rotate: needleAngle }}
        transition={
          safeMode
            ? { duration: 0 }
            : { type: "spring", stiffness: 42, damping: 7.5, mass: 1.1 }
        }
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 10,
            height: NEEDLE_LEN,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 60%, #b45309 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: NEEDLE_LEN,
            left: 2,
            width: 6,
            height: TAIL_LEN,
            borderRadius: 3,
            background: "#39404f",
          }}
        />
      </motion.div>
      {/* hub */}
      <div
        style={{
          position: "absolute",
          left: C - 21,
          top: C - 21,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, #6a7488, #2a3040 60%, #1a1f2b)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)",
        }}
      />
      {/* glass glare */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 30,
          width: 292,
          height: 150,
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0) 72%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ---------- slide ---------- */

const ASSEMBLY_LEFTS = [80, 640, 1200]; // panel-relative, 480px columns under each dial

export default function Slide({ step, safeMode }: SlideProps) {
  const engaged = step >= 1;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* kicker + title */}
      <Reveal show safeMode={safeMode}>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            left: 0,
            top: 70,
            width: 1920,
            textAlign: "center",
            fontSize: 20,
            letterSpacing: "0.35em",
            color: "#8b95a7",
          }}
        >
          INSTRUMENT CHECK · NORTHWIND INSURANCE · FY 2025
        </div>
        <h1
          className="font-display"
          style={{
            position: "absolute",
            left: 0,
            top: 108,
            width: 1920,
            textAlign: "center",
            fontSize: 60,
            fontWeight: 600,
            color: "#e8edf5",
          }}
        >
          Measurements, not marketing
        </h1>
      </Reveal>

      {/* instrument panel */}
      <Reveal show safeMode={safeMode}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 240,
            width: 1760,
            height: 632,
            borderRadius: 28,
            border: "1px solid #232c3c",
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0px 1px, rgba(0,0,0,0) 1px 3px), linear-gradient(180deg, #151b26 0%, #0e131c 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -14px 30px rgba(0,0,0,0.45), 0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <Screw left={22} top={22} slotAngle={28} />
          <Screw left={1722} top={22} slotAngle={-54} />
          <Screw left={22} top={594} slotAngle={75} />
          <Screw left={1722} top={594} slotAngle={9} />

          {GAUGES.map((spec, i) => (
            <div
              key={spec.id}
              style={{
                position: "absolute",
                left: ASSEMBLY_LEFTS[i],
                top: 24,
                width: 480,
                height: 584,
              }}
            >
              {/* etched label */}
              <div
                className="font-mono"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  width: 480,
                  textAlign: "center",
                  fontSize: 27,
                  letterSpacing: "0.25em",
                  color: "#9aa5b8",
                  textShadow: "0 1px 0 rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {spec.label}
              </div>
              <Gauge spec={spec} engaged={engaged} safeMode={safeMode} />
              {/* value numeral (projector rule: ≥48px) */}
              <div
                className="font-mono"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 498,
                  width: 480,
                  textAlign: "center",
                  fontSize: 68,
                  fontWeight: 700,
                  color: "#fbbf24",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <GaugeValue
                  target={spec.value}
                  decimals={spec.decimals}
                  suffix={spec.suffix}
                  engaged={engaged}
                  safeMode={safeMode}
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* caption strip */}
      <Reveal show={step >= 2} safeMode={safeMode} y={22}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 902,
            width: 1760,
            height: 152,
            borderRadius: 20,
            border: "1px solid #232c3c",
            background: "linear-gradient(180deg, #11161f 0%, #0d1119 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {GAUGES.map((spec, i) => (
            <div
              key={spec.id}
              style={{
                position: "absolute",
                left: (ASSEMBLY_LEFTS[i] ?? 0) + 20,
                top: 26,
                width: 440,
              }}
            >
              <p
                style={{
                  fontSize: 24,
                  lineHeight: 1.35,
                  color: "rgba(232,237,245,0.88)",
                }}
              >
                {spec.caption}
              </p>
              <p
                className="font-mono"
                style={{ marginTop: 12, fontSize: 17, color: "#8b95a7" }}
              >
                {spec.metric} · {spec.formula}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
