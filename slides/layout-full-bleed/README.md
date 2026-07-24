> **PLACEHOLDER — experiment, not talk content.**

# 02 · Full bleed (`layout-full-bleed`)

## The experiment

How much presence does a slide get when **the image IS the slide**? The entire
1920×1080 canvas is a single evocative, code-drawn backdrop — a procedural
abstract ring field (layered radial/linear gradients, SVG concentric rings
with numeric labels, two logarithmic-spiral arcs, a reference grid, and a
dashed projection track) drifting in a slow 180-second rotation under a dark
scrim. The foreground is just three lines: kicker → large statement → thin
attribution. No panels, no chrome beyond a small tag top-right.

Everything is pure CSS/SVG, generated deterministically at module scope
(no binary assets, no randomness, no remote fetches).

## Steps

| Step | Reveals |
|------|---------|
| 0 | Backdrop + station tags + kicker line |
| 1 | Large statement ("Growth is only the beginning.") |
| 2 | Hairline rule + attribution/data line |

## Safe mode

`hasSafeMode: true` — in safe mode the isobar field renders as a static
`<div>` frozen at 14°, the eye-glow pulse is replaced with a static gradient,
and Reveals are instant. The final step in safe mode reads as a static
poster (used by overview thumbnails).

## Data provenance

`data/storm.json` — **fictional sample data** for Northwind Insurance (a fictional
company). All numbers, tags, and copy are invented for layout demonstration.
