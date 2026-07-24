# type-kinetic — Kinetic typography template

> Reusable component-library template (group: `typography`). Generic statement
> copy; swap the words in `data/script.ts` for any real slide.

## What this slide shows

A short statement that **assembles itself in motion**. Words don't simply fade —
each arrives along its own entrance vector (slide up, drop from above, scale-in,
blur-in, slide from the side), staggered left-to-right so the line composes like
a musical phrase. A **hero word** ("certainty.") lands last, larger, bolder, and
in amber with a soft glow — the deliberate downbeat the eye settles on. A second
phrase assembles on the next step, completing the statement.

This is the *motion-composition* counterpart to `type-one-word` (hard single-word
cuts). Here the beauty is in the choreography: overlap, varied vectors, eased
settling, and a delayed hero landing.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Phrase 1 assembles word-by-word: "Customers don't want products." |
| 1    | Phrase 2 assembles; hero word "certainty." lands last |

Each phrase replays its choreography when its step becomes active (and on the
R / restart key, which remounts the slide). Jumping straight to step 1 plays both
phrases' staggers together.

## Data

- `data/script.ts` — the choreography script. Each phrase declares its `step` and
  an ordered list of words; each word sets its entrance `vector`, type `size`,
  `weight`, `tone`, and an optional `hero` flag (lands last, carries the accent).
  `STATEMENT` is derived from the words and powers the safeMode static caption.

## Templatising

To reuse: edit only `data/script.ts`. Add/remove phrases (each on its own step —
keep `meta.steps` in sync), change the copy, and pick per-word vectors/sizes to
re-choreograph. No changes to `Slide.tsx` are needed for new copy.

## Safe mode

`hasSafeMode: true`. With `safeMode` on, the fully-assembled statement renders
instantly with no motion (variants are bypassed; phrases forced to their `shown`
rest state), plus a visually-hidden caption for the full statement.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
