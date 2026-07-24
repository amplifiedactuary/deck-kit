# device-formula — Formula build-up

> **PLACEHOLDER — experiment, not talk content.**

## What this slide shows

An example slide demonstrating the "formula build-up" presentation device: an equation
assembled term by term, each term landing with a one-line gloss, then real numbers
substituting in to produce a counted-up result. The equation is
**Margin = (Volume × Retention × Efficiency) / Risk** — fictional Northwind Insurance
data, illustrative only. The slide tests whether a slow, deliberate equation reveal
(big serif italics, ≥80 px, framer layout recentring as terms land) reads well on
a projector and earns the final beat where symbols give way to numbers
($48.2M ÷ $9.8M = **4.9×**).

`hasSafeMode: true` — safe mode renders a distinct `StaticPoster`: the complete
symbolic formula, the substitution line, the 4.9× result, the legend, and the
"illustrative formula" footnote, all static. The Overview thumbnail uses the same
poster.

## Steps

| Step | What appears |
|------|--------------|
| 0 | Kicker (`DEVICE LAB · FORMULA BUILD-UP`) and a huge, lone `Margin =` (equation at 1.5× scale, right-hand side empty). |
| 1 | `Volume` lands in the numerator (accent-highlighted); its gloss line ("how many policies are in force") appears below; equation settles to 1.16×; footnote "Illustrative formula — not a fitted model" appears bottom-left. |
| 2 | `× Retention` lands (highlight moves to it); second gloss line ("how many customers stay each year"); equation settles to 1.05×. |
| 3 | `× Efficiency` lands (highlight moves); third gloss line ("how much revenue each unit generates"); equation settles to 1×. |
| 4 | Fraction bar draws in (scaleX) and `Risk` appears as the denominator (highlighted); fourth gloss line ("the cost of claims and losses"). |
| 5 | Substitution: numerator and denominator crossfade to counting numbers (rAF, ~1.8 s) — `$48.2M revenue` over `$9.8M invested` — then `= 4.9×` counts up in amber at 126 px. The gloss column crossfades into a compact two-row legend plus the source line. |

Step-0 Reveals animate in on every mount/restart (R key) by design; jumping
straight to a later step plays all reveals at once. The count-up at step 5 restarts
whenever the step re-enters ≥5.

## Data

`data/metrics.json` — `deliveredHours` (48.2), `attendedHours` (9.8), `leverage` (4.9).

Provenance:

- **Formula structure — invented / illustrative.** `Volume × Retention ×
  Efficiency ÷ Risk` is a rhetorical device, not a fitted model. The slide
  says so on-screen: "Illustrative formula — not a fitted model."
- **Values — fictional sample data** from `lib/sampleData.ts`. Not sourced from any real measurement.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
