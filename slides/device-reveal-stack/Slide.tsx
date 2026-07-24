"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "device-reveal-stack",
  title: "Reveal stack",
  steps: 5,
  themes: [],
  group: "devices",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Scene data — fixed 1920×1080 canvas, absolute pixels.               */
/*                                                                     */
/* A claim that DEEPENS panel by panel. Each step pushes a new card    */
/* onto the stack; the card on top is the current depth of the claim.  */
/* Cards below recede (scale down, drift up-left, dim) so the stack    */
/* reads as physical depth — surface claim at the back, caveat in      */
/* front. NOTE: all content below is INVENTED placeholder data for     */
/* this example slide. See README.md.                                  */
/* ------------------------------------------------------------------ */

interface Panel {
  /** Kicker label running above the card title. */
  kicker: string;
  /** Accent token: blue = supporting depth, amber = the honest caveat. */
  tone: "blue" | "amber";
  /** Headline of this layer of the claim. */
  title: string;
  /** The one-line body that deepens the claim. */
  body: string;
  /** Optional crisp stat shown as a chip in the card's footer. */
  stat?: { value: string; unit: string };
}

const PANELS: Panel[] = [
  {
    kicker: "THE HEADLINE",
    tone: "blue",
    title: "Northwind Insurance retention is up for the third consecutive year.",
    body: "The number everyone leads with — and the result that sounds like a simple win.",
    stat: { value: "91", unit: "% retained" },
  },
  {
    kicker: "THE MECHANISM",
    tone: "blue",
    title: "Not luck — a deliberate shift to proactive customer engagement.",
    body: "Retention rose when renewal teams moved from reactive calls to structured outreach programmes.",
    stat: { value: "3", unit: "touchpoints per renewal" },
  },
  {
    kicker: "THE EVIDENCE",
    tone: "blue",
    title: "The data is in the cohort analysis, not the headline rate.",
    body: "Every cohort tracked from first policy to year five — churn, upgrade, and lapse all measured.",
    stat: { value: "84.2", unit: "K policyholders tracked" },
  },
  {
    kicker: "WHAT MADE IT HOLD",
    tone: "blue",
    title: "Pricing discipline carried the weight that promotions couldn't.",
    body: "Stable pricing, clear cover, and fast claims settlement built the trust that keeps customers.",
    stat: { value: "4.6", unit: "satisfaction score" },
  },
  {
    kicker: "THE HONEST CAVEAT",
    tone: "amber",
    title: "Remove the relationship and the number softens.",
    body: "Retention is not yet structural — it tracks relationship quality, which requires sustained investment.",
    stat: { value: "1", unit: "renewal team per region" },
  },
];

/* Stack geometry. The TOP (front) card sits at depthIndex 0; deeper
 * cards step back by these deltas. We render back-to-front so the
 * newest (front) card overlaps the rest. */
const CARD_W = 1180;
const CARD_H = 470;
const CARD_CENTER_X = 1010; // card centre on canvas
const CARD_CENTER_Y = 596;
const OFFSET_X = -46; // each deeper card drifts left
const OFFSET_Y = -34; // ...and up
const SCALE_STEP = 0.052; // ...and shrinks
const DIM_STEP = 0.26; // ...and dims

const ACCENT = { blue: "#7dd3fc", amber: "#fbbf24" } as const;

/** Faint ambient depth marks behind the stack: [x, y, r, opacity]. */
const MOTES: [number, number, number, number][] = [
  [240, 300, 2.0, 0.1], [360, 760, 1.4, 0.08], [180, 540, 1.6, 0.09],
  [1560, 300, 1.8, 0.1], [1700, 640, 1.4, 0.08], [1640, 880, 2.0, 0.1],
  [1780, 460, 1.3, 0.07], [300, 920, 1.5, 0.08], [1500, 980, 1.2, 0.07],
  [150, 760, 1.3, 0.06],
];

