# Rehearsal / agent-brief notes — type-numerals

## Design intent

The whole point is restraint: a single, enormous, beautifully-set number doing
all the talking. Treat the figure as typography, not a chart. The decisions that
matter are typographic, not animated:

- **Tabular figures (`tabular-nums`)** — every digit shares a fixed advance
  width, so `84,200` and `20.4` sit on the same column grid and the count-up
  never makes the layout breathe. This is the spec's whole brief.
- **Inline units kerned in** — `M` and `%` ride at ~45% of the figure size,
  accent-tinted, with an `18px` left margin so they read as a unit, not a digit.
  Pure figures (`84,200`, `4.6`) carry no inline unit; their meaning lives in
  the caption.
- **Negative tracking (`-0.02em`)** and tight leading (`0.82`) pull the giant
  figure together so it reads as one mass rather than loose glyphs.
- **One accent, lots of dim** — the figure is `ink`, the unit is `accent`, the
  caption and eyebrow are `dim`. Nothing fights the number.

## Why these four numbers

A deliberate rhetorical arc for a business review:

1. **20.4 M** — the revenue story: how big we are.
2. **23%** — the growth story: how fast we're moving.
3. **84,200** — the customer story: the human scale behind the numbers.
4. **4.6** — the quality story: are customers actually happy?

The presenter can pause on any one. Each lands independently; the count-up gives
a beat of anticipation before the figure settles.

## Live-use notes

- Forward steps 0→3 walk the sequence; each figure recounts from zero on arrival.
- R (replay) recounts the current figure.
- S (safe mode) for unreliable projectors: figures snap to final values, no
  motion, still tabular.

## Templatise

To turn this into a reusable component:

- **Extract a `<GiantNumeral>` primitive** taking `{ value, decimals, unit,
  unitInline, caption, tag }` plus a `safeMode` flag. The count-up logic
  (`useMotionValue` + `useTransform` + `animate`) and the static fallback are
  already cleanly split into `AnimatedFigure` / `StaticFigure` — lift those two
  out as the live/safe branches of the primitive.
- **Parameterise the figure size** (currently `440px` / unit `200px`). Long
  integers like `84,200` get wide; a `fitToWidth` prop (or a max-width with
  `clamp`-style sizing in px) would keep any value projector-safe without manual
  tuning per number.
- **Promote the sequence to `data/numerals.json`** so non-coders can re-point the
  figures at any chosen metrics without touching TSX. Keep the provenance `tag`
  in the data so sourcing stays attached to each number.
- **Reuse the eyebrow + step-pips chrome** — they're generic sequence affordances
  any "stepped monument" slide could share.
