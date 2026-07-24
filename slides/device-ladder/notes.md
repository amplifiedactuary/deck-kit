# Rehearsal / agent-brief notes — device-ladder

## Design intent

This is a **rhetorical device**, not a chart — the goal is *felt ascent*. The slide makes
progression **literal and vertical**: each rung is a maturity level, and the bar physically
*rises* to get there. The eye is pulled up-and-right, the natural reading of
"getting better / going higher".

Three deliberate visual choices:
- **Rise-from-floor animation** (not just fade) so the bar *grows* into place — value
  being built, not revealed. This is why `hasSafeMode: true`: a static poster can't
  carry the "climb" feeling, so safe mode shows the finished ladder instead of faking it.
- **Colour escalates with intent:** the current-state 2× rung is the cool, confident
  `accent` blue (where we are today); 1× is muted grey (the starting point); 4× is
  `amber` — bright and aspirational, signalling the strategic target.
- **×-level guide grid** behind the bars keeps the proportions honest: the audience can
  see 2× is genuinely double the baseline and 4× towers over it, so the metaphor doesn't
  cheat the maths.

## Speaker beats (suggested)

- Step 1 (1×): "Here's where most insurers start. Manual processes, one thread. This is the floor."
- Step 2 (2×): "Where Northwind is today — digital tools, real-time data, team capacity roughly doubled."
- Step 3 (4×): "Where the three-year roadmap takes us. End-to-end automation with human oversight."

## Templatise

If promoted from the style lab into the real deck, this generalises cleanly into a
**reusable "ascending multiplier ladder"** device:

- **Props to extract:** an array of rungs `{ value, mult, label, caption, tag, accent }`,
  plus `pxPerUnit` (the `PX_PER_X` height constant) and `floorY`. Everything else
  (positioning, grid, climb-arrow, rise animation) derives from those.
- **Generalisations:** the device isn't specific to any domain — it works for any monotonically
  increasing series you want to *feel* as a climb (maturity levels, cost-down curves,
  adoption tiers). Keep the per-rung `accent` so one rung can be visually privileged
  (current state) and another flagged (the target).
- **Watch-outs when templatising:**
  - Caption vertical anchor is computed as `top - 226`; if rung count or value font size
    changes, recompute that offset or the big multiplier can collide with the heading on
    the tallest rung.
  - `PX_PER_X` × max-mult must keep the tallest bar's top below ~270 to clear the heading
    band; assert this if rung values become data-driven.
  - Column `x` positions are hand-spaced for 3 rungs; for N rungs, distribute across the
    usable width `[250 … 1670]` instead of hard-coding.
  - Keep `hasSafeMode: true` and a genuine static branch — the rise animation is the whole
    point, so the fallback must show the built ladder, not an empty floor.
