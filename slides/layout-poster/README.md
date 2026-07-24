# 09 · Poster

> **PLACEHOLDER — experiment, not talk content.**

## The experiment

Can ONE word carry a conference screen? This slide tests the *poster* layout: a
single word — "GROWTH" — set at colossal scale (440px, bleeding off the left
edge of the 1920×1080 canvas) in a high-contrast black/white gig-poster /
Swiss-typographic treatment. The drama is counter-scale: a 14px mono subline
against 440px display type, plus exactly one accent element (a full-bleed red
strike bar through the lower third of the letters). The B/W + single-red
treatment deliberately supersedes the deck's default palette for this slide.

All text is **fictional sample data** for Northwind Insurance (a fictional company).

## Steps

| Step | What appears |
|------|--------------|
| 0    | "GROWTH" lands with weight (fast scale-down stamp); dim 14px corner marks settle in after it |
| 1    | The tiny counter-scale subline fades up — 14px vs 440px is the point |
| 2    | The single accent gesture: a full-bleed red strike bar wipes left-to-right through the letters |

Step-0 animation replays on every mount/restart (R key). In safeMode a fully
static branch renders the same composition with no motion; overview thumbnails
(final step, safeMode) therefore read as the finished static poster.

## Data

None — no `data/` folder. All copy is invented placeholder text written
directly in `Slide.tsx`.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
