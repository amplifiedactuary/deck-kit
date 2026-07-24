# Notes — palette-insurance-navy

## Design intent

The heritage-palette slide: dress a strong KPI story in the visual language
the audience trusts most — their own corporate annual report. Navy ground,
brass accents, ivory type, heraldic shield watermark at 6% opacity, hairline
rules with lozenge centrepieces, a discreet full-page border. Everything is
centred and symmetric; nothing glows, nothing is neon. The story is carried
by the numbers (20.4M revenue, 23% growth, 91% retention) and copy
("a year of disciplined growth") that borrow insurance vocabulary on purpose.

Execution choices:
- Numerals at 148px, ivory — the only "loud" element; labels are tracked-out
  gold small caps at 21px, deliberately quiet.
- Gold is used only for *detailing* (rules, labels, border, watermark), never
  for large surfaces — that's what keeps it Big-4 rather than gaudy.
- Radial navy gradient (centre slightly above middle) gives the flat navy a
  subtle vignette so the white numerals sit in the brightest zone.
- Tracked uppercase uses matching `text-indent` to optically re-centre.

## Template-ised

If this shipped as one of ~50 deck templates, the reusable "corporate
heritage stat slide" would parameterise:

- **Palette tokens:** ground colour, deep-edge colour, accent (metal) colour,
  text colour, muted colour — the whole slide is driven by 6 constants.
- **Stat list:** 2–6 `{value, label}` pairs; column width and numeral size
  auto-scale with count.
- **Copy slots:** kicker text, 1–2-line headline, optional closing aphorism.
- **Ornament set:** watermark SVG (shield/crest/monogram/none), rule style
  (lozenge/plain/double), page border on/off — the "house style" knobs.
- **Composition:** centred (this one) vs left-aligned executive variant.
- **Step mapping:** which blocks reveal on which step (or all-at-once for a
  one-step poster).
- **Type pairing:** display + mono here; a serif display option would push it
  even further toward annual-report territory.
