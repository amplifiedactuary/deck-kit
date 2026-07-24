# Notes — data-agents-line (self-drawing agents line)

## Design intent

- **The draw IS the story.** The 11-second sweep re-enacts the year in miniature:
  a rise, a peak, a mid-year recovery, a year-end drift. The custom easing
  (precomputed drag table inverted into an ease function) slows the head through the
  peak and the product-refresh moment so the two dramatic moments get screen time, and
  glides through the stable middle. Linear time would bury the peak in ~0.3 s.
- **One master motion value.** Everything — stroke tip (`pathLength`, arc-length
  remapped), area clip width, head dot x/y, annotation triggers — derives from a single
  `progress` value. That guarantees the dot, the stroke tip, and the fill edge can
  never desync, and replay (R) is just a remount.
- **Restraint.** Single accent (sky) for the data, amber strictly for annotations and
  the peak stat, dim/ink for chrome. The only glow in the whole slide is the head dot
  (one blurred circle). No band shading — the monthly NPS series needs no night-band
  analogue.
- **Honesty.** Sample numbers (1,840 respondents / 64 peak / 12 months) sit in the fact
  strip; the synthetic curve is disclosed in the on-slide footnote. Only
  `data/agents-series.json` needs replacing to swap in real data — the component is
  data-driven.
- **Projector-readable:** 20px+ axis labels, 23px annotations, 3.5px stroke, high
  contrast on dark.

## Why not clip-rect for the stroke too?

A clip rect wipes the stroke in x — fine — but `pathLength` gives the genuine
"pen drawing" feel (round cap tip advancing along the curve) and is the declarative,
lint-safe primitive the brief asks for. The arc-length lookup table converts x-progress
into path-length fraction so both reveals share one clock.

## Template-ised: what a reusable "self-drawing annotated line" template would parameterise

Imagine this ships as one of ~50 deck templates ("animated KPI timeline"). The
parameter surface:

1. **Series** — `points: [x, y][]` (any units), x/y domain, optional multiple series.
2. **Axes** — x tick list with labels (time or numeric), y ticks, axis captions,
   optional band shading regions (here: nights) with a label.
3. **Annotations** — list of `{x, label, emphasis?}`; the template auto-computes y from
   the series and auto-places labels (above/right with collision nudging) — the manual
   `LAYOUT` dx/dy table is exactly the part a product version must automate.
4. **Draw choreography** — total duration, delay, and a list of `{x, weight}` "linger
   points" compiled into the drag-table easing (here: peak + sprint + soft start/end).
   Possibly a `style: "draw" | "wipe" | "instant"` switch.
5. **Reference layers** — optional average/target/threshold lines with label, revealed
   on a chosen step.
6. **Narrative slots** — kicker / title / subtitle, fact-strip stats (value + label +
   accent flag), takeaway sentence with highlighted spans, provenance footnote.
7. **Theme hooks** — accent/annotation colours from theme tokens; glow on/off.
8. **Steps mapping** — which layers belong to which step index; safe-mode poster is
   derived automatically (all layers, no animation) so `hasSafeMode` comes free.

The generic engine bits (monotone interpolation, arc-length table, drag-table easing,
single-progress animation, static fallback) are 100% reusable as a lib; only the
data, copy, and linger points are per-talk. A skill version would take a CSV/JSON +
4–6 prompts (title, annotations, linger points, takeaway) and emit the folder.

## Rehearsal

- Speak over the draw: kick off the slide, narrate "this is the full year in eleven
  seconds" — campaign launch lands ~2 s in, the peak linger gives ~2 s to hit the
  "64 NPS" beat, mid-year product refresh adds a second linger, year-end dip closes.
- Advance to step 1 only after the draw completes: the average line is the punchline
  ("sustained above 40 for the full second half").
- If projector/GPU struggles, safe mode shows the finished poster — the deck still works.
