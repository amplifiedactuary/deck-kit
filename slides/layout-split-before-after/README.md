# 05 · Before / after split

> **PLACEHOLDER — experiment, not talk content.**

## The experiment

A *split before/after* layout. A glowing vertical divide at x=960 cuts the 1920×1080
canvas in two:

- **LEFT — "Before"**: muted, amber-tinted, calm and static. An illustrative
  sequential Gantt — one reporting phase at a time over ~6 months, with dependency
  ticks showing each phase waiting on the last.
- **RIGHT — "After"**: accent-lit, denser, alive. Fourteen parallel workflow
  lanes over a 12.0-hour axis with a sweeping playhead and gently pulsing spans, plus
  sample headline stats (240 tasks completed · 8 streams at peak · 22.5 parallel work-hours).
- **BRIDGE**: a delta callout lands across the divide — an amber→accent arrow piercing
  a centred card with the headline multiple (**5.4× productivity gain**) and the time
  ladder (4.2 attended · 6.8 machine · 12.0 window · 22.5 stacked).

The divide itself is a designed element: a vertical gradient hairline that gains an
accent glow once the right side arrives.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Title, footer, and the LEFT panel (before: sequential Gantt + muted amber stats) |
| 1    | RIGHT panel (after: parallel workflow lanes, sweeping playhead, accent stats); the divide starts glowing |
| 2    | Delta callout lands across the divide: gradient arrow + 5.4× productivity-gain card with the time ladder |

Final step with `safeMode=true` (the overview thumbnail) renders the full composition
as a static poster: no playhead sweep, no pulsing, arrow fully drawn.

## Data

All committed under `data/`; no runtime fetches. All data is fictional sample data (lib/sampleData.ts).

- **`metrics.json`** — fictional sample numbers representing a Q4 reporting cycle
  for Northwind Insurance. Illustrative framing only.
- **`old-way.json`** — fictional placeholder: a stylised sequential reporting workflow
  for the left panel. Illustrative framing only, labelled as such (the "≈ 6 mo" chip
  says *illustrative* on the slide).
- **`lanes.json`** — stylised parallel workflow lane spans for the right panel.
  Individual spans are illustrative, not measured data.

Framing copy (titles, "Before / After" labels, "month after month") is
invented placeholder.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
