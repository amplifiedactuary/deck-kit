# 38 · NPS over time — self-drawing line chart

> **PLACEHOLDER — experiment, not talk content.**

## The experiment

An example slide demonstrating a **self-drawing line/area chart** of the
monthly Net Promoter Score across a 12-month survey year. On entry the axes and month
labels are already in place; the stroke then sweeps left-to-right over ~11 s, the soft
area fill follows beneath it, and a glowing dot rides the line head. A custom easing
curve makes the sweep *linger* as it climbs through the peak and again through the
product refresh, then settle softly at the end. As the head crosses notable moments,
amber annotation callouts pop in pinned to their x-positions: **campaign launch · peak:
64 NPS · product refresh · end-of-year dip**.

Mechanics: the line draw uses framer-motion's declarative `pathLength` (arc-length
mapped so the stroke tip stays exactly aligned with the x-driven head dot and the area
clip edge); the area reveal is a widening `clipPath` rect; annotations fade/rise via
`useTransform` windows on the single master progress motion value. No state updates
during the animation — one motion value drives everything. The `R` key replays (the
animated chart is keyed on `restartKey`).

## Steps

| Step | What appears |
|------|--------------|
| 0    | Header + fact strip + axes/month labels visible immediately; the line draws itself (~11 s), area fill follows, glowing head dot, annotations land as crossed |
| 1    | Dashed average-level reference line (≈ 51 NPS) fades in across the chart + summary takeaway line below |

In **safe mode** (`meta.hasSafeMode: true`): the complete final chart renders
statically — full line, area, all four annotations, end dot, zero animation. Overview
thumbnails (final step + safeMode) therefore read as a full poster: chart + annotations
+ average line + takeaway.

## Data

`data/agents-series.json` — 23 half-monthly points `[month, NPS]` plus
annotation/tick/fact metadata. Fictional sample data (`lib/sampleData.ts` reference).

**Provenance — the curve shape is ILLUSTRATIVE.** It is a synthetic NPS series for
Northwind Insurance (fictional), shaped to show a plausible rise, peak, and year-end
dip. Not derived from any real data source.

| Fact | Value |
|------|-------|
| Survey year | 2025 |
| Peak NPS | 64 (April) |
| Survey respondents | 1,840 |
| Average NPS | ≈ 51 |

The on-slide footnote declares the illustrative status.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
