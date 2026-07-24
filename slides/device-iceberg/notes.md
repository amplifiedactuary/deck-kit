# device-iceberg — design notes

## Design intent

- **Craft vs cliché.** The iceberg is the most over-used metaphor in business
  decks, so the whole bet is on execution: a real *scene* (sky, luminous
  waterline, depth-graded sea, light rays, drifting particles) rather than a flat
  icon. If the room feels like they're underwater, the cliché reads as intentional.
- **Light = revelation.** The submerged strata are present from step 0 as
  near-black silhouettes — the audience can *sense* the mass before it's named.
  Each step doesn't add shapes, it adds *light*: an illumination overlay fades in
  per band, with a slight stagger inside each pair so the reveal ripples downward.
- **One reading axis.** All callouts live in a single right-hand column at
  x = 1180 (THE DEMO at the top, then strata 01–04 in depth order), connected by
  leader lines with dots at the geometry end. Eyes only ever travel
  scene → right column.
- **Quantify, then conclude.** Step 3 deliberately switches register from
  atmosphere to measurement: engineering-style brackets with ticks at the stratum
  boundaries, rotated mono labels, then a centred ratio line and the closing
  statement. The slide ends on an argument, not a picture.
- **Restraint in motion.** Only three ambient animations (ray shimmer 9 s,
  particle drift 22 s, step fades) — slow enough to feel like water, never
  competing with the speaker. SafeMode drops all motion and lights the entire
  scene as a poster.
- **Projector discipline.** Strata labels 34 px, annotations 24 px, mono
  micro-labels letter-spaced; lit-strata gradients keep ≥ 3:1 contrast against the
  sea so the bands survive a washed-out projector.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Iceberg / hidden-mass
metaphor"), the parameterisation would be:

- **visibleTip**: label + annotation + proportion hint (the "~15%" line).
- **strata[]**: 2–6 entries of `{label, annotation}`; geometry auto-generated from
  the count (band heights, taper, facet lines) so authors never touch coordinates.
- **revealGrouping**: how strata light up per step — `one-per-step`, `pairs`, or
  `all-at-once` (drives `meta.steps` automatically).
- **quantification**: optional final-step gauge — ratio text template
  (`"{n} layers of X : 1 visible Y"`), on/off for the bracket pair.
- **closingLine**: the takeaway sentence (and whether it appears at all).
- **palette**: sea/ice hue pair derived from the deck theme tokens (e.g. an amber
  or emerald sea for other talks), with the lit-strata gradient ramp computed from
  it.
- **ambience level**: `full` (rays + particles + shimmer), `calm` (static rays),
  `off` (poster) — also the safeMode fallback.
- **labelColumn side**: right or left, for slides that need the scene mirrored.
- Fixed (not parameterised): the scene composition itself — waterline position,
  single label column, leader-line style — because that *is* the craft being sold.
