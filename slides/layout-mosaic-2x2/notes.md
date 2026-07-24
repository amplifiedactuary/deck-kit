# Notes — 06 · 2×2 mosaic (style lab)

## Design intent

- **Rhythm over hierarchy.** Four equal cells, four genres, one ignition per step.
  The pleasure of the slide is the cadence: stat → voice → trend → system, then the
  crosshair stitches them into one composition. No cell outranks another.
- **Dimmed, never absent.** Inactive cells render at opacity 0.16 with a slight scale
  reduction (0.985), so the grid silhouette is always legible and the audience can
  anticipate the next reveal. Empty cells would read as broken; dimmed cells read as
  "loaded, waiting".
- **Genre contrast is the point.** Each quadrant deliberately uses a different visual
  voice: display-type numerals (metric), serif-ish pull-quote with an oversized amber
  glyph (voice), hand-rolled SVG bars with a single amber peak (trend), and a node-fan
  diagram (system). Shared theme tokens keep the four genres feeling like one family.
- **The junction is the unifier.** The 32px gutters are reserved space; on the final
  step a 2px accent crosshair draws through them (entirely within the gutters — it
  never crosses a cell) and lands a rotated diamond on the exact centre (960, 540).
  That one touch converts "four panels" into "one argument with four faces".
- **Safe mode = poster.** Static branch drops all motion components; final step shows
  all four cells lit plus the crosshair — a strong static thumbnail for Overview.
- Geometry: PAD 96, GUTTER 32 → cells 848×428 at (96,96), (976,96), (96,556), (976,556).

## Template-ised

If this shipped as a reusable "mosaic-2x2" template in a ~50-template deck product,
it would parameterise:

- **Cell genre per quadrant** — pick each cell's type from a small genre library
  (big-stat, quote, micro-bar-chart, micro-line-chart, icon-diagram, image, keyword
  list), with the 4-genre mix validated to avoid repeats.
- **Cell content payloads** — one JSON object per cell (stat value/unit/label, quote
  text/attribution, series + axis labels, diagram node counts/labels).
- **Ignition order & step grouping** — permutation of quadrants; optionally ignite
  two cells on one step for 2- or 3-step variants; `steps` derived from the grouping.
- **Unifier style** — crosshair / centre badge / perimeter frame / none; accent
  colour token and draw timing.
- **Dim treatment** — dim opacity, scale, optional blur/desaturation for inactive cells.
- **Grid geometry** — outer pad and gutter width (with cell sizes derived); maybe a
  3-cell variant (one double-width row) as a sibling template rather than a parameter.
- **Highlight accents** — which bar is the "peak" (amber) bar, which tag numbers use
  accent vs dim, quote-glyph colour.
- Fixed (not parameterised): 1920×1080 canvas, tag row anatomy (NN · LABEL), the
  bottom-anchored content block inside each cell — that anatomy IS the template.

## Rehearsal

- One advance per beat; speak to each cell as it ignites (~20–30s each), then let the
  crosshair land in silence — it's the visual punchline.
- If replaying (R), the bars and crosshair re-draw; in safe mode everything is instant.
