"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { deck } from "@/deck/deck";
import { advance, clampPosition, retreat, type DeckPosition } from "@/lib/navigation";
import type { Direction } from "@/lib/types";

export interface DeckNav {
  index: number;
  step: number;
  direction: Direction;
  restartKey: number;
  safeMode: boolean;
  /** When true, dev/curation chrome (the slide-number badge) is hidden for a live audience. */
  presentMode: boolean;
  overview: boolean;
  next: () => void;
  prev: () => void;
  jumpTo: (slide: number) => void;
  toggleOverview: () => void;
  toggleFullscreen: () => void;
}

/**
 * All presenter controls in one hook.
 * Keyboard: ArrowRight/Space/PageDown = next · ArrowLeft/PageUp = prev (PageUp/Down
 * are what physical clickers emit) · R restart · F fullscreen · O overview ·
 * S safe mode · P present mode (hide the slide-number badge) · Home/End first/final
 * slide · Escape closes overview.
 * Position is mirrored into the URL hash (#<slide-id>.<step>) so a mid-talk
 * reload restores where you were.
 */
export function useDeckNavigation(): DeckNav {
  const stepCounts = useMemo(() => deck.map((s) => s.meta.steps), []);
  const [position, setPosition] = useState<DeckPosition>(() => {
    // Restore position from the URL hash on first render (client only).
    if (typeof window !== "undefined") {
      const m = window.location.hash.match(/^#([a-z0-9-]+)(?:\.(\d+))?$/);
      if (m) {
        const slide = deck.findIndex((s) => s.meta.id === m[1]);
        if (slide !== -1) {
          return clampPosition({ slide, step: Number(m[2] ?? 0) }, deck.map((s) => s.meta.steps));
        }
      }
    }
    return { slide: 0, step: 0 };
  });
  const [direction, setDirection] = useState<Direction>(1);
  const [restartKey, setRestartKey] = useState(0);
  const [safeMode, setSafeMode] = useState(false);
  const [presentMode, setPresentMode] = useState(false);
  const [overview, setOverview] = useState(false);

  const next = useCallback(() => {
    setPosition((p) => advance(p, stepCounts) ?? p);
    setDirection(1);
  }, [stepCounts]);

  const prev = useCallback(() => {
    setPosition((p) => retreat(p, stepCounts) ?? p);
    setDirection(-1);
  }, [stepCounts]);

  // Used by overview mode (click a card to jump).
  const jumpTo = useCallback((slide: number) => {
    setPosition({ slide, step: 0 });
    setDirection(1);
    setOverview(false);
  }, []);

  const toggleOverview = useCallback(() => setOverview((o) => !o), []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  // Mirror position into the hash.
  useEffect(() => {
    history.replaceState(null, "", `#${deck[position.slide].meta.id}.${position.step}`);
  }, [position]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return; // one press = one action — a held/stuck key must not machine-gun the deck
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          setPosition({ slide: 0, step: 0 });
          setDirection(-1);
          break;
        case "End":
          e.preventDefault();
          setPosition({ slide: deck.length - 1, step: stepCounts[deck.length - 1] - 1 });
          setDirection(1);
          break;
        case "r":
        case "R":
          setPosition((p) => ({ slide: p.slide, step: 0 }));
          setDirection(1);
          setRestartKey((k) => k + 1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "o":
        case "O":
          setOverview((o) => !o);
          break;
        case "s":
        case "S":
          setSafeMode((v) => !v);
          break;
        case "p":
        case "P":
          setPresentMode((v) => !v);
          break;
        case "Escape":
          setOverview(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, stepCounts, toggleFullscreen]);

  return {
    index: position.slide,
    step: position.step,
    direction,
    restartKey,
    safeMode,
    presentMode,
    overview,
    next,
    prev,
    jumpTo,
    toggleOverview,
    toggleFullscreen,
  };
}
