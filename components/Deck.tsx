"use client";

import { AnimatePresence, motion } from "framer-motion";
import CanvasScaler from "@/components/CanvasScaler";
import { DeckProvider } from "@/components/DeckContext";
import NavButtons from "@/components/NavButtons";
import Overview from "@/components/Overview";
import { useDeckNavigation } from "@/components/useDeckNavigation";
import { curationFor } from "@/deck/curation";
import { deck } from "@/deck/deck";
import { themeStatuses } from "@/lib/themeState";

export default function Deck() {
  const nav = useDeckNavigation();
  const entry = deck[nav.index];
  const Slide = entry.Component;

  const totalSteps = deck.reduce((n, s) => n + s.meta.steps, 0);
  const progressed = deck.slice(0, nav.index).reduce((n, s) => n + s.meta.steps, 0) + nav.step + 1;

  return (
    // Context value is rebuilt each render — fine at deck scale; memoize if slides ever over-render.
    <DeckProvider
      value={{
        index: nav.index,
        step: nav.step,
        safeMode: nav.safeMode,
        themes: themeStatuses(deck, nav.index),
      }}
    >
      <CanvasScaler>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${nav.index}-${nav.restartKey}`}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 60 * nav.direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: nav.safeMode ? 0 : 0.3, ease: "easeOut" }}
          >
            <Slide
              step={nav.step}
              totalSteps={entry.meta.steps}
              isActive
              direction={nav.direction}
              restartKey={nav.restartKey}
              safeMode={nav.safeMode}
            />
          </motion.div>
        </AnimatePresence>
      </CanvasScaler>

      {nav.overview && <Overview currentIndex={nav.index} onSelect={nav.jumpTo} />}

      <NavButtons onPrev={nav.prev} onNext={nav.next} onOverview={nav.toggleOverview} onFullscreen={nav.toggleFullscreen} />

      {/* Subtle progress hairline across the very bottom of the screen. */}
      <div className="fixed bottom-0 left-0 z-40 h-[3px] w-full bg-white/5">
        <div
          className="h-full bg-white/25 transition-[width] duration-300"
          style={{ width: `${(progressed / totalSteps) * 100}%` }}
        />
      </div>

      {/* Stable slide-number badge (curation/dev aid) — top-left, same spot on every
          slide. Hidden in present mode (P) so the live audience never sees it. */}
      {!nav.overview && !nav.presentMode && (
        <div className="fixed left-4 top-4 z-50 rounded border border-white/15 bg-black/40 px-2 py-1 font-mono text-sm tracking-wider text-white/55">
          {curationFor(entry.meta.id).no}
        </div>
      )}

      {nav.safeMode && (
        <div className="fixed bottom-4 left-4 z-50 rounded border border-amber/40 px-2 py-1 text-xs tracking-widest text-amber">
          SAFE
        </div>
      )}
    </DeckProvider>
  );
}
