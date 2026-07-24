# Design notes — 01 · Big statement

## Design intent

- **One idea per screen, one beat per click.** The layout exists for spine-sentence
  moments: the presenter stops narrating data and delivers a line. Each click lands
  the next 1–3 words; the audience reads at exactly the speaker's pace.
- **Emphasis rides the newest words.** Past chunks drop to 34% opacity and 96%
  scale rather than disappearing — the sentence stays legible as a whole while the
  eye is pulled to the fresh chunk. The payoff chunk is bigger (220px vs 168px) and
  takes the accent colour: a typographic crescendo.
- **Restraint is the design.** No panels, no icons, no imagery. The only non-type
  element is a 1px hairline rule that draws itself in on the settle beat. Negative
  space does the framing; the dark `bg` token is most of the canvas.
- **Settle beat.** The last step adds nothing new to the argument — it just lets the
  poster compose itself (rule + mono footer) so the slide can sit on screen while
  the presenter keeps talking. This is deliberate: big-statement slides are often
  *held*, not advanced through.
- Motion is one easing curve (`[0.22,1,0.36,1]`), fade-up entries, ~0.65s. No
  spring, no overshoot, no spectacle.
- Projector check: minimum text size on the slide is 24px mono at 85% opacity
  (footer); everything else ≥26px or display-sized. Contrast carried by ink-on-bg.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Big Statement"), it would
parameterise:

- **`chunks[]`** — 2–5 items of `{ text, size?, accent? }`. Template validates the
  whole sentence fits 1920px per line at the chosen sizes (auto-shrink with a
  warning, or auto-wrap rejection — nowrap is part of the look).
- **`kicker?`** — optional small mono eyebrow; behaviour (recede after step 0) is
  fixed, only text/visibility configurable.
- **`footer?` + `showRule?`** — optional settle beat. Omitting both drops the final
  step automatically (steps = chunks.length).
- **`emphasisStyle`** — how past chunks recede: `dim` (opacity only), `dim+shrink`
  (default), or `none` (whole sentence stays full strength; for short 2-chunk uses).
- **`payoffTreatment`** — `accent` colour and/or size multiplier for the final
  chunk; some talks want a deadpan all-ink finish.
- **Theme tokens** — colours/fonts come entirely from the deck theme (`bg`, `ink`,
  `dim`, `accent`, `edge`, `font-display`, `font-mono`), so the template restyles
  itself per deck with zero per-slide work.
- **Fixed, not parameterised:** centered alignment, easing curve, reveal timing,
  one-chunk-per-step pacing — the pacing *is* the template's value; letting users
  tweak it would dilute the form.

## Rehearsal notes

- Hold step 3 ("It was me.") for a beat before clicking to the settle step.
- Works best after a dense data slide — the contrast in density is the effect.
