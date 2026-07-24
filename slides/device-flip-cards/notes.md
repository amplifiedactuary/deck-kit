# Rehearsal / agent-brief notes — device-flip-cards

## Design intent

The flip is a rhetorical device, not decoration. The spine is "assumptions vs
reality" — the claim that what we believe about insurance, customers, and growth
often inverts on contact with data. The literal turning-over of a card is the
cleanest physical metaphor for that inversion: the audience *assumes* one thing on
the front, and the card flips to show what *actually* holds.

Choices that matter:

- **Front muted, back accent-lit.** The front is deliberately low-contrast (dim label,
  82% opacity body) so the flip *gains* energy — the amber back, the glow, and the
  heavier font weight all land the reveal. Colour does the emotional work the motion
  starts.
- **One card per step, not all at once.** Lets the presenter speak to each pair, and
  the header counter ("k / 6 turned over") gives a sense of accumulating evidence. The
  extra hold step (7) leaves the full board lit so the presenter isn't stranded mid-flip
  at the end of the beat.
- **Step-derived, declarative flip.** `rotateY` is an `animate` target keyed off
  `step` — there is no setState-in-effect timer. Backward navigation un-flips cleanly;
  the R-key restart replays from whatever step you're on without special-casing.
- **Real 3D, real backface.** Both faces are stacked in a `preserve-3d` parent with
  `backfaceVisibility: hidden`; the back is pre-rotated 180°. This is a genuine card
  flip, not a crossfade — important on a projector where a fake flip reads as a glitch.

## Rehearsal

- ~10–12 s of speaking per card is comfortable; the flip itself is 0.7 s.
- If short on time, the slide still works jumping 0 → 7 (all cards animate together).
- Say the *front* line before advancing; let the flip answer it. Don't read the back —
  let the audience read it while you pause.

## Templatise

Reusable as a generic **"assumption → reality" flip board**. To repurpose:

- Swap `data/pairs.json` — 4–6 `{ tag, front, back }` entries. Fewer than 6 reflows the
  grid automatically (it fills left-to-right, top-to-bottom).
- `meta.steps` must equal `pairs.length + 2` (step 0 all-front, one step per flip, one
  hold step). With N pairs: `steps = N + 2`.
- For a 2×2 board (4 cards) bump `CARD.w`/`CARD.h` and recentre `GRID.left`/`top`; the
  `cardPosition()` helper keeps the math in one place.
- The colour story (muted front / accent back) is theme-token driven — swap `amber`
  for any token to re-skin without touching layout.
- Generalises beyond AI: any "naive belief vs lived experience" framing (pricing
  assumptions, project estimates, model-risk intuitions) drops straight in.
