> **PLACEHOLDER — experiment, not talk content.**

# 49 · Gauge cluster

An example slide asking: can aviation/engineering *instrument language* carry headline
KPIs with credibility? Three handsome analogue dials sit in a recessed brushed-metal
panel — tick rings, etched labels, amber needles with spring physics — reading
RETENTION 91%, SATISFACTION 4.6/5, GROWTH 23%. The visual argument: "these are
measurements, not marketing" — numbers presented like cockpit readings, not
pitch-deck stats.

All dial work is hand-rolled (CSS gradients for bezel/panel metal, inline SVG
for tick rings and scale numerals, framer-motion springs for needle swing and
value count-up). No chart libraries.

## Steps

| Step | What happens |
|------|--------------|
| 0 | Kicker line + title; instrument panel with all three dials at zero (needles at rest, numerals read 0%) |
| 1 | Needles swing up with spring physics (overshoot, then settle on the value); numerals count up beneath each dial |
| 2 | Caption strip lands below the panel — one plain sentence per gauge plus the metric ID and formula |

**SafeMode:** needles parked at their final values with zero-duration
transitions, numerals rendered as static text — a strong static poster for
overview thumbnails.

## Data provenance

`data/gauges.json` — fictional sample data (lib/sampleData.ts). All values are
invented for Northwind Insurance, a generic fictional insurer:

| Gauge | Value | Metric | Formula |
|-------|-------|--------|---------|
| RETENTION | 91% | annual | 91 of 100 customers renewing |
| SATISFACTION | 4.6/5 | NPS survey | avg score across 1,840 responses |
| GROWTH | 23% | YoY | revenue up 23% year-on-year |

Scale ranges and the amber "high zone" bands are design choices, not data.
