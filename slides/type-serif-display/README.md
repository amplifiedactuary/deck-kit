# type-serif-display

> Reusable **serif-display** typography template for the component library.
> Group: `typography`.

## What this slide shows

An editorial, authoritative serif "specimen" — the opening of a serious essay or a
luxury magazine masthead. A giant serif headline with an amber drop-cap establishes
display craft; an italic pull-line and a small-caps colophon step in to make it read
as a **trials sheet** showing three cuts of one voice (roman, italic, small-caps).
Calm and literary — the deliberate opposite of neon/hacker styling.

It demonstrates display-serif treatment — large optical sizes, refined leading,
italic emphasis, small-caps, ligatures — using a **web-safe generic serif stack only**
(Georgia / Iowan Old Style / Times fallback). No font binaries are shipped.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Small-caps eyebrow + giant serif headline with amber drop-cap |
| 1    | Italic pull-line in lighter weight, generous measure |
| 2    | Small-caps colophon: "Roman · Italic · Small-Caps — three cuts, one voice" |

Step-0 Reveals animate in on every mount/restart (R key); jumping straight to a later
step plays all reveals at once.

## Data

No data files. All copy is generic, inline statement text.

## Fonts

No font assets added. Uses an inline CSS generic serif stack
(`Georgia, 'Iowan Old Style', … ui-serif, serif`). See `notes.md` → **Templatise**
for the `next/font/local` self-hosted display-serif swap-in.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: false here — Reveal's instant transitions cover safeMode; no
  distinct static markup is needed.
