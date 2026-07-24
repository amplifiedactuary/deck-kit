# Rehearsal / agent-brief notes — 09 · Poster

## Design intent

- **One word must do all the work.** No charts, no bullets, no panels. If the
  audience reads anything, it's "GROWTH" — everything else is texture.
- **Scale contrast is the mechanism.** 440px display type vs 14px mono
  sublines. The subline only lands *because* the word is enormous; revealing it
  on its own step lets the contrast register as a beat, not just decoration.
- **Bleed = poster, contain = slide.** The word starts at x = -52 so the "A"
  is clipped by the canvas edge. That single clipped letterform is what shifts
  the read from "slide title" to "gig poster".
- **One accent, full bleed.** The red strike (#FF2D1F) runs edge to edge and
  cuts *through* the letters rather than underlining them — defiant, not
  decorative. Anything more (second colour, gradient, glow) would collapse the
  Swiss-poster discipline back into a normal deck look.
- **B/W supersedes the deck palette here on purpose** — this is a design probe
  at the contrast extreme; the deck's tokens (`bg`/`accent`/`amber`) are
  intentionally not used.
- **Motion is a stamp, not a float.** The word scales DOWN onto the canvas
  (1.4 → 1.0, ~0.45s, expo-out) so it lands with weight; the strike wipes
  left→right like a print pass. Corner marks fade late so the word owns the
  first half-second alone.

## Presenter beat (if this layout graduates)

Land the word in silence, let it sit, then speak the subline aloud as it
appears. The strike on step 2 is the punctuation for whatever sentence the
real talk puts here.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Poster / One-Word
Statement"), the template would parameterise:

- **`word`** (string, 1 word strongly recommended; 2 max) + optional
  per-deck auto-fit: compute font-size from glyph count so any word bleeds by
  a configurable overhang (here it's hand-tuned for 7 letters at 440px).
- **`subline`** (string) and **`sublineScalePx`** (default 14) — the
  counter-scale caption; template enforces a minimum scale *ratio* (e.g.
  ≥ 20:1 word:subline) so the drama survives careless content.
- **`accent`**: `{ kind: "strike" | "underline" | "offset-duplicate" |
  "knockout" | "none", color }` — exactly one gesture, enum-enforced. Strike
  position as a fraction of cap height (here ~0.62).
- **`paper` / `ink`** colour pair (default black/white; template should warn
  if contrast ratio < 12:1 — projector readability is the whole point).
- **`cornerMarks`**: up to 4 optional 14px mono strings (event name, slide
  number, date) with a fixed 100/88px margin grid.
- **`bleedEdge`**: which canvas edge(s) the word may clip (left here), or
  "none" for a contained variant.
- **Step choreography presets**: `stamp | fade | none` for the word's
  entrance, and whether subline/accent get their own steps (3-step, as here)
  or arrive together (2-step) — plus the mandatory static safeMode render,
  which the template generates for free from the final-state markup.
- **Type controls**: display font weight (800 here), tracking (-0.045em),
  uppercase toggle. Lining the word up needs cap-height-aware positioning if
  the font is swappable.
