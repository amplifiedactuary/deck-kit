# notes — layout-full-bleed

## Design intent

- The slide type is "atmospheric statement": one full-canvas generated image,
  a heavy directional scrim, and a tiny amount of very large text. It buys
  emotional register at the cost of information density — use it for beats
  where the deck needs a breath or a gut-punch line, not for evidence.
- The backdrop is deliberately atmospheric so the image does narrative work
  even before any text appears.
- Contrast discipline: the left ~55% of the canvas sits under a 0.82–0.94
  alpha scrim so the 116px statement stays projector-readable; the abstract
  geometry owns the right side. The amber lead-in is the only warm element in
  the type, echoing the amber focal-point glow — one colour rhyme, no more.
- Motion is sub-perceptual on purpose: a 180s rotation and a 9s glow breath.
  You feel the slide is alive without ever watching it move. Safe mode
  freezes both.
- All geometry is deterministic module-scope math (sinusoid-perturbed rings,
  log-spiral arms) — no random seeds, so SSR/hydration always agree and the
  thumbnail matches the live render.

## Template-ised

If this shipped as one of ~50 reusable deck templates, the parameterisation
would be:

- **Backdrop generator** (the big one): a small library of procedural scenes
  selected by `backdrop: "orbital" | "topo-contours" | "starfield" | "waveform"
  | "city-grid" | ...`, each themed by the deck palette tokens. Per-scene
  knobs: focal-point position, density, drift speed, drift type
  (rotate/translate/pulse).
- **Scrim**: direction (left/right/bottom/radial), strength preset
  (light/standard/heavy) — chosen automatically from where the text block is
  anchored.
- **Copy slots**: `kicker`, `statement` (with optional highlighted lead
  phrase + highlight colour token), `attribution`. Statement font size
  auto-stepped (132/116/96px) by character count.
- **Text anchor**: 9-position grid (here: middle-left), which also flips the
  scrim direction.
- **Chrome slots**: optional corner metadata tags (top-right here) — pure
  flavour, default off.
- **Step plan**: fixed reveal order kicker → statement → attribution; allow
  collapsing to 1–3 steps.
- **Safe mode**: contract that every backdrop generator must expose a frozen
  pose (a fixed rotation/phase) so thumbnails are strong static posters.

The skill version would warn: max ~12 words in the statement, never put data
that must be read over the un-scrimmed half, and keep exactly one accent +
one warm highlight.

## Rehearsal notes (placeholder slide)

- Land the statement on step 1 and *stop talking* for a beat — the slide is
  doing the work.
- Step 2's attribution line is the "and yes, it's real" beat.
