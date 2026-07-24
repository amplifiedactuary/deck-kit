# Notes — counter wall

## Design intent

- **Overwhelm by design.** Step 0 is deliberately too much to read: twelve counters
  running at once is the visceral version of "look how much happened." The audience
  isn't meant to track any single number — they're meant to feel volume.
- **The pivot is the message.** Step 1 punishes the spectacle: eleven numbers turn
  out to be operational detail, and the single growth-facing number (23% revenue
  growth) is the one that matters. The pivot embodies the point — customer outcomes,
  not volume — in one gesture.
- **Cascade choreography.** Durations are log-scaled to value size
  (`1.4 + log10(v+1) × 0.34` s) with scattered start delays inside ~1.5 s. Small
  tiles lock in early, the six-figure tiles land last — the wall "settles" rather
  than stopping all at once.
- **MotionValue count-ups** (framer-motion `useMotionValue` + `animate` +
  `useTransform` → string), rendered as MotionValue children — zero React
  re-renders per frame, satisfies strict react-hooks lint.
- Tabular numerals prevent layout jitter while digits spin. Numerals at 84px
  (≥72px projector floor); labels 21px mono uppercase.
- Hero bloom: 1.5× scale from tile centre (middle row, third column, so growth
  stays inside the canvas) + an accent blur glow behind the panel, z-raised above
  the dimmed neighbours.

## Rehearsal

- Hold step 0 silently for ~4 s — let the cascade finish before speaking.
- Trigger step 1 on the spoken pivot ("…but only one of these numbers is about our customers").
- R (replay) remounts and re-runs the full count-up if a re-show is wanted.

## Template-ised

If this shipped as one of ~50 reusable deck templates, the "counter wall finale"
template would parameterise:

- **Tiles array** — N stat tiles (value, label, prefix/suffix, decimals), with the
  grid auto-choosing columns (3×2, 4×2, 4×3, 5×3) from tile count.
- **Hero selection** — which tile blooms (or none → wall-only variant; or a
  *sequence* of heroes for multi-beat finales).
- **Closing line** — optional, with an emphasised word.
- **Choreography knobs** — total settle time, stagger window, duration-scaling
  curve (log vs linear vs uniform), finish order (size-ordered cascade vs
  simultaneous vs left-to-right).
- **Pivot treatment** — dim opacity, hero scale, glow on/off, alternative pivots
  (hero migrates to centre; others shrink instead of dim).
- **Theme hooks** — number/label fonts, panel/edge tokens, accent colour, glow
  intensity — all from the deck theme rather than hardcoded.
- **Provenance footnotes** — optional per-tile source IDs rendered as a tiny
  citation row (useful for technical/actuarial audiences).
- Invariants the template enforces: numerals ≥72px at 1920×1080, tabular-nums,
  safeMode static finals, hero growth kept inside the canvas.
