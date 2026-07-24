# 58 · Assumption flip-cards (`device-flip-cards`)

## What this slide shows

A 3×2 grid of cards. Each card opens showing **"what you assume"** about working
with AI coding agents (muted, edge-bordered). As the presenter advances, the cards
flip one at a time on a 3D `rotateY`, landing on **"what actually happened"** —
amber-lit, accent-bordered, the colour shift selling the reversal. A running
counter in the header tracks how many assumptions have been turned over. The device
makes the deck's core inversion physical: the assumption doesn't survive contact with reality.

## Steps

| Step | What appears |
|------|--------------|
| 0    | All six cards face-up on their "Assume ·" front; counter reads 0 / 6 |
| 1    | Card 1 (AUTHORSHIP) flips to its amber reality; counter 1 / 6 |
| 2    | Card 2 (SPEED) flips; counter 2 / 6 |
| 3    | Card 3 (REVIEW) flips; counter 3 / 6 |
| 4    | Card 4 (PROMPTING) flips; counter 4 / 6 |
| 5    | Card 5 (JUDGEMENT) flips; counter 5 / 6 |
| 6    | Card 6 (CONTROL) flips; counter 6 / 6 |
| 7    | Hold — all six reality faces lit (a beat for the presenter to land the point) |

Flip state is derived purely from `step` (`flippedCount = min(step, 6)`); each card's
`rotateY` is a declarative framer-motion `animate` target — no timers, no `setState`.
Jumping straight to a later step animates the relevant cards into their flipped pose.

## Data

- `data/pairs.json` — six `{ tag, front, back }` assumption→reality pairs.

**Provenance:** the content is **invented placeholder copy**. The pairs are
insurance business assumption-vs-reality scenarios invented to exercise the flip
device — they are not sourced from any real company. The `note` field in the JSON
records this.

## Safe mode

`hasSafeMode: true`. The flip is a heavy 3D animation, so safe mode renders genuinely
distinct **static** markup: each card shows its front, or its flat (un-rotated) back
face, directly based on `flipped` — no `rotateY`, `perspective`, or motion. Revealed
cards simply appear face-up in amber.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
