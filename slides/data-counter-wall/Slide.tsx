"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import wall from "./data/metrics.json";

export const meta: SlideMeta = {
  id: "data-counter-wall",
  title: "Counter wall",
  steps: 2,
  themes: [],
  group: "data",
  hasSafeMode: true,
};

interface Tile {
  id: string;
  label: string;
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  metric: string;
}

const TILES = wall.tiles as Tile[];
const HERO_ID = wall.heroId;
const KICKER = wall.kicker;

/** Scattered start offsets (s) — every tile begins within ~1.5 s, but unevenly. */
const DELAYS = [0.0, 0.55, 1.2, 0.3, 0.85, 0.1, 1.45, 0.65, 0.4, 1.0, 1.3, 0.2];

/** Bigger values count longer, so tiles finish in a rough size-ordered cascade. */
function countDuration(value: number): number {
  return 1.4 + Math.log10(Math.abs(value) + 1) * 0.34;
}

function formatValue(tile: Tile, v: number): string {
  const body =
    tile.decimals > 0
      ? v.toFixed(tile.decimals)
      : Math.round(v).toLocaleString("en-US");
  return `${tile.prefix}${body}${tile.suffix}`;
}

function numberClass(isHero: boolean): string {
  return `font-display text-[84px] font-semibold leading-none tracking-tight ${
    isHero ? "text-accent" : "text-ink"
  }`;
}

const LABEL_CLASS = "font-mono text-[21px] uppercase tracking-[0.18em] text-dim";

/** Live tile: count-up driven by a MotionValue (no setState loops). */
function AnimatedTile({
  tile,
  index,
  step,
}: {
  tile: Tile;
  index: number;
  step: number;
}) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => formatValue(tile, v));
  const isHero = tile.id === HERO_ID;
  const dimmed = step >= 1 && !isHero;
  const bloomed = step >= 1 && isHero;

  useEffect(() => {
    const controls = animate(mv, tile.value, {
      duration: countDuration(tile.value),
      delay: DELAYS[index % DELAYS.length],
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [mv, tile, index]);

  return (
    <motion.div
      className={`relative rounded-2xl border border-edge bg-panel ${isHero ? "z-10" : ""}`}
      animate={{ opacity: dimmed ? 0.14 : 1, scale: bloomed ? 1.5 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {isHero && (
        <motion.div
          aria-hidden
          className="absolute -inset-4 rounded-3xl bg-accent/25 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: bloomed ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        />
      )}
      <div className="relative flex h-full flex-col justify-center gap-4 px-9">
        <motion.span
          className={numberClass(isHero)}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {text}
        </motion.span>
        <span className={LABEL_CLASS}>{tile.label}</span>
      </div>
    </motion.div>
  );
}

/** safeMode tile: final value, no motion; dim/bloom applied as static styles. */
function StaticTile({ tile, step }: { tile: Tile; step: number }) {
  const isHero = tile.id === HERO_ID;
  const dimmed = step >= 1 && !isHero;
  const bloomed = step >= 1 && isHero;
  return (
    <div
      className={`relative rounded-2xl border border-edge bg-panel ${isHero ? "z-10" : ""}`}
      style={{
        opacity: dimmed ? 0.14 : 1,
        transform: bloomed ? "scale(1.5)" : undefined,
      }}
    >
      {bloomed && (
        <div aria-hidden className="absolute -inset-4 rounded-3xl bg-accent/25 blur-3xl" />
      )}
      <div className="relative flex h-full flex-col justify-center gap-4 px-9">
        <span
          className={numberClass(isHero)}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatValue(tile, tile.value)}
        </span>
        <span className={LABEL_CLASS}>{tile.label}</span>
      </div>
    </div>
  );
}

export default function Slide({ step, safeMode }: SlideProps) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[80px] top-[64px] font-mono text-[22px] uppercase tracking-[0.3em] text-dim">
        {KICKER}
      </div>

      <div className="absolute left-[80px] top-[140px] grid h-[804px] w-[1760px] grid-cols-4 grid-rows-3 gap-6">
        {TILES.map((tile, i) =>
          safeMode ? (
            <StaticTile key={tile.id} tile={tile} step={step} />
          ) : (
            <AnimatedTile key={tile.id} tile={tile} index={i} step={step} />
          ),
        )}
      </div>

      <Reveal
        show={step >= 1}
        safeMode={safeMode}
        className="absolute left-0 right-0 top-[982px] text-center"
      >
        <p className="font-display text-[40px] font-medium text-ink">
          Only one of these numbers is about our{" "}
          <span className="text-accent">customers</span>.
        </p>
      </Reveal>
    </div>
  );
}
