# type-numerals — Giant tabular numerals

> An example slide demonstrating the "monumental numeral" device: a single figure
> treated as pure typography.

## What this slide shows

One hero number at a time, set at **440px** in `font-display` with
`font-variant-numeric: tabular-nums`, so every figure sits on a fixed grid and
the digits never jitter as the count-up runs. The craft is in the figure
setting — tabular alignment, a tight `-0.02em` track, and inline units (`M`,
`%`) kerned in at a smaller scale and tinted with the accent colour. Each step
swaps to the next number, which counts up from zero and lands as a monument,
captioned by a single quiet line. A provenance eyebrow (top-left) and step pips
(top-right) keep the sequence legible without competing with the figure.

## Steps

| Step | Figure        | Caption                                                   | Source           |
|------|---------------|-----------------------------------------------------------|------------------|
| 0    | **20.4 M**    | full-year revenue, across all product lines               | FY2025 · total revenue |
| 1    | **23%**       | year-on-year growth — ahead of market benchmark           | FY2025 · revenue growth |
| 2    | **84,200**    | active policyholders at year end                          | FY2025 · customers |
| 3    | **4.6**       | average customer satisfaction score out of 5.0            | FY2025 · CSAT |

Each step remounts the monument (keyed by index), so the count-up replays
cleanly from zero on every arrival and on the presenter's replay (R) key.
Jumping straight to a later step shows that figure counting up — no earlier
figures linger.

## Data

fictional sample data (lib/sampleData.ts). Values drawn from `headlineKpis`
exported from `lib/sampleData.ts`. No data files in this folder — all four
numerals are defined inline in `Slide.tsx`.

## Safe mode

`hasSafeMode: true`. The count-up animates heavily, so safe mode renders each
figure at its **final value** with no motion (`StaticFigure`), still fully
tabular-aligned. Toggling S mid-count snaps to the final value rather than
freezing a partial number.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell
  (`components/`, `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking
  `SlideProps`. `meta.id` MUST equal this folder's name.
- `README.md` and `notes.md` are docs only — never imported by app code.
