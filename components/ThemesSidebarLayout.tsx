"use client";

import type { ReactNode } from "react";
import { useDeck } from "@/components/DeckContext";
import { THEMES } from "@/deck/themes";
import type { ThemeStatus } from "@/lib/themeState";

/**
 * Opt-in shared slide LAYOUT (not global shell chrome): a slide that wants the
 * key-themes sidebar wraps its content in this. Cumulative "already touched"
 * state comes from DeckContext (derived from deck order — see lib/themeState.ts),
 * so it stays consistent across every slide that opts in.
 */
export default function ThemesSidebarLayout({ children }: { children: ReactNode }) {
  const { themes } = useDeck();
  return (
    <div className="flex h-full w-full">
      <aside className="flex w-[380px] shrink-0 flex-col justify-center gap-3 border-r border-edge bg-white/[0.015] px-10">
        <div className="mb-5 text-sm uppercase tracking-[0.3em] text-dim">Key themes</div>
        {THEMES.map((t) => {
          const status: ThemeStatus =
            (themes[t.id] as ThemeStatus | undefined) ?? "untouched";
          return (
            <div
              key={t.id}
              className={`flex items-center gap-4 rounded-lg border px-4 py-3 text-lg transition-colors duration-500 ${
                status === "current"
                  ? "border-white/20 bg-white/[0.06] text-white"
                  : status === "touched"
                    ? "border-transparent text-white/70"
                    : "border-transparent text-white/25"
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full transition-colors duration-500"
                style={{ background: status === "untouched" ? "#222b3a" : t.color }}
              />
              {t.label}
            </div>
          );
        })}
      </aside>
      <div className="relative min-w-0 flex-1">{children}</div>
    </div>
  );
}
