export type ThemeStatus = "current" | "touched" | "untouched";

/** Minimal structural type so pure logic doesn't depend on React component types. */
interface HasThemes {
  meta: { themes: string[] };
}

/**
 * Compute each theme's status at a given slide index, purely from deck order.
 * Themes absent from the result are untouched. Because this is derived (not
 * accumulated at runtime), jumping around via overview can never desync it.
 */
export function themeStatuses(deck: HasThemes[], slideIndex: number): Record<string, Exclude<ThemeStatus, "untouched">> {
  const out: Record<string, Exclude<ThemeStatus, "untouched">> = {};
  deck.forEach((entry, i) => {
    if (i > slideIndex) return;
    for (const t of entry.meta.themes) {
      out[t] = i === slideIndex ? "current" : "touched";
    }
  });
  return out;
}
