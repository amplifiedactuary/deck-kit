# 18 · Black / white — palette experiment

> **PLACEHOLDER — experiment, not talk content.**

## The experiment

One of 12 palette experiments that all render the **same content** (kicker → headline →
four-stat strip → closing line) so palettes compare like-for-like in the overview
gallery. This variant uses **pure black and white only** — `#000` and `#fff`, with two
greys (`#595959` on white, `#a6a6a6` on black) used sparingly for the stat descriptions
and closing line. No hue anywhere. Vignelli/Brockmann reduction: contrast does all the
work — heavy display weights, a 4px top rule, 2px column hairlines, and a single
**inversion** (the growth-% cell knocked out white-on-black) as the only accent.
Canvas polarity is white paper with black ink; the black block is the climax.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Kicker rule + "NORTHWIND IN FOUR NUMBERS" + headline "The portfolio grew. So did the margin." |
| 1    | Stat strip: 20.4 revenue · 91 retention · 84,200 customers (fourth cell's space reserved, still hidden) |
| 2    | The inverted black cell — **23 growth %** — plus the closing line |

Step-0 Reveals animate in on every mount/restart (R key); jumping straight to a later
step plays all reveals at once. `safeMode` renders a fully static branch with no motion
components, so the overview thumbnail (final step) reads as a static poster.

## Data

Fictional sample data (`lib/sampleData.ts`): Northwind Insurance KPIs (revenue $M,
retention %, customers, growth %). Numbers are duplicated as constants in `Slide.tsx`
(no runtime fetch).

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
