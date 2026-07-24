"use client";

import { useState } from "react";
import { DeckProvider } from "@/components/DeckContext";
import { curationFor } from "@/deck/curation";
import { deck } from "@/deck/deck";
import { themeStatuses } from "@/lib/themeState";
import type { Rating } from "@/lib/types";

const CARD_W = 340;
const CARD_H = CARD_W * (1080 / 1920); // 191.25 — exact aspect, avoids clipping the bottom edge

type Indexed = { entry: (typeof deck)[number]; index: number };
type Section = { key: string; label: string; entries: Indexed[]; muted?: boolean };
type ViewMode = "rating" | "category" | "segment";

// Rating buckets in display order: favourites first, Pass (and unassigned) recede to the end.
const RATING_ORDER: Rating[] = ["loved", "maybe", "inspiration", "unrated", "pass"];
const RATING_LABEL: Record<Rating, string> = {
  loved: "⭐ Loved",
  maybe: "~ Maybe",
  inspiration: "💡 Inspiration",
  unrated: "· Unrated",
  pass: "✗ Pass",
};
const RATING_GLYPH: Record<Rating, string> = {
  loved: "★",
  maybe: "~",
  inspiration: "✦",
  unrated: "·",
  pass: "✗",
};
const RATING_BADGE_CLASS: Record<Rating, string> = {
  loved: "text-amber",
  maybe: "text-white/70",
  inspiration: "text-white/70",
  unrated: "text-dim",
  pass: "text-dim",
};

function allIndexed(): Indexed[] {
  return deck.map((entry, index) => ({ entry, index }));
}

/** Within a section, place each built variation immediately after its parent slide (by id). */
function orderWithVariants(items: Indexed[]): Indexed[] {
  const ids = new Set(items.map((it) => it.entry.meta.id));
  const variantsByParent = new Map<string, Indexed[]>();
  const roots: Indexed[] = [];
  for (const it of items) {
    const parent = curationFor(it.entry.meta.id).variantOf;
    if (parent && ids.has(parent)) {
      const arr = variantsByParent.get(parent) ?? [];
      arr.push(it);
      variantsByParent.set(parent, arr);
    } else {
      roots.push(it);
    }
  }
  const out: Indexed[] = [];
  for (const it of roots) {
    out.push(it);
    for (const v of variantsByParent.get(it.entry.meta.id) ?? []) out.push(v);
  }
  return out;
}

function sectionsByRating(): Section[] {
  const all = allIndexed();
  return RATING_ORDER.map((r) => ({
    key: r,
    label: RATING_LABEL[r],
    entries: orderWithVariants(all.filter((it) => curationFor(it.entry.meta.id).rating === r)),
    muted: r === "pass",
  })).filter((s) => s.entries.length > 0);
}

function sectionsByCategory(): Section[] {
  const map = new Map<string, Indexed[]>();
  const order: string[] = [];
  for (const it of allIndexed()) {
    const key = it.entry.meta.group ?? "__ungrouped";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(it);
  }
  return order.map((key) => ({
    key,
    label: key === "__ungrouped" ? "Exemplars" : titleCase(key),
    entries: map.get(key)!,
  }));
}

/** By talk beat (curation.servesSegment) — populated as real content slides are built. */
function sectionsBySegment(): Section[] {
  const map = new Map<string, Indexed[]>();
  const order: string[] = [];
  for (const it of allIndexed()) {
    const key = curationFor(it.entry.meta.id).servesSegment ?? "__unassigned";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(it);
  }
  // Assigned beats first (in first-encounter order); the big "unassigned" pool last.
  order.sort((a, b) => Number(a === "__unassigned") - Number(b === "__unassigned"));
  return order.map((key) => ({
    key,
    label: key === "__unassigned" ? "Unassigned (no talk beat yet)" : key,
    entries: orderWithVariants(map.get(key)!),
    muted: key === "__unassigned",
  }));
}

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Overview({
  currentIndex,
  onSelect,
}: {
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  const [view, setView] = useState<ViewMode>("rating");
  const sections =
    view === "rating" ? sectionsByRating() : view === "category" ? sectionsByCategory() : sectionsBySegment();

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-10 px-16 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl font-semibold text-dim">Overview</h2>
          <div className="flex gap-1 rounded-lg border border-edge p-1 text-sm">
            {(["rating", "category", "segment"] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setView(m)}
                className={`rounded px-3 py-1 ${
                  view === m ? "bg-white/10 text-white" : "text-dim hover:text-white/70"
                }`}
              >
                {m === "segment" ? "by talk segment" : `by ${m}`}
              </button>
            ))}
          </div>
        </div>

        {sections.map((section) => (
          <section key={section.key} className={`flex flex-col gap-5 ${section.muted ? "opacity-45" : ""}`}>
            <h3 className="border-b border-edge pb-2 font-display text-2xl font-semibold tracking-wide text-white/60">
              {section.label}
              <span className="ml-3 text-base font-normal text-dim">{section.entries.length}</span>
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-x-8 gap-y-10">
              {section.entries.map(({ entry, index: i }) => {
                const C = entry.Component;
                const finalStep = entry.meta.steps - 1;
                const cur = curationFor(entry.meta.id);
                const isVariant = Boolean(cur.variantOf);
                return (
                  <button
                    key={entry.meta.id}
                    type="button"
                    aria-current={i === currentIndex ? "true" : undefined}
                    onClick={() => {
                      // Clicking a card jumps to that slide at step 0 (a presenter re-presents from the
                      // top; the card preview shows the final step).
                      onSelect(i);
                    }}
                    className={`group flex flex-col gap-3 text-left ${isVariant ? "ml-6" : ""}`}
                  >
                    <div
                      className={`pointer-events-none relative overflow-hidden rounded-lg border bg-bg ${
                        i === currentIndex ? "border-accent" : "border-edge group-hover:border-white/30"
                      }`}
                      style={{ width: CARD_W, height: CARD_H }}
                    >
                      <div
                        style={{
                          width: 1920,
                          height: 1080,
                          transform: `scale(${CARD_W / 1920})`,
                          transformOrigin: "top left",
                        }}
                      >
                        {/* Nested provider deliberately overrides Deck's outer context with this card's position. */}
                        <DeckProvider
                          value={{
                            index: i,
                            step: finalStep,
                            safeMode: true,
                            themes: themeStatuses(deck, i),
                          }}
                        >
                          <C
                            step={finalStep}
                            totalSteps={entry.meta.steps}
                            isActive={false}
                            direction={1}
                            restartKey={0}
                            safeMode
                          />
                        </DeckProvider>
                      </div>
                    </div>
                    <div className="text-lg text-dim">
                      <span className={`mr-2 font-mono ${RATING_BADGE_CLASS[cur.rating]}`}>
                        {RATING_GLYPH[cur.rating]} {cur.no}
                      </span>
                      {isVariant && <span className="mr-1 text-white/30">↳</span>}
                      {entry.meta.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
