"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "device-iceberg",
  title: "Iceberg",
  steps: 4,
  themes: [],
  group: "devices",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Scene data — all coordinates on the fixed 1920×1080 canvas.         */
/* ------------------------------------------------------------------ */

const WATERLINE = 340;

interface Stratum {
  num: string;
  label: string;
  note: string;
  /** Outline polygon of this submerged band. */
  points: string;
  /** Internal crystalline facet lines [x1, y1, x2, y2]. */
  facets: [number, number, number, number][];
  /** Unlit (silhouette) fill. */
  baseFill: string;
  /** Gradient id used when the band is illuminated. */
  litId: string;
  /** Leader line from the band's edge out to the label column. */
  leader: [number, number, number, number];
  /** Top of the HTML label block. */
  labelTop: number;
}

const STRATA: Stratum[] = [
  {
    num: "01",
    label: "pricing & underwriting",
    note: "the risk framework behind every quote the customer sees",
    points: "600,340 935,340 998,418 1040,500 500,500 552,430",
    facets: [
      [700, 340, 648, 500],
      [852, 340, 910, 500],
      [935, 340, 820, 500],
    ],
    baseFill: "#14334a",
    litId: "ice-lit-1",
    leader: [1000, 425, 1165, 415],
    labelTop: 392,
  },
  {
    num: "02",
    label: "claims operations",
    note: "the processing that turns a claim event into a settled payment",
    points: "500,500 1040,500 1082,575 1105,660 455,660 468,588",
    facets: [
      [648, 500, 705, 660],
      [910, 500, 862, 660],
      [500, 500, 640, 660],
    ],
    baseFill: "#102a3e",
    litId: "ice-lit-2",
    leader: [1085, 585, 1165, 575],
    labelTop: 552,
  },
  {
    num: "03",
    label: "data & reporting",
    note: "every transaction leaves a record that informs the next decision",
    points: "455,660 1105,660 1078,742 1030,820 510,820 472,748",
    facets: [
      [705, 660, 662, 820],
      [860, 660, 902, 820],
      [1105, 660, 960, 820],
    ],
    baseFill: "#0c2133",
    litId: "ice-lit-3",
    leader: [1070, 745, 1165, 738],
    labelTop: 715,
  },
  {
    num: "04",
    label: "compliance & governance",
    note: "nothing is approved on trust alone",
    points: "510,820 1030,820 955,895 805,960 615,900",
    facets: [
      [662, 820, 718, 938],
      [902, 820, 852, 925],
    ],
    baseFill: "#091a29",
    litId: "ice-lit-4",
    leader: [940, 880, 1165, 890],
    labelTop: 867,
  },
];

/** Drifting marine particles: [x, y, r, opacity]. Deterministic, hand-placed. */
const PARTICLES: [number, number, number, number][] = [
  [240, 420, 2.2, 0.16], [330, 610, 1.4, 0.1], [205, 840, 1.8, 0.12],
  [395, 980, 1.3, 0.09], [300, 500, 1.2, 0.08], [430, 720, 2.4, 0.14],
  [560, 1010, 1.6, 0.1], [620, 590, 1.2, 0.08], [705, 880, 1.4, 0.07],
  [770, 1030, 2.0, 0.12], [880, 990, 1.3, 0.08], [950, 620, 1.5, 0.09],
  [1010, 900, 1.8, 0.11], [1090, 480, 1.3, 0.1], [1150, 1010, 2.2, 0.13],
  [1230, 560, 1.4, 0.09], [1280, 760, 1.7, 0.1], [1350, 940, 1.2, 0.08],
  [1420, 470, 2.0, 0.12], [1490, 680, 1.4, 0.09], [1545, 870, 1.8, 0.1],
  [1620, 540, 1.3, 0.08], [1670, 1000, 2.3, 0.13], [1730, 720, 1.4, 0.09],
  [1790, 430, 1.6, 0.1], [165, 660, 1.5, 0.1], [505, 555, 1.1, 0.07],
  [840, 760, 1.2, 0.07],
];

