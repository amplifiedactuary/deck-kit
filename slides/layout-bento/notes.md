# Notes — 07 · Bento board

## Design intent

- **Calm density.** A bento board lets one slide carry 10+ figures without
  feeling like a spreadsheet: the asymmetric spans create a clear reading order
  (hero first, then telemetry, then the human notes), and the 28px gaps +
  28px-radius tiles keep it airy at distance.
- **One number rules.** The 252px hero revenue figure anchors the slide; everything else is
  deliberately a tier (or three) smaller. Small-caps 18px tracking-0.24em labels
  do the captioning so figures never need sentences.
- **Cluster reveals, not tile-by-tile.** Three semantic clusters (framing →
  telemetry → human notes) keep the click count presenter-friendly; within a
  cluster, 0.1–0.18s stagger + soft spring (stiffness 120 / damping 19) gives
  the "tiles settling onto a board" feel without bounce spectacle.
- **Colour discipline.** Accent (sky) for data ink — sparkline, bars, chip
  values, hero rule. Amber reserved for exactly one tile (cost) so money reads
  as a different category of fact. Everything else ink/dim on panel.
- **Hover-free.** No interactive affordances; motion only on step change.
- **Safe mode** renders plain divs (no framer-motion mounted at all), full
  sparkline path, full-width bars — a genuine static poster for the overview
  thumbnail.

## Template-ised

If this shipped as one of ~50 reusable deck templates, the "bento board" type
would parameterise:

- **Grid recipe:** cols × rows, gap, outer margin; tile list as
  `{span: [c,r], kind, cluster}` — with validation that spans tile the grid
  exactly (the layout falls apart with holes).
- **Tile kinds as a small vocabulary:** `heroNumber`, `sparkline`, `miniBars`,
  `quote`, `chips`, `kicker`, `statNumber` — each a schema'd content block
  (value, label, sub-line, series, accent slot). New kinds (donut, avatar,
  image) extend the vocabulary without touching layout code.
- **Cluster → step mapping:** which tiles appear on which click, plus
  per-cluster stagger; default "2–3 clusters" guidance baked in.
- **Type scale tokens:** hero size auto-fit to tile (252px works for 3 digits;
  4+ digits or decimals need a step down), label style, mono-vs-display rules.
- **Accent policy:** primary accent for data ink + one optional "alert" accent
  limited to a single tile (here: amber = cost).
- **Theme tokens passthrough:** panel/edge/ink/dim already come from the deck
  theme, so the template restyles for free across decks.
- **Data contract:** one JSON file per slide instance with a `provenance`
  field — the template should *require* a source note per figure to keep
  placeholder copy honest.

Risk to watch when template-ising: bento boards invite over-filling. The
template should cap tiles (≤8) and enforce one hero per board.
