# Notes — 13 · Hub & spoke (layout lab)

## Design intent

- **The legibility bet:** radial layouts die by clutter, not by geometry. Every
  choice here removes ink: spokes at 0.22–0.32 opacity (structure you *feel*, not
  read), dashed ring guides at near-background `edge` colour, only 11 of 25 nodes
  labelled, and a 175 px clear band between rings reserved for inner-ring labels.
- **Hierarchy through tiering, not arrows:** hub (r 64, ink-stroked, panel fill) →
  divisions (r 20, bright fills, labelled) → teams (r 11, 0.7 opacity,
  mostly anonymous). Outer nodes connect to their *parent* division, not the hub —
  16 long hub-crossing chords would have shredded the centre.
- **Colour = category**, deliberately limited to the deck's existing tokens
  (accent / amber / ink) so the lab stays comparable with sibling slides. Oversight
  nodes being plain ink reads as "quality is neutral infrastructure".
- **Choreography mirrors the org chart:** hub exists alone first (the centre,
  the point of the slide), the inner ring *fans out* (spokes draw before nodes pop, 70 ms
  stagger), then teams land outward-rippling (45 ms stagger) and the payoff
  stat ("8 divisions on inner ring") arrives last, bottom-right, in amber.
- **Honesty cue** kept on-canvas: "24 of 47 shown" — the diagram is a sampled
  portrait, and saying so costs one short mono line.
- **Verdict so far:** at 25 nodes the radial stays calm *if* labels are rationed and
  spokes are dim. The fragile spots are the 4 corners where HTML overlays (title,
  legend, caption) approach ring-1 nodes — at 30+ nodes or longer labels this layout
  would need the overlays moved into reserved dead zones or the ring radii shrunk.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Radial Hub & Spoke"), the
template would parameterise:

- **Hub:** label + sub-label, glyph or initials, radius.
- **Ring spec:** 1–2 rings, each with radius, node radius, label policy
  (`all | none | listed`), label font size. Hard cap (~30 nodes) enforced with a
  warning, since that's where the layout breaks.
- **Nodes:** id, label, category, ring, angle (or `auto` for even spacing /
  cluster-by-category), optional parent for ring-2 branching (default: nearest
  ring-1 node by angle).
- **Category palette:** map of category → theme token (not raw hex), driving both
  node fills and the auto-generated legend.
- **Spoke style:** opacity pair (hub-spokes vs branches), width pair, draw-on
  animation toggle.
- **Step plan:** which rings/overlays appear on which step; stagger intervals.
- **Stat caption:** value, unit phrase, sub-line template with `{n} of {total} shown`
  honesty slot auto-filled from the data file.
- **Overlay anchors:** title TL, legend BL, caption BR as defaults with optional
  repositioning — plus computed "keep-out" wedges so auto-placed nodes never
  collide with overlays.
- **Safe-mode poster** generated for free from the same geometry (static SVG, final
  step) — exactly what overview thumbnails / PDF export need.

Generalises well: team-around-a-product, services around a platform, distribution
channels around an insurer, risks around a portfolio — anything with one centre and
tiered satellites.
