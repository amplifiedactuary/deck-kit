# device-reveal-stack (spec #64 — device stack)

## What this slide shows

A progressive panel **stack** that discloses one claim, one layer deeper each
step. A single front card holds the current depth of the argument; as the
presenter advances, a new card is pushed onto the stack and the previous cards
recede behind it — scaled down, drifted up-and-left, and dimmed — so the audience
literally sees the claim deepen from **surface → mechanism → evidence →
foundation → caveat**. Depth is conveyed physically: z-order, parallax offset,
scale falloff, and shadow.

The narrative arc: a headline result is peeled open to reveal the real
mechanism (structured outreach), the evidence (cohort data), the load-bearing
foundations (pricing discipline), and finally the honest caveat (retention
tracks relationship quality, not a structural moat).

## Steps

| Step | What appears | Front card |
|------|--------------|------------|
| 0 | Headline card alone | THE HEADLINE |
| 1 | Mechanism card pushed on top; claim recedes | THE MECHANISM |
| 2 | Evidence card pushed on; two cards recede | THE EVIDENCE |
| 3 | Foundation card pushed on; three recede | WHAT MADE IT HOLD |
| 4 | Caveat card (amber) tops the stack; four recede | THE HONEST CAVEAT |

`meta.steps = 5`. The right-rail depth meter and footer reading-aid track which
layer is currently on top. Jumping straight to a later step renders the full
stack at its final depth.

## Safe mode

`meta.hasSafeMode = true`. The stack animates heavily (each push slides + scales
in). In `safeMode` every card renders at its final transform with no entry
animation (a static "all panels open" poster), and the footer shows the full
layer chain instead of the live counter.

## Data

No external data. All content is **fictional sample data** for Northwind Insurance
(the `PANELS` array in `Slide.tsx`). Numbers (91% retention, 84.2K customers,
4.6 satisfaction) align with `lib/sampleData.ts` headlineKpis — for illustration only.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell
  (`components/`, `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
