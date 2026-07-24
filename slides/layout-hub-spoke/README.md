# 13 · Hub & spoke

> **PLACEHOLDER — experiment, not talk content.**

## The experiment

Can a 20–30 node *radial* layout stay calm and readable at projector distance?
Radial/hub-and-spoke diagrams usually collapse into hairballs; this lab tests the
opposite discipline: a "head office" hub at canvas centre, 8 divisions on an inner
ring, 16 teams on an outer ring (25 nodes total incl. hub), with deliberately *dim*
spokes (0.32 / 0.22 opacity), generous ring spacing (250 px / 425 px radii), and
labels only where they matter (all 8 inner nodes, just 3 outer nodes). Node colour
encodes kind — advisory (accent), operations (amber), oversight (ink) — node size
encodes ring tier. Theme: organisational structure for a fictional insurer (Northwind
Insurance).

## Steps

| Step | What appears |
|------|--------------|
| 0    | Title block + hub alone with the framing line ("every spoke is a division or team") |
| 1    | Inner ring fans out — 8 spokes draw from the hub, division nodes pop in staggered, legend appears |
| 2    | Outer ring lands — team branches + 16 nodes stagger in, stat caption: **8 divisions on inner ring** |

Step-0 Reveals animate in on every mount/restart (R key); jumping straight to a
later step plays all reveals at once. `hasSafeMode: true` — in safe mode all SVG
motion elements are replaced with distinct static markup (plain `<line>`/`<circle>`,
step-gated), so the overview thumbnail (final step, safeMode) reads as a static
radial poster.

## Data

`data/agents.json` — node list (id, label, kind, ring, angle, parent) + the stat block.

**Provenance:** fictional sample data (lib/sampleData.ts). All node names and stats
are invented placeholders for Northwind Insurance — a generic insurance company
scenario with no relation to any real data.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
