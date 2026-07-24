# Notes — data-calendar-heat

## Design intent

- **One idea per glance:** the grid IS the argument. Daytime clusters = the human
  at the wheel; glowing overnight cells = agents running unattended; the dark
  Mon 03–07 band = honest silence. No chart literacy required — every senior
  actuary has seen a GitHub-style contribution grid or a risk heat map.
- **Cinematic, not decorative:** the ignition sweep replays the build's clock in
  ~5 s. The warm flash-then-settle gives each hour a moment of presence; the
  day-by-day cadence (small pause between rows) makes the three-day structure
  legible without narration.
- **Glow as semantics, not garnish:** box-shadow glow is reserved for overnight
  hours with activity (plus a faint version on peak-level cells). It encodes the
  talk's core line — "the machine worked while I slept" — directly in light.
- **Restraint:** five colour stops only, white rings/leaders for annotation,
  permanent "illustrative" footnote for honesty. Out-of-window hours are fainter
  voids so the 61-hour window reads as a shape, not a full week.
- **Step discipline:** empty grid first (anticipation), sweep second (spectacle
  with meaning), annotation last (the presenter's three talking points pinned
  where the eye already went).
- Backward navigation or safeMode mounts skip the sweep and render the settled
  state instantly (no surprise replays mid-talk); R-key replay remounts and
  re-runs it.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Calendar Ignition Heatmap"),
it would parameterise:

- **Grid shape:** row entities (days/weeks/sprints/people) + column buckets
  (hours/days/stages), with row & column label formatters. Cell aspect ratio and
  gap scale derived from counts so any R×C up to ~7×31 fits the canvas.
- **Data:** a single `values[row][col]` matrix + optional `window` mask (cells
  outside the story rendered as voids) — CSV/JSON drop-in.
- **Colour ramp:** 5-stop ramp generated from one theme accent (near-bg → hot),
  with optional diverging variant; flash colour derived automatically.
- **Thresholds & legend:** explicit breakpoints or auto-quantiles; legend labels
  generated from the breaks.
- **Glow rule:** a predicate over (row, col, value) — e.g. "overnight && active",
  "weekend", "over budget" — mapping a semantic condition to the glow channel.
- **Sweep choreography:** order (chronological / by-row / by-value), per-cell
  stagger, per-row pause, flash duration — with a total-duration budget the
  template solves for.
- **Callouts:** list of {target cell or span, tag, text}; the template auto-tiers
  cards below the grid and routes leader lines to avoid card collisions (the one
  piece hand-tuned here).
- **Honesty footnote:** optional provenance string slot, encouraged by default.