export default function Slide({ step, safeMode }: SlideProps) {
  // visibleCount: how many panels have been pushed onto the stack.
  // Step 0 shows the first (surface) card; each step pushes one more.
  const visibleCount = safeMode ? PANELS.length : Math.min(step + 1, PANELS.length);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Backdrop wash + ambient motes ----------------------------------- */}
      <svg
        className="absolute inset-0"
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        aria-hidden
      >
        <defs>
          <radialGradient id="rs-wash" cx="0.52" cy="0.46" r="0.75">
            <stop offset="0%" stopColor="#101826" />
            <stop offset="60%" stopColor="#0a0f18" />
            <stop offset="100%" stopColor="#07090d" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#rs-wash)" />
        {MOTES.map(([x, y, r, o]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#7dd3fc" opacity={o} />
        ))}
      </svg>

      {/* Heading --------------------------------------------------------- */}
      <div className="absolute" style={{ left: 110, top: 78, width: 1000 }}>
        <Reveal show safeMode={safeMode}>
          <div
            className="font-mono"
            style={{ fontSize: 22, letterSpacing: 6, color: ACCENT.blue }}
          >
            PROGRESSIVE DISCLOSURE
          </div>
          <h1
            className="font-display font-semibold"
            style={{ fontSize: 60, lineHeight: 1.05, marginTop: 12 }}
          >
            The same claim, one layer deeper each time.
          </h1>
        </Reveal>
      </div>

      {/* Depth-meter label (right rail) ---------------------------------- */}
      <div
        className="absolute font-mono"
        style={{
          left: 1748,
          top: 250,
          height: 600,
          fontSize: 18,
          letterSpacing: 4,
          color: "#8b95a7",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        SURFACE → DEPTH
      </div>
      <svg
        className="absolute"
        style={{ left: 1700, top: 250 }}
        width={40}
        height={600}
        viewBox="0 0 40 600"
        aria-hidden
      >
        <line x1={20} y1={0} x2={20} y2={600} stroke="#1d2533" strokeWidth={3} />
        {PANELS.map((p, i) => {
          const y = 26 + (i * 548) / (PANELS.length - 1);
          const on = i < visibleCount;
          return (
            <motion.circle
              key={p.kicker}
              cx={20}
              cy={y}
              r={on ? 9 : 6}
              fill={on ? ACCENT[p.tone] : "#1d2533"}
              initial={false}
              animate={{ opacity: on ? 1 : 0.6 }}
              transition={safeMode ? { duration: 0 } : { duration: 0.4 }}
            />
          );
        })}
      </svg>

      {/* The stack ------------------------------------------------------- */}
      {/* Render BACK-TO-FRONT so the newest card overlaps. The newest
          visible panel sits at depthIndex 0 (front, full size, full
          colour); older panels recede behind it. */}
      <div className="absolute" style={{ left: 0, top: 0, width: 1920, height: 1080 }}>
        {PANELS.map((p, i) => {
          if (i >= visibleCount) return null;
          // depthIndex 0 == the frontmost (newest) card.
          const depthIndex = visibleCount - 1 - i;
          const isFront = depthIndex === 0;
          const tx = depthIndex * OFFSET_X;
          const ty = depthIndex * OFFSET_Y;
          const scale = 1 - depthIndex * SCALE_STEP;
          const dim = Math.max(0.18, 1 - depthIndex * DIM_STEP);
          const accent = ACCENT[p.tone];
          const left = CARD_CENTER_X - CARD_W / 2;
          const top = CARD_CENTER_Y - CARD_H / 2;

          return (
            <motion.div
              key={p.kicker}
              className="absolute"
              style={{
                left,
                top,
                width: CARD_W,
                height: CARD_H,
                transformOrigin: "50% 50%",
                zIndex: 100 - depthIndex,
              }}
              initial={
                safeMode
                  ? false
                  : { opacity: 0, x: tx + 70, y: ty + 26, scale: scale * 0.97 }
              }
              animate={{ opacity: dim, x: tx, y: ty, scale }}
              transition={
                safeMode
                  ? { duration: 0 }
                  : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 22,
                  background: "linear-gradient(150deg, #141b27 0%, #0e131d 100%)",
                  border: `1px solid ${isFront ? accent : "#1d2533"}`,
                  boxShadow: isFront
                    ? "0 40px 90px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(125,211,252,0.13)"
                    : "0 28px 60px -28px rgba(0,0,0,0.8)",
                  padding: "46px 56px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Accent spine on the left edge */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 7,
                    background: accent,
                    opacity: isFront ? 1 : 0.5,
                  }}
                />
                {/* Faint depth-index numeral */}
                <div
                  className="font-mono"
                  style={{
                    position: "absolute",
                    right: 40,
                    top: 38,
                    fontSize: 80,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: accent,
                    opacity: 0.16,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div
                  className="font-mono"
                  style={{ fontSize: 22, letterSpacing: 5, color: accent }}
                >
                  {p.kicker}
                </div>
                <div
                  className="font-display font-semibold"
                  style={{
                    fontSize: 52,
                    lineHeight: 1.08,
                    color: "#e8edf5",
                    marginTop: 22,
                    maxWidth: 900,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 27,
                    lineHeight: 1.4,
                    color: "#8b95a7",
                    marginTop: 22,
                    maxWidth: 880,
                  }}
                >
                  {p.body}
                </div>

                {p.stat && (
                  <div
                    style={{
                      position: "absolute",
                      left: 56,
                      bottom: 40,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 14,
                    }}
                  >
                    <span
                      className="font-display font-semibold"
                      style={{ fontSize: 46, color: accent, lineHeight: 1 }}
                    >
                      {p.stat.value}
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: 20, letterSpacing: 2, color: "#8b95a7" }}
                    >
                      {p.stat.unit}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer reading-aid — names the frontmost layer ------------------ */}
      <div className="absolute text-center" style={{ left: 0, right: 0, top: 998 }}>
        <Reveal show safeMode={safeMode} delay={0.1} y={16}>
          <div
            className="font-mono"
            style={{ fontSize: 22, letterSpacing: 4, color: "#8b95a7" }}
          >
            {safeMode
              ? "HEADLINE ▸ MECHANISM ▸ EVIDENCE ▸ FOUNDATION ▸ CAVEAT"
              : `LAYER ${visibleCount} OF ${PANELS.length} — ${PANELS[visibleCount - 1].kicker}`}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
