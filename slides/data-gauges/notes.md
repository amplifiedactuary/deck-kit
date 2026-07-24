# Design intent — gauge cluster

The experiment is *register borrowing*: cockpit/test-bench instruments are an
aesthetic that audiences instinctively read as "calibrated, engineered,
accountable". Putting the build's three headline ratios on analogue dials makes
the implicit claim that they were *measured*, not asserted — which is exactly
the deck's stance (fictional sample data, as declared in the README). The amber
needle + amber numeral pairing ties pointer to reading; the etched labels and
panel screws are deliberately quiet details that sell the prop without
shouting.

Animation grammar: one spring (stiffness 42, damping 7.5) gives the needles a
real overshoot-and-settle, which is the whole emotional beat of step 1 — the
dials "wake up". The numeral count-up uses a heavier-damped spring so the
numbers settle slightly after the needles, like real instruments. SafeMode
parks everything at final values for a clean poster frame.

Scale choices: 0–5× for the two leverage-style ratios so 3.8 and 3.2 both land
in the upper amber band (visually "hot"), 0–2× for compression so 1.11 reads
correctly as *just past parity* — an honest needle position, not an inflated
one.

Watch-outs if promoted beyond the lab:
- Three near-identical dials risk monotony; consider one hero dial + two small.
- The 1.11× needle barely clears centre — rehearse the line that explains why
  "just over 1" is still remarkable, or the gauge undersells it.
- Captions are invented copy; rewrite against the locked talk script.

# Template-ised

A reusable "instrument cluster" template (for a ~50-template deck product)
would parameterise:

- **Gauges array** (1–4 dials): label, value, unit suffix, min/max, major/minor
  tick steps, decimal places for the readout, optional highlight band
  `{from, to}` with band colour, optional per-gauge caption + source tag.
- **Scale geometry**: start angle and sweep (240° default), dial size (drives
  the whole layout grid), needle rest position.
- **Theme hooks**: panel metal palette (dark steel / cream enamel / carbon),
  needle colour, numeral colour, font pair — so the same component does
  "aviation", "vintage automotive", or "lab bench" registers.
- **Animation profile**: spring presets (snappy / heavy / damped), stagger
  delay between dials, count-up on/off.
- **Step mapping**: which step engages the needles, which reveals captions —
  or a single-step "already engaged" mode for poster/summary slides.
- **Safe/static mode**: built in (needles parked), required for thumbnails and
  reduced-motion contexts.

Good fit for any talk with 2–4 headline KPIs that benefit from a "measured,
not marketed" framing: utilisation, conversion, latency budgets, loss ratios,
solvency coverage.
