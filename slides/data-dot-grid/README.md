> **PLACEHOLDER — experiment, not talk content.**

# 44 · Commit dot grid

An example slide demonstrating the **unit dot grid** device. 240 dots — one per policy sold in Q4 at
Northwind Insurance — laid out as a precise 25-column grid that fills most of the
1920×1080 canvas. The experiment is *scale you can count*: every unit stays visible,
no abstraction, and the moment of interest is when 240 stops being a number and
becomes a wall. A live counter ties the cascade to the figure; product recolouring then
turns the wall into a story surface; finally two callouts prove you can point at
individual units inside the mass.

## Steps

| Step | What happens |
|------|--------------|
| 0 | 240 neutral dots rain in as a fast cascading stagger (~2s, row-major wave); the top-right counter ticks 0 → 240 in sync. |
| 1 | The grid re-colours by product line — four contiguous runs sweep into colour (Motor / Home / Life / Travel); legend fades in at the bottom. |
| 2 | Callouts: a rounded bracket pins the "Travel quarter → 13 new policies" run (those dots glow, the rest dim slightly), and one single dot — the last policy — gets a ring + "landmark corporate sale" label. |

**SafeMode / overview thumbnail:** static final poster — fully coloured grid with both
callouts and legend, no animation (plain divs, no motion components).

## Data provenance

`data/commits.json`:

- **FICTIONAL SAMPLE DATA** (`lib/sampleData.ts`): all values are illustrative and
  represent a fictional Northwind Insurance Q4 policy book (240 policies, 28 renewals).
- **Product lines**: Motor / Home / Life / Travel, with proportions drawn from
  `productMix` sample data. Boundaries and colours are illustrative; an on-canvas
  "product bands illustrative" footnote marks this.
- **Callouts**: both callout texts and dot indices are invented placeholders.

## Layout facts

- Grid: 25 columns × 10 rows (last row holds 15 dots), 24px dots (≥18px projector
  rule), 53px / 40px pitch.
- Legend labels 24px; callout labels 26–28px.
