"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import metrics from "./data/metrics.json";

export const meta: SlideMeta = {
  id: "device-formula",
  title: "Formula build-up",
  steps: 6,
  themes: [],
  group: "devices",
  hasSafeMode: true,
};

/** Base equation font size (px). Brief requires ≥80px on the 1920×1080 canvas. */
const EQ = 80;

/** Variables set in italic serif — mathematical convention; operators stay upright. */
const SERIF: CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: "italic",
  letterSpacing: "0.005em",
};

const TERMS = [
  { name: "Volume", gloss: "how many policies are in force", step: 1 },
  { name: "Retention", gloss: "how many customers stay each year", step: 2 },
  { name: "Efficiency", gloss: "how much revenue each unit generates", step: 3 },
  { name: "Risk", gloss: "the cost of claims and losses", step: 4 },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Drives the step-5 substitution: a single 0→1 progress value via rAF. */
function useSubstitution(run: boolean): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    if (!run) {
      // Reset inside a rAF callback — react-hooks forbids sync setState in effects.
      raf = requestAnimationFrame(() => setP(0));
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const DURATION = 1800;
    const tick = (t: number) => {
      const x = Math.min((t - t0) / DURATION, 1);
      setP(x);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return p;
}

function easeOut(x: number): number {
  const c = Math.min(Math.max(x, 0), 1);
  return 1 - Math.pow(1 - c, 3);
}

function Kicker() {
  return (
    <div
      className="absolute font-mono text-dim"
      style={{ left: 64, top: 52, fontSize: 17, letterSpacing: "0.3em" }}
    >
      DEVICE LAB · FORMULA BUILD-UP
    </div>
  );
}

function Operator({ children, size = EQ * 0.72 }: { children: string; size?: number }) {
  return (
    <span className="text-dim" style={{ fontSize: size, fontStyle: "normal" }}>
      {children}
    </span>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  if (safeMode) return <StaticPoster />;
  return <LiveSlide step={step} />;
}

function LiveSlide({ step }: { step: number }) {
  const p = useSubstitution(step >= 5);
  const numProgress = easeOut(p / 0.6);
  const levProgress = easeOut((p - 0.35) / 0.65);
  const delivered = (metrics.revenueM * numProgress).toFixed(1);
  const attended = (metrics.investedM * numProgress).toFixed(1);
  const leverage = (metrics.leverage * levProgress).toFixed(1);

  // The equation starts huge and settles as the derivation grows.
  const scale = step === 0 ? 1.5 : step === 1 ? 1.16 : step === 2 ? 1.05 : 1;

  const termColor = (termStep: number) =>
    step === termStep ? "text-accent" : "text-ink";

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <Kicker />

      <div style={{ height: 120 }} />

      {/* Equation zone — recenters itself as terms land (framer layout animations). */}
      <div className="flex w-full flex-1 items-center justify-center">
        <motion.div
          layout
          animate={{ scale }}
          transition={{
            scale: { duration: 0.6, ease: EASE },
            layout: { duration: 0.55, ease: EASE },
          }}
          className="flex items-center"
          style={{ gap: 34, fontSize: EQ }}
        >
          {/* Left side: Margin = */}
          <motion.div layout className="flex items-center" style={{ gap: 26 }}>
            <span className="text-ink" style={SERIF}>
              Margin
            </span>
            <Operator size={EQ * 0.8}>=</Operator>
          </motion.div>

          {/* Fraction: numerator terms land one per step; bar + denominator at step 4. */}
          <motion.div layout className="flex flex-col items-center">
            {step < 5 ? (
              <div className="flex items-center" style={{ gap: 18 }}>
                {TERMS.slice(0, 3).map(
                  (t, i) =>
                    step >= t.step && (
                      <motion.div
                        key={t.name}
                        layout
                        initial={{ opacity: 0, y: 34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="flex items-center"
                        style={{ gap: 18 }}
                      >
                        {i > 0 && <Operator>×</Operator>}
                        <span
                          className={`${termColor(t.step)} transition-colors duration-500`}
                          style={SERIF}
                        >
                          {t.name}
                        </span>
                      </motion.div>
                    ),
                )}
              </div>
            ) : (
              <motion.div
                key="numerator-substituted"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex items-baseline"
                style={{ gap: 16 }}
              >
                <span
                  className="font-mono text-ink"
                  style={{
                    fontSize: EQ,
                    fontWeight: 600,
                    width: 200,
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {delivered}
                </span>
                <span className="text-dim" style={{ fontSize: 28 }}>
                  $M revenue
                </span>
              </motion.div>
            )}

            {step >= 4 && (
              <motion.div
                layout
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="bg-ink"
                style={{
                  height: 5,
                  borderRadius: 3,
                  alignSelf: "stretch",
                  margin: "20px 0",
                }}
              />
            )}

            {step >= 4 &&
              (step < 5 ? (
                <motion.div
                  key="denominator-symbolic"
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
                >
                  <span
                    className={`${termColor(4)} transition-colors duration-500`}
                    style={SERIF}
                  >
                    Risk
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="denominator-substituted"
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex items-baseline"
                  style={{ gap: 16 }}
                >
                  <span
                    className="font-mono text-ink"
                    style={{
                      fontSize: EQ,
                      fontWeight: 600,
                      width: 200,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {attended}
                  </span>
                  <span className="text-dim" style={{ fontSize: 28 }}>
                    $M invested
                  </span>
                </motion.div>
              ))}
          </motion.div>

          {/* Final beat: the counted result. */}
          {step >= 5 && (
            <motion.div
              layout
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
              className="flex items-center"
              style={{ gap: 28 }}
            >
              <Operator size={EQ * 0.8}>=</Operator>
              <span
                className="font-mono text-amber"
                style={{
                  fontSize: 126,
                  fontWeight: 700,
                  width: 310,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {leverage}×
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Gloss column (steps 1–4) crossfades into a compact legend (step 5). */}
      <div className="relative" style={{ height: 300, width: 1640 }}>
        <div
          className="absolute left-0 right-0 top-0 flex flex-col items-center"
          style={{ gap: 16 }}
        >
          {TERMS.map((t) => (
            <Reveal key={t.name} show={step >= t.step && step < 5} safeMode={false}>
              <div className="flex items-baseline" style={{ gap: 20 }}>
                <span
                  className="text-accent"
                  style={{ ...SERIF, fontSize: 33, width: 330, textAlign: "right" }}
                >
                  {t.name}
                </span>
                <span className="text-dim" style={{ fontSize: 29, width: 640 }}>
                  — {t.gloss}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          show={step >= 5}
          safeMode={false}
          delay={0.5}
          className="absolute left-0 right-0 top-0"
        >
          <Legend />
        </Reveal>
      </div>

      <div style={{ height: 70 }} />

      <div className="absolute" style={{ left: 64, bottom: 48 }}>
        <Reveal show={step >= 1} safeMode={false}>
          <div className="font-mono text-dim" style={{ fontSize: 17 }}>
            Illustrative formula — not a fitted model
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/** Compact legend shown at the final step (and on the static poster). */
function Legend() {
  return (
    <div className="flex flex-col items-center" style={{ gap: 14 }}>
      <div className="flex justify-center" style={{ gap: 56 }}>
        {TERMS.slice(0, 2).map((t) => (
          <LegendItem key={t.name} name={t.name} gloss={t.gloss} />
        ))}
      </div>
      <div className="flex justify-center" style={{ gap: 56 }}>
        {TERMS.slice(2).map((t) => (
          <LegendItem key={t.name} name={t.name} gloss={t.gloss} />
        ))}
      </div>
      <div className="font-mono text-dim" style={{ fontSize: 20, marginTop: 16 }}>
        <span className="text-amber">4.9×</span> = $48.2M revenue ÷ $9.8M invested — Northwind Insurance, illustrative
      </div>
    </div>
  );
}

function LegendItem({ name, gloss }: { name: string; gloss: string }) {
  return (
    <span className="text-dim" style={{ fontSize: 22 }}>
      <span className="text-ink" style={{ ...SERIF, fontSize: 24 }}>
        {name}
      </span>{" "}
      · {gloss}
    </span>
  );
}

/**
 * Distinct static markup for safeMode — also what Overview renders as the
 * thumbnail poster: complete formula, substitution, result and legend.
 */
function StaticPoster() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <Kicker />

      {/* Complete symbolic formula. */}
      <div className="flex items-center" style={{ gap: 32, fontSize: EQ }}>
        <span className="text-ink" style={SERIF}>
          Margin
        </span>
        <Operator size={EQ * 0.8}>=</Operator>
        <div className="flex flex-col items-center">
          <div className="flex items-center" style={{ gap: 16 }}>
            {TERMS.slice(0, 3).map((t, i) => (
              <div key={t.name} className="flex items-center" style={{ gap: 16 }}>
                {i > 0 && <Operator>×</Operator>}
                <span className="text-ink" style={SERIF}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
          <div
            className="bg-ink"
            style={{
              height: 5,
              borderRadius: 3,
              alignSelf: "stretch",
              margin: "18px 0",
            }}
          />
          <span className="text-accent" style={SERIF}>
            Risk
          </span>
        </div>
      </div>

      {/* Substitution + result. */}
      <div className="flex items-center" style={{ gap: 30, marginTop: 70 }}>
        <span
          className="font-mono text-ink"
          style={{ fontSize: 40, fontVariantNumeric: "tabular-nums" }}
        >
          $48.2M revenue ÷ $9.8M invested
        </span>
        <span className="text-dim" style={{ fontSize: 44 }}>
          =
        </span>
        <span
          className="font-mono text-amber"
          style={{ fontSize: 110, fontWeight: 700 }}
        >
          4.9×
        </span>
      </div>

      <div style={{ marginTop: 60 }}>
        <Legend />
      </div>

      <div
        className="absolute font-mono text-dim"
        style={{ left: 64, bottom: 48, fontSize: 17 }}
      >
        Illustrative formula — not a fitted model
      </div>
    </div>
  );
}
