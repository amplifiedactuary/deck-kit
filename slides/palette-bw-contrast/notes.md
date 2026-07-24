# Notes — 18 · Black / white (palette-bw-contrast)

## Design intent

- **The discipline is the style.** With hue removed, every decision becomes weight,
  scale, or polarity. The slide leans on three moves: a brutal scale jump (22px mono
  kicker → 104px/800 headline → 128px numerals), Swiss hairline structure (4px top
  rule, 2px column dividers), and one inversion.
- **White canvas, black accent block.** Against the deck's dark default, a paper-white
  slide is itself a shock cut in the gallery — and it makes the single black cell
  (23 growth %, the payoff number) the unambiguous focal point. The inversion *is*
  the chart: the knocked-out cell reads as "this number is different in kind".
- **Step choreography mirrors the argument.** Steps 0–1 show the ordinary ledger
  (revenue / retention / customers, all black-on-white); step 2 slams in the
  inverted growth-% block plus the closing line. The reveal order makes the
  headline result land as a punch, not a table.
- Greys are confined to tertiary text (cell descriptions, closing-line lead-in) so the
  primary hierarchy stays strictly bichrome. Tabular numerals keep the four values
  optically aligned at 128px.
- Projector-readability is maximal by construction: worst-case contrast on this slide
  is grey-on-white body text at 21px; everything that matters is pure #000/#fff at
  display sizes.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Mono Stat Strip"), it would
parameterise:

- **Content:** kicker text; headline (1–2 lines); N stats (value, unit, one-line
  descriptor), N in 3–6; closing line with optional bold payoff span.
- **Hero index:** which stat gets the inversion treatment (or none); whether the hero
  reveals on its own step (climax mode) or with the rest (poster mode).
- **Polarity:** paper mode (white canvas, black hero block) vs ink mode (black canvas,
  white hero block) — same component, one boolean.
- **Type scale:** a single ratio knob driving kicker/headline/numeral sizes off the
  1920×1080 canvas, so the template survives shorter/longer headlines without manual
  px tuning; optional auto-shrink when the headline exceeds two lines.
- **Rule weights:** top-rule and divider thickness (the "Swiss-ness" dial), letter-
  spacing for the mono labels.
- **Grey budget:** the two permitted greys as theme tokens, so a strict-bichrome mode
  (greys → black) is one switch for maximum-contrast venues.
- **Step plan:** 1-step (all-at-once poster), 2-step (headline → strip), or 3-step
  (headline → strip → hero+closer), generated from the same content model.

What it would NOT parameterise: hue. The template's contract is monochrome; offering
an accent colour would dissolve the genre.