/** Underwater light-ray polygons fanning down from the surface. */
const RAYS: string[] = [
  "500,344 640,344 400,1080 200,1080",
  "830,344 925,344 1090,1080 930,1080",
  "1055,344 1115,344 1420,1080 1310,1080",
  "300,344 350,344 130,1080 40,1080",
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Slide({ step, safeMode }: SlideProps) {
  // SafeMode renders the complete scene fully lit, as a static poster.
  const litPairOne = safeMode || step >= 1; // strata 01–02
  const litPairTwo = safeMode || step >= 2; // strata 03–04
  const gaugeOn = safeMode || step >= 3;
  const litFor = (i: number) => (i < 2 ? litPairOne : litPairTwo);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        className="absolute inset-0"
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        aria-hidden
      >
        <defs>
          <linearGradient id="ice-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080c13" />
            <stop offset="78%" stopColor="#0c1624" />
            <stop offset="100%" stopColor="#11253a" />
          </linearGradient>
          <linearGradient id="ice-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2435" />
            <stop offset="45%" stopColor="#081626" />
            <stop offset="100%" stopColor="#040810" />
          </linearGradient>
          <linearGradient id="ice-tip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2f9fe" />
            <stop offset="100%" stopColor="#b3d8ef" />
          </linearGradient>
          <linearGradient id="ice-waterline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="30%" stopColor="#7dd3fc" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#a5e3ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ice-ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.13" />
            <stop offset="70%" stopColor="#7dd3fc" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ice-lit-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#56aacf" />
            <stop offset="100%" stopColor="#2e6f93" />
          </linearGradient>
          <linearGradient id="ice-lit-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f8fb6" />
            <stop offset="100%" stopColor="#245a7c" />
          </linearGradient>
          <linearGradient id="ice-lit-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f739b" />
            <stop offset="100%" stopColor="#1b4865" />
          </linearGradient>
          <linearGradient id="ice-lit-4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#225a7d" />
            <stop offset="100%" stopColor="#133750" />
          </linearGradient>
          <filter id="ice-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="ice-glow-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        {/* --- Sky & sea ------------------------------------------------ */}
        <rect x={0} y={0} width={1920} height={WATERLINE} fill="url(#ice-sky)" />
        <rect
          x={0}
          y={WATERLINE}
          width={1920}
          height={1080 - WATERLINE}
          fill="url(#ice-sea)"
        />

        {/* Underwater light rays */}
        {safeMode ? (
          <g>
            {RAYS.map((p) => (
              <polygon key={p} points={p} fill="url(#ice-ray)" />
            ))}
          </g>
        ) : (
          <motion.g
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            {RAYS.map((p) => (
              <polygon key={p} points={p} fill="url(#ice-ray)" />
            ))}
          </motion.g>
        )}

        {/* Marine particles (slow vertical drift when animating) */}
        {safeMode ? (
          <g>
            {PARTICLES.map(([x, y, r, o]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#a5e3ff" opacity={o} />
            ))}
          </g>
        ) : (
          <motion.g
            animate={{ y: [0, -26, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          >
            {PARTICLES.map(([x, y, r, o]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#a5e3ff" opacity={o} />
            ))}
          </motion.g>
        )}

        {/* --- Submerged strata ------------------------------------------ */}
        {STRATA.map((s, i) => {
          const lit = litFor(i);
          return (
            <g key={s.num}>
              {/* Unlit silhouette — always present, barely visible. */}
              <polygon
                points={s.points}
                fill={s.baseFill}
                stroke="#1e3a51"
                strokeWidth={1.5}
                opacity={0.85}
              />
              {s.facets.map(([x1, y1, x2, y2]) => (
                <line
                  key={`${x1}-${y1}-base`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ffffff"
                  strokeWidth={1}
                  opacity={0.05}
                />
              ))}
              {/* Lit overlay — fades in when this band's step arrives. */}
              <motion.g
                initial={false}
                animate={{ opacity: lit ? 1 : 0 }}
                transition={
                  safeMode
                    ? { duration: 0 }
                    : { duration: 0.9, ease: "easeOut", delay: lit ? (i % 2) * 0.22 : 0 }
                }
              >
                <polygon
                  points={s.points}
                  fill={`url(#${s.litId})`}
                  stroke="#6fc2e6"
                  strokeWidth={1.5}
                  strokeOpacity={0.55}
                />
                {s.facets.map(([x1, y1, x2, y2]) => (
                  <line
                    key={`${x1}-${y1}-lit`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#cdeafa"
                    strokeWidth={1}
                    opacity={0.18}
                  />
                ))}
                {/* Leader line to the label column */}
                <line
                  x1={s.leader[0]}
                  y1={s.leader[1]}
                  x2={s.leader[2]}
                  y2={s.leader[3]}
                  stroke="#33485f"
                  strokeWidth={1.5}
                />
                <circle cx={s.leader[0]} cy={s.leader[1]} r={4} fill="#7dd3fc" />
              </motion.g>
            </g>
          );
        })}

        {/* --- Waterline glow -------------------------------------------- */}
        <ellipse
          cx={770}
          cy={WATERLINE}
          rx={430}
          ry={20}
          fill="#7dd3fc"
          opacity={0.1}
          filter="url(#ice-glow-soft)"
        />
        <rect
          x={120}
          y={WATERLINE - 2}
          width={1680}
          height={4}
          fill="url(#ice-waterline)"
          opacity={0.55}
          filter="url(#ice-glow)"
        />
        <rect
          x={120}
          y={WATERLINE - 1}
          width={1680}
          height={2}
          fill="url(#ice-waterline)"
        />

        {/* --- The visible tip -------------------------------------------- */}
        <polygon
          points="600,340 660,255 745,168 820,230 880,265 935,340"
          fill="url(#ice-tip)"
        />
        {/* Shaded right-hand facet of the tip */}
        <polygon
          points="745,168 820,230 880,265 935,340 778,340"
          fill="#bcdcf1"
        />
        <line x1={745} y1={168} x2={778} y2={340} stroke="#ffffff" strokeWidth={1} opacity={0.5} />
        <line x1={660} y1={255} x2={700} y2={340} stroke="#ffffff" strokeWidth={1} opacity={0.3} />
        {/* Leader from tip to "the demo" callout */}
        <line x1={882} y1={262} x2={1165} y2={225} stroke="#33485f" strokeWidth={1.5} />
        <circle cx={882} cy={262} r={4} fill="#fbbf24" />

        {/* --- Depth-gauge brackets (step 3) ------------------------------- */}
        <motion.g
          initial={false}
          animate={{ opacity: gaugeOn ? 1 : 0 }}
          transition={safeMode ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
        >
          {/* Above-water bracket: the one visible result */}
          <line x1={372} y1={180} x2={372} y2={330} stroke="#fbbf24" strokeWidth={2} opacity={0.85} />
          <line x1={372} y1={180} x2={394} y2={180} stroke="#fbbf24" strokeWidth={2} opacity={0.85} />
          <line x1={372} y1={330} x2={394} y2={330} stroke="#fbbf24" strokeWidth={2} opacity={0.85} />
          <text
            x={340}
            y={255}
            transform="rotate(-90 340 255)"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize={26}
            letterSpacing={4}
            className="font-mono"
          >
            1 CUSTOMER EXPERIENCE
          </text>

          {/* Below-water bracket: four layers of foundation */}
          <line x1={372} y1={352} x2={372} y2={948} stroke="#7dd3fc" strokeWidth={2} opacity={0.85} />
          <line x1={372} y1={352} x2={394} y2={352} stroke="#7dd3fc" strokeWidth={2} opacity={0.85} />
          <line x1={372} y1={948} x2={394} y2={948} stroke="#7dd3fc" strokeWidth={2} opacity={0.85} />
          {[500, 660, 820].map((y) => (
            <line key={y} x1={372} y1={y} x2={386} y2={y} stroke="#7dd3fc" strokeWidth={2} opacity={0.45} />
          ))}
          <text
            x={336}
            y={650}
            transform="rotate(-90 336 650)"
            textAnchor="middle"
            fill="#7dd3fc"
            fontSize={26}
            letterSpacing={4}
            className="font-mono"
          >
            4 LAYERS OF OPERATIONS
          </text>
        </motion.g>
      </svg>

      {/* ---------------- HTML overlays -------------------------------- */}

      {/* Heading */}
      <div className="absolute" style={{ left: 110, top: 84, width: 520 }}>
        <Reveal show safeMode={safeMode}>
          <div
            className="font-mono"
            style={{ fontSize: 22, letterSpacing: 6, color: "#7dd3fc" }}
          >
            WHAT CUSTOMERS SEE — AND WHAT HOLDS IT UP
          </div>
          <h1
            className="font-display font-semibold"
            style={{ fontSize: 62, lineHeight: 1.05, marginTop: 14 }}
          >
            Below the waterline
          </h1>
        </Reveal>
      </div>

      {/* "The demo" callout — visible from step 0 */}
      <div className="absolute" style={{ left: 1180, top: 188, width: 620 }}>
        <Reveal show safeMode={safeMode} delay={0.15}>
          <div
            className="font-mono"
            style={{ fontSize: 30, letterSpacing: 5, color: "#fbbf24" }}
          >
            THE CUSTOMER EXPERIENCE
          </div>
          <div style={{ fontSize: 24, color: "#8b95a7", marginTop: 6 }}>
            what customers see — the policy, the claim, the renewal. ~15% of the mass.
          </div>
        </Reveal>
      </div>

      {/* Strata labels */}
      {STRATA.map((s, i) => (
        <div
          key={s.num}
          className="absolute"
          style={{ left: 1180, top: s.labelTop, width: 640 }}
        >
          <Reveal
            show={litFor(i)}
            safeMode={safeMode}
            delay={(i % 2) * 0.22 + 0.25}
            y={18}
          >
            <div className="flex items-baseline" style={{ gap: 16 }}>
              <span
                className="font-mono"
                style={{ fontSize: 22, color: "#7dd3fc", letterSpacing: 2 }}
              >
                {s.num}
              </span>
              <span
                className="font-display font-semibold"
                style={{ fontSize: 34, color: "#e8edf5" }}
              >
                {s.label}
              </span>
            </div>
            <div style={{ fontSize: 24, color: "#8b95a7", marginTop: 4, paddingLeft: 44 }}>
              {s.note}
            </div>
          </Reveal>
        </div>
      ))}

      {/* Closing ratio + line (step 3) */}
      <div
        className="absolute text-center"
        style={{ left: 0, right: 0, top: 984 }}
      >
        <Reveal show={gaugeOn} safeMode={safeMode} delay={0.3} y={20}>
          <div
            className="font-mono"
            style={{ fontSize: 24, letterSpacing: 5, color: "#7dd3fc" }}
          >
            4 LAYERS OF OPERATIONS : 1 CUSTOMER EXPERIENCE
          </div>
          <div
            className="font-display"
            style={{ fontSize: 38, color: "#e8edf5", marginTop: 10 }}
          >
            The customer experience is earned below the waterline — not at the front desk.
          </div>
        </Reveal>
      </div>
    </div>
  );
}
