# 06 · 2×2 mosaic

> **PLACEHOLDER — experiment, not talk content.**

## What this experiment tests

The *2×2 mosaic* layout: the 1920×1080 canvas divides into four quadrant cells
separated by a 32px gutter with a designed junction at the centre. Each cell hosts a
DIFFERENT mini-visual genre — one big stat, one short quote, one tiny hand-rolled SVG
bar chart, one icon/diagram cell. One cell ignites per step while inactive cells sit
dimmed at low opacity (never empty), so the audience always sees the full grid shape.
The final step brings all four alive and adds a unifying touch: an accent crosshair
drawn through the gutters, meeting at a diamond on the centre junction. The experiment
is rhythm — four reveals, four genres, one grid.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Cell 01 (METRIC, top-left) ignites: big "91 %" retention stat. Other three cells dimmed. |
| 1    | Cell 02 (VOICE, top-right) ignites: short CEO pull-quote with amber quote glyph. |
| 2    | Cell 03 (TREND, bottom-left) ignites: bar chart of new policies per quarter, bars grow staggered, peak bar in amber. |
| 3    | Cell 04 (SYSTEM, bottom-right) ignites: product diversification fan diagram (1 team → 6 agents → 4 lines); accent crosshair draws through the gutters with a centre diamond. All four cells alive. |

Safe mode renders the same lit/dim states with zero animation (plain elements, no
motion components); the final step doubles as the static overview poster — all four
cells live plus the crosshair.

## Data

`data/mosaic.json` — **fictional sample data** for Northwind Insurance (a fictional
company). The stat, quote, quarterly GWP series, and diagram counts are invented
for layout demonstration only — none are sourced numbers.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
