# Rehearsal / agent-brief notes — device-reveal-stack

## Design intent

This is a **rhetorical device made visual**: the "steel-manning" or
"layer-peeling" move. Most claims in a talk get asserted once and dropped. Here
the *same* claim is held on screen and physically deepened — each push of the
stack is the speaker saying "...but it's actually one level more interesting than
that." The recession of older cards is the point: the surface claim never
disappears, it just sinks behind the truer version, so the audience keeps the
whole chain in view.

Why a stack (not a list, not a flip): a stack encodes **provenance and order**.
The thing in front is the most refined statement; everything behind it is the
scaffolding that earned it. That maps cleanly onto the deck's thesis — the
visible result sits on top of unseen foundations.

Colour choice: the first four layers stay blue (supporting depth); the final
**caveat card turns amber** so the honest limitation reads as a deliberate tonal
shift, not just "card #5". The amber says "now I'm being straight with you."

Pacing in delivery: land each card's headline, let the recede settle (~0.6s),
then advance. The depth meter on the right and the "LAYER n OF 5" footer give the
presenter and the room a shared sense of how deep we are.

## Templatise

To reuse this device for a different deepening claim, edit only the `PANELS`
array in `Slide.tsx`:

- **4–5 entries.** Fewer than 4 and the recession barely registers; more than 5
  and the back cards shrink past readability (tune `SCALE_STEP` / `DIM_STEP` if
  you must go to 6).
- Each entry: `kicker` (short ALLCAPS stage name), `title` (the claim at that
  depth — keep ≤ ~70 chars so it fits two lines at 52px), `body` (one
  clarifying sentence), optional `stat` ({value, unit}).
- Set the last entry's `tone: "amber"` if it's a caveat/turn; otherwise keep all
  `"blue"`.
- Stack feel is governed by the geometry constants near the top: `OFFSET_X/Y`
  (parallax drift), `SCALE_STEP` (shrink per layer), `DIM_STEP` (fade per
  layer), `CARD_CENTER_X/Y` and `CARD_W/H`. The cards render back-to-front via
  `depthIndex = visibleCount - 1 - i`, so no z-index bookkeeping is needed when
  you change the count.
- `meta.steps` MUST equal `PANELS.length`. Update the README steps table to
  match. Keep `hasSafeMode: true` — the entry animation is heavy enough to need
  the static fallback.
