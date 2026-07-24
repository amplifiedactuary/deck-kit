// Kinetic-typography choreography script.
// Edit copy and per-word motion here without touching Slide.tsx.
//
// Each line is a phrase that assembles on its own step. Words arrive with a
// varied "entrance vector" so the composition feels musical rather than uniform.
// `hero: true` marks the word that lands last and carries the visual weight.

export type Vector = "up" | "drop" | "scale" | "blur" | "left" | "right";

export interface KineticWord {
  text: string;
  /** Entrance choreography for this word. */
  vector: Vector;
  /** Relative type scale. 1 = body of the phrase; hero words sit larger. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Visual weight. */
  weight?: "light" | "normal" | "semibold" | "bold";
  /** Accent colouring — the hero word lands in amber. */
  tone?: "ink" | "dim" | "accent" | "amber";
  /** Forces this word to settle last regardless of order (the hero landing). */
  hero?: boolean;
}

export interface KineticPhrase {
  /** Step (0-based) on which this phrase assembles. */
  step: number;
  words: KineticWord[];
}

export const PHRASES: KineticPhrase[] = [
  {
    step: 0,
    words: [
      { text: "Customers", vector: "blur", size: "lg", weight: "light", tone: "dim" },
      { text: "don't", vector: "up", size: "lg", weight: "semibold" },
      { text: "want", vector: "drop", size: "lg", weight: "light", tone: "dim" },
      { text: "products.", vector: "scale", size: "lg", weight: "semibold" },
    ],
  },
  {
    step: 1,
    words: [
      { text: "They", vector: "left", size: "xl", weight: "light", tone: "dim" },
      { text: "want", vector: "drop", size: "xl", weight: "light", tone: "dim" },
      {
        text: "certainty.",
        vector: "scale",
        size: "xl",
        weight: "bold",
        tone: "amber",
        hero: true,
      },
    ],
  },
];

/** Full assembled statement, used by the safeMode static fallback. */
export const STATEMENT = PHRASES.map((p) =>
  p.words.map((w) => w.text).join(" "),
);
