export interface DeckPosition {
  slide: number;
  step: number;
}

/** Next step, or next slide at step 0, or null at the end of the deck. */
export function advance(pos: DeckPosition, stepCounts: number[]): DeckPosition | null {
  const steps = Math.max(stepCounts[pos.slide] ?? 1, 1);
  if (pos.step < steps - 1) return { slide: pos.slide, step: pos.step + 1 };
  if (pos.slide < stepCounts.length - 1) return { slide: pos.slide + 1, step: 0 };
  return null;
}

/** Previous step, or the previous slide's FINAL step, or null at the start of the deck. */
export function retreat(pos: DeckPosition, stepCounts: number[]): DeckPosition | null {
  if (pos.step > 0) return { slide: pos.slide, step: pos.step - 1 };
  if (pos.slide > 0) return { slide: pos.slide - 1, step: (Math.max(stepCounts[pos.slide - 1] ?? 1, 1)) - 1 };
  return null;
}

/** Clamp an arbitrary (e.g. hash-parsed) position into the deck's bounds. */
export function clampPosition(pos: DeckPosition, stepCounts: number[]): DeckPosition {
  const slide = Math.min(Math.max(pos.slide, 0), stepCounts.length - 1);
  const step = Math.min(Math.max(pos.step, 0), Math.max(stepCounts[slide] ?? 1, 1) - 1);
  return { slide, step };
}
