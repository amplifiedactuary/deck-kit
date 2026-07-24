# 01 · Big statement (layout lab)

> **PLACEHOLDER — experiment, not talk content.**

## The experiment

The *centered big-statement* layout: a single sentence delivered as four huge
typographic chunks (168–220px display type), one chunk landing per step. Previously
revealed chunks dim to ~34% opacity and shrink to 96% scale, so emphasis always
rides the newest words. The design is restraint itself — enormous type, vast
negative space, one hairline rule at the close, no imagery, no panels. A small
mono kicker sits above the statement and recedes once the sentence starts building.

The spine sentence used here is **invented** for the lab: *"The customer is never
the problem. Clarity is."* — a fictional corporate statement for Northwind Insurance.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Mono kicker ("northwind insurance") + chunk 1: **The customer** |
| 1    | Chunk 2: **is never** (chunk 1 dims/shrinks; kicker recedes) |
| 2    | Chunk 3: **the problem.** (chunks 1–2 dimmed) |
| 3    | Chunk 4: **Clarity is.** — largest, accent colour |
| 4    | Settle beat: hairline rule grows in + mono footer line; final chunk keeps emphasis |

Final step doubles as the overview thumbnail (rendered with `safeMode=true`): the
full sentence with the accent payoff line emphasised, rule and footer in place — a
static poster.

## Safe mode

`hasSafeMode: true` — safe mode renders a completely separate static markup tree
(`StaticStatement`): no framer-motion components, all opacity/scale states applied
as plain inline styles at the requested step.

## Data

No `data/` folder. The sentence, kicker, and footer are invented placeholder
strings inlined as constants in `Slide.tsx`. All values are fictional sample data
for Northwind Insurance — not sourced from any real company.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
