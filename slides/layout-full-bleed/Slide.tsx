"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import storm from "./data/storm.json";

export const meta: SlideMeta = {
  id: "layout-full-bleed",
  title: "Full bleed",
  steps: 3,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Procedural abstract ring geometry — fully deterministic, computed once */
/* at module scope so server prerender and client hydration agree.       */
/* ------------------------------------------------------------------ */

/** Focal point on the 1920×1080 canvas. */
const EYE = { x: 1335, y: 415 };

/** Square layer that slowly rotates around the focal point. */
const RING_BOX = 1980;
const C = RING_BOX / 2;

/** Concentric ring: a circle perturbed by low-order sinusoids. */
function isobarPath(base: number, w3: number, w5: number, p3: number, p5: number): string {
  const segs: string[] = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const r =
      base *
      (1 +
        w3 * Math.sin(3 * t + p3) +
        w5 * Math.sin(5 * t + p5) +
        0.022 * Math.sin(2 * t + p3 * 0.7));
    segs.push(
      `${i === 0 ? "M" : "L"}${(C + r * Math.cos(t)).toFixed(1)} ${(C + r * 0.93 * Math.sin(t)).toFixed(1)}`,
    );
  }
  return segs.join(" ") + " Z";
}

const ISOBARS = Array.from({ length: 9 }, (_, i) => {
  const base = 76 + i * 88;
  const labelAngle = -0.58 - i * 0.24;
  return {
    d: isobarPath(base, 0.046 + 0.007 * i, 0.026 + 0.004 * i, i * 1.7, i * 2.9),
    width: i % 3 === 0 ? 2.4 : 1.2,
    opacity: 0.5 - i * 0.042,
    hpa: 944 + i * 8,
    labelX: C + (base + 16) * Math.cos(labelAngle),
    labelY: C + (base + 16) * 0.93 * Math.sin(labelAngle),
    labelled: i > 0 && i % 2 === 0,
  };
});

/** Trailing arc: a logarithmic spiral arm sweeping out from the focal point. */
function spiralPath(phase: number): string {
  const segs: string[] = [];
  const N = 96;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 3.5;
    const r = 60 * Math.exp(0.31 * t);
    const a = t + phase;
    segs.push(
      `${i === 0 ? "M" : "L"}${(C + r * Math.cos(a)).toFixed(1)} ${(C + r * 0.93 * Math.sin(a)).toFixed(1)}`,
    );
  }
  return segs.join(" ");
}

const SPIRALS = [spiralPath(0.45), spiralPath(0.45 + Math.PI)];

/** Graticule (lat/long grid) positions, every 160 px. */
const GRID_X = Array.from({ length: 13 }, (_, i) => i * 160);
const GRID_Y = Array.from({ length: 7 }, (_, i) => i * 160);

/** Forecast-track waypoints (static layer, eye → lower left). */
const TRACK = [
  { x: EYE.x, y: EYE.y, label: "" },
  { x: 1020, y: 600, label: "+24h" },
  { x: 700, y: 745, label: "+48h" },
  { x: 380, y: 855, label: "+72h" },
];

