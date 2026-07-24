# Design intent — commit dot grid

The slide exists to make a single number physically legible. 240 is abstract; a wall
of 240 individually visible dots is not. Three deliberate moves:

1. **Rain + ticker coupling.** The cascade and the counter run on the same clock
   (per-dot stagger × count duration), so the audience *feels* the number accumulate
   rather than reading it. Linear easing on the counter matches the linear row-major
   stagger — no fake acceleration.
2. **Recolour as narrative turn.** The same wall, untouched in position, flips from
   "volume" to "structure" purely through colour. Keeping geometry frozen between
   steps is the point: nothing moves, the *meaning* moves.
3. **Callouts as proof of unit-level addressability.** A bracket around a 13-dot run
   and a ring on one dot demonstrate that the grid isn't decoration — any unit can
   be pointed at. Non-highlighted dots dim to 0.55 (not lower) so the wall stays a
   strong poster while the callouts pop.

Craft details: dots are 24px (projector floor 18px); the highlighted run was placed
to occupy a single grid row so the bracket is a clean pill; the "merge" dot is the
final commit, which lands in the half-empty last row — giving its label free
horizontal space with zero collision logic. SafeMode renders plain (non-motion) divs
in the final state, so the overview thumbnail costs no animation work.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Unit Grid"), it would
parameterise:

- **count** (the real number; grid auto-computes cols/rows + dot size from a target
  fill box and a minimum dot diameter — the 18px projector floor as a constraint)
- **segments[]** — contiguous category runs: `{label, count or range, color}`; legend
  auto-generated; option to derive runs from a per-unit category array instead
- **callouts[]** — typed annotations: `{kind: "range" | "unit", index/range, label,
  side}` with automatic placement rules (prefer same-row ranges; nudge labels to
  whitespace; collision fallback = leader lines)
- **title / subtitle / counter label** strings, and a `counterUnit` (e.g. "commits",
  "claims", "policies", "simulations" — actuarial decks would love this for scenario
  counts)
- **timing** — total cascade duration (stagger derived from count), sweep duration,
  and a `reducedMotion` flag mapping to the safeMode poster
- **order semantics** — row-major vs serpentine vs column-major (matters when the
  unit order encodes time)
- **provenance flags** per data field (`real | illustrative | invented`) that the
  template surfaces as an optional on-canvas footnote — keeping the honesty mechanic
  from this lab version
