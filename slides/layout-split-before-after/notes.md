# Rehearsal / agent-brief notes — layout-split-before-after

## Design intent

- The split is the argument: same outcome, two clocks. Left is deliberately *boring* —
  low contrast, amber-muted, lots of negative space, a staircase Gantt that reads as
  "waiting". Right is *alive* — denser ink, accent glow, motion (sweep + pulse) that
  implies ongoing parallel work without demanding attention.
- The divide is a designed object, not an accident of layout: a gradient hairline that
  gains a glow when the right side arrives, so the contrast "switches on".
- The step-2 callout deliberately straddles the divide and the arrow pierces the card
  (amber tail on the old side, accent head on the new side) — the delta literally
  bridges the two worlds.
- Honesty guardrails: both panels use fictional sample data (lib/sampleData.ts). All
  numbers are illustrative; the chips label them as such. The productivity gain quoted
  is the sample **5.4× productivity gain**, representing a fictional reporting workflow.
- safeMode: the sweep and pulse are removed and the arrow renders fully drawn — the
  final step reads as a clean static poster for overview thumbnails.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Split: Before / After"), it
would parameterise:

- **Sides**: per-side `label`, `subline`, tone (colour token), background wash
  intensity, and a *visual slot* — here a sequential Gantt vs parallel lanes, but the
  slot should accept any small viz or image (e.g. screenshot vs screenshot, org chart
  vs org chart).
- **Per-side data**: the left/right slot payloads (phases array, lanes array) as
  schema-validated JSON, with axis units (`months`, `hours`, `$`, none) and tick
  formatting.
- **Stat chips**: 0–3 chips per side (`value`, `label`, tone), with an `illustrative`
  flag that auto-appends a caveat.
- **Divider style**: `hairline | glow | torn-edge`, split position (50/50, 40/60,
  60/40), and whether the divider "ignites" on step 2.
- **Delta callout**: headline value + unit (`5.4×`), caption, optional secondary line,
  optional footnote ladder; arrow on/off and direction; vertical landing position.
- **Steps**: fixed 3-step grammar (before → after → delta) with an optional 2-step
  collapse (both sides at once → delta).
- **Motion intensity**: `off | subtle | live` (maps to safeMode behaviour); the
  template guarantees the final step is a poster.
- **Typography scale**: title/kicker/footer slots with a global scale knob for longer
  titles.
