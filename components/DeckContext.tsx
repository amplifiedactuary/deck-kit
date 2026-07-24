"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ThemeStatus } from "@/lib/themeState";

export interface DeckContextValue {
  index: number;
  step: number;
  safeMode: boolean;
  /** Derived theme statuses at this position (lib/themeState.ts); absent key = untouched. */
  themes: Record<string, Exclude<ThemeStatus, "untouched">>;
}

const DeckContext = createContext<DeckContextValue>({
  index: 0,
  step: 0,
  safeMode: false,
  themes: {},
});

export function DeckProvider({
  value,
  children,
}: {
  value: DeckContextValue;
  children: ReactNode;
}) {
  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export function useDeck(): DeckContextValue {
  return useContext(DeckContext);
}
