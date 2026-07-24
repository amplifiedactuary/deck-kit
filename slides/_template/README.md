# Template slide

> Copy this folder to `slides/<your-slide-id>/` to start a new slide.

## What this slide shows

(One paragraph: what the audience sees and what presentation device it demonstrates.)

## Steps

| Step | What appears |
|------|--------------|
| 0    | Heading      |
| 1    | Second line  |

Step-0 Reveals animate in on every mount/restart (R key) by design; jumping straight to a later step plays all reveals at once.

## Data

(If the slide reads committed JSON/images, list the files in `data/` and where the
numbers came from. Delete this section if there is no data.)

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
