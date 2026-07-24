# device-scoreboard

## What this slide shows

A sports-style **scoreboard** that frames the core business result as a game between
two sides: **ANNUAL TARGET** ($5.0M) versus **ACTUAL REVENUE** ($6.3M). Big tabular
scoreboard numerals count up to their finals as the "quarters" advance, and the final
beat posts the **+23% uplift** in a centre UPLIFT plate. The device makes a financial
result feel concrete and competitive: the target was $5.0M; the team delivered $6.3M —
a 23% beat.

The period/quarter motif (Q1–Q4) sits across the top as a lit strip, advancing one
chip per step so it reads like a live game clock.

## Steps

`meta.steps = 4`

| Step | Period | What appears |
|------|--------|--------------|
| 0    | Q1     | Title band, period strip (Q1 lit), both empty team plates, VS divider |
| 1    | Q2     | ANNUAL TARGET number counts up to **$5.0M** |
| 2    | Q3     | ACTUAL REVENUE number counts up to **$6.3M** |
| 3    | Q4     | Centre UPLIFT plate counts up to **+23%**; final caption appears |

Numbers animate via framer-motion `useMotionValue` + imperative `animate()` (no
setState in effects). Jumping straight to a later step plays the relevant count-ups
on mount. Pressing **R** (restart) re-runs them.

## hasSafeMode

`true`. `safeMode` renders a distinct static poster (`StaticPoster`) showing the final
state with no animation: both teams at their final figures, Q4 lit, and the +23% uplift
posted. This is also what Overview renders as the thumbnail.

## Data

`data/metrics.json` — fictional sample data (lib/sampleData.ts). All figures are from
`lib/sampleData.ts` (quarterlyRevenue, headlineKpis).

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