export default function Slide({ step, safeMode }: SlideProps) {
  const ringField = (
    <svg
      width={RING_BOX}
      height={RING_BOX}
      viewBox={`0 0 ${RING_BOX} ${RING_BOX}`}
      style={{ display: "block" }}
      aria-hidden
    >
      {SPIRALS.map((d, i) => (
        <path
          key={`spiral-${i}`}
          d={d}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.4}
          strokeDasharray="3 9"
          opacity={0.22}
        />
      ))}
      {ISOBARS.map((ring, i) => (
        <g key={`iso-${i}`}>
          <path
            d={ring.d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={ring.width}
            opacity={ring.opacity}
          />
          {ring.labelled && (
            <text
              x={ring.labelX}
              y={ring.labelY}
              fill="var(--color-accent)"
              opacity={0.45}
              fontSize={17}
              fontFamily="var(--font-mono)"
            >
              {ring.hpa}
            </text>
          )}
        </g>
      ))}
      {/* focal point */}
      <circle cx={C} cy={C} r={26} fill="none" stroke="var(--color-amber)" strokeWidth={2} opacity={0.8} />
      <circle cx={C} cy={C} r={5} fill="var(--color-amber)" opacity={0.9} />
    </svg>
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg">
      {/* Atmospheric wash: deep gradient + cold glow around the focal point */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(1150px 880px at ${EYE.x}px ${EYE.y}px, rgba(125,211,252,0.14), transparent 68%),` +
            `radial-gradient(1500px 1000px at 1700px 150px, rgba(34,52,86,0.55), transparent 75%),` +
            "linear-gradient(118deg, #05080e 0%, #0a1322 55%, #0e1b2e 100%)",
        }}
      />

      {/* Graticule */}
      <svg className="absolute left-0 top-0" width={1920} height={1080} aria-hidden>
        {GRID_X.map((x) => (
          <line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={1080} stroke="var(--color-edge)" strokeWidth={1} opacity={0.4} />
        ))}
        {GRID_Y.map((y) => (
          <line key={`gy-${y}`} x1={0} y1={y} x2={1920} y2={y} stroke="var(--color-edge)" strokeWidth={1} opacity={0.4} />
        ))}
        <text x={1782} y={152} fill="var(--color-dim)" opacity={0.55} fontSize={16} fontFamily="var(--font-mono)">
          12°N
        </text>
        <text x={1606} y={1062} fill="var(--color-dim)" opacity={0.55} fontSize={16} fontFamily="var(--font-mono)">
          108°E
        </text>
      </svg>

      {/* Rotating ring field (frozen at a fixed angle in safe mode) */}
      {safeMode ? (
        <div
          className="absolute"
          style={{ left: EYE.x - C, top: EYE.y - C, width: RING_BOX, height: RING_BOX, transform: "rotate(14deg)" }}
        >
          {ringField}
        </div>
      ) : (
        <motion.div
          className="absolute"
          style={{ left: EYE.x - C, top: EYE.y - C, width: RING_BOX, height: RING_BOX }}
          animate={{ rotate: -360 }}
          transition={{ duration: 180, ease: "linear", repeat: Infinity }}
        >
          {ringField}
        </motion.div>
      )}

      {/* Slow-breathing glow at the focal point (static in safe mode) */}
      {safeMode ? (
        <div
          className="absolute"
          style={{
            left: EYE.x - 230,
            top: EYE.y - 230,
            width: 460,
            height: 460,
            background: "radial-gradient(closest-side, rgba(251,191,36,0.12), transparent 70%)",
          }}
        />
      ) : (
        <motion.div
          className="absolute"
          style={{
            left: EYE.x - 230,
            top: EYE.y - 230,
            width: 460,
            height: 460,
            background: "radial-gradient(closest-side, rgba(251,191,36,0.12), transparent 70%)",
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
        />
      )}

      {/* Projection track */}
      <svg className="absolute left-0 top-0" width={1920} height={1080} aria-hidden>
        <path
          d={`M ${TRACK[0].x} ${TRACK[0].y} C 1180 510, 1100 555, ${TRACK[1].x} ${TRACK[1].y} S 810 700, ${TRACK[2].x} ${TRACK[2].y} S 480 820, ${TRACK[3].x} ${TRACK[3].y}`}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth={1.6}
          strokeDasharray="2 10"
          opacity={0.5}
        />
        {TRACK.slice(1).map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={6} fill="none" stroke="var(--color-amber)" strokeWidth={1.6} opacity={0.7} />
            <text
              x={p.x + 16}
              y={p.y - 12}
              fill="var(--color-amber)"
              opacity={0.6}
              fontSize={17}
              fontFamily="var(--font-mono)"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Scrim: heavy on the left for text, lifting toward the backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(78deg, rgba(4,6,10,0.94) 0%, rgba(4,6,10,0.82) 28%, rgba(4,6,10,0.42) 54%, rgba(4,6,10,0.04) 76%)," +
            "linear-gradient(to top, rgba(4,6,10,0.78) 0%, transparent 34%)",
        }}
      />

      {/* Station-chart chrome, top right */}
      <div className="absolute text-right" style={{ right: 96, top: 84 }}>
        <p className="font-mono text-accent" style={{ fontSize: 19, letterSpacing: "0.18em", opacity: 0.75 }}>
          {storm.systemTag}
        </p>
        <p className="font-mono text-dim" style={{ fontSize: 17, letterSpacing: "0.14em", marginTop: 10, opacity: 0.8 }}>
          {storm.pressureTag}
        </p>
      </div>

      {/* Foreground copy */}
      <div className="absolute" style={{ left: 128, top: 372, width: 1080 }}>
        <Reveal show safeMode={safeMode}>
          <p
            className="font-mono text-accent"
            style={{ fontSize: 24, letterSpacing: "0.32em", marginBottom: 42 }}
          >
            {storm.kicker}
          </p>
        </Reveal>

        <Reveal show={step >= 1} safeMode={safeMode} delay={0.1}>
          <h1
            className="font-display font-semibold text-ink"
            style={{ fontSize: 116, lineHeight: 1.04, letterSpacing: "-0.015em" }}
          >
            <span className="text-amber">{storm.statementLead}</span> {storm.statementRest}
          </h1>
        </Reveal>

        <Reveal show={step >= 2} safeMode={safeMode} delay={0.15}>
          <div style={{ marginTop: 56 }}>
            <div style={{ width: 132, height: 2, background: "var(--color-accent)", opacity: 0.6 }} />
            <p className="font-mono text-dim" style={{ fontSize: 22, letterSpacing: "0.04em", marginTop: 26 }}>
              {storm.attribution}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
