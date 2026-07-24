> **PLACEHOLDER — experiment, not talk content.**

# 52 · Counter wall

An example slide demonstrating the **stat-barrage finale device**. A 4×3 wall of twelve stat
tiles all counting up **simultaneously** — staggered starts within ~1.5 s, durations
scaled to value magnitude so the wall finishes in a satisfying size-ordered cascade.
The overwhelm is the point: twelve numbers blurring upward at once is
quantity-as-spectacle. Then the hard curatorial pivot — eleven tiles dim to near
nothing, one tile (23% revenue growth) blooms to dominate, and the closing line
lands: *"Only one of these numbers is about our customers."*

## Steps

| Step | What happens |
|---|---|
| 0 | The full wall counts up: twelve tiles start within ~1.5 s of each other; larger values run longer (log-scaled duration), so small tiles snap into place first and the big ones land last. |
| 1 | Eleven tiles dim to 14% opacity; the **23% revenue growth** tile blooms (1.5× scale + accent glow). Closing line fades in: "Only one of these numbers is about our customers." |

**safeMode:** distinct static markup — all twelve final values rendered with no
animation; at step 1 the dim/bloom state is applied as static styles. The overview
thumbnail (final step, safeMode) reads as the pivot poster: one glowing number over
a dimmed wall.

## Data provenance

All values are **fictional sample data** from `lib/sampleData.ts`. Committed locally as
`data/metrics.json` — no remote fetches at runtime.

| Tile | Value | Note |
|---|---|---|
| revenue | $20.4M | annual |
| revenue growth | 23% | YoY |
| active customers | 84,200 | end of year |
| retention rate | 91% | annual |
| claims ratio | 59% | combined |
| satisfaction | 4.6/5 | NPS survey |
| policies in force | 127,400 | year-end |
| avg premium | $1,840 | annual |
| claims paid | 9,340 | FY 2025 |
| avg handling | 8.3d | calendar days |
| branch offices | 47 | locations |
| staff headcount | 1,170 | FTE |

The closing line is a presentation device, not a sourced quote.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
