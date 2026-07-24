# 60 · Maturity Ladder (`device-ladder`)

## What this slide shows

A three-rung "maturity ladder" that climbs up-and-to-the-right: **1× Manual → 2× Assisted → 4× Optimised**.
Each rung is a bar whose height encodes the maturity multiple; on its step the bar
**rises from the floor and lights up**, the climb-arrow extends to it, and a large
multiplier + caption fade in. The motion is engineered to feel like *ascending value* —
the room watches capability stack, rung by rung, as the strategic roadmap unfolds.

It belongs to the `devices` group (a visual metaphor / rhetorical device, not a data chart).

## Steps

| Step | What appears |
|------|--------------|
| 0    | Heading, ground line, faint ghost columns, ×-level guide grid |
| 1    | **1× rung** rises + lights (Manual baseline) |
| 2    | **2× rung** rises + lights, climb-arrow 1→2 extends (Assisted — current state) |
| 3    | **4× rung** rises + lights, climb-arrow 2→3 extends, closing line appears |

Step-0 Reveals animate in on every mount/restart (R key) by design; jumping straight to a
later step plays all reveals at once. `hasSafeMode: true` — in safe mode all three rungs
render fully built, lit, and static (no rise/glow animation), as a poster.

## Data

fictional sample data (lib/sampleData.ts). No external data files — the three rungs are
hand-defined inline in `Slide.tsx` (`RUNGS`). Multiples are illustrative anchors for the
generic maturity-progression device; swap in real figures as needed.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
