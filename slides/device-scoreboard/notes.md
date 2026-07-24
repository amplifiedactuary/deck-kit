# Rehearsal / agent-brief notes — device-scoreboard

## Design intent

The scoreboard is a **rhetorical device**, not a chart. The whole point is to turn a
business result (target vs actual) into something that lands in one glance, using a
frame everyone already understands: a game score. Two teams, a clock running in
quarters, a final scoreline.

Choices that matter:

- **ANNUAL TARGET vs ACTUAL REVENUE** — the labels are doing the argument. The target
  side is *what was promised*; the actual side is *what was delivered*. That asymmetry
  makes the uplift feel earned.
- **Count-up on advancing steps** — the numbers don't just appear; they tick up like a
  scoreboard registering points. This buys a beat of suspense before the final ratio.
- **The uplift is the "score"** — posting +23% in a centre UPLIFT plate (rather than as a
  caption) keeps the game metaphor intact: a scoreboard's job is to show the score.
- **Amber = target, accent-blue = actual** — consistent with the deck's amber/accent
  split so a presenter can point at "the amber side" and "the blue side."

## Speaker cue

> "Here's the year as a scoreline. The board set a target of five million. The team
> delivered six-three. That's twenty-three percent above target — a meaningful beat."

## Templatise

This slide generalises cleanly into a **two-team scoreboard template** for any
"X vs Y, here's the ratio" beat:

1. **Parameterise the two teams.** Lift `TeamPanel` to take `{label, value, unit,
   accent, color, align, footnote}` (already close). The static `PosterTeam` is a near
   duplicate — a real template would share one panel component driven by an
   `animated?: boolean` flag rather than maintaining two.
2. **Parameterise the score.** The centre UPLIFT plate is configurable with a unit suffix
   (`×`, `%`, `pts`). Expose `scoreLabel`, `scoreSuffix`, and a `formatScore` fn.
3. **Parameterise the period motif.** `PERIODS` + step count are coupled (one quarter
   per step). A template would accept `periods: string[]` and derive `meta.steps` from
   `periods.length + 1` (stage step + one per number + ratio), or decouple them.
4. **Reuse the count-up primitive.** `ScoreNumber` (MotionValue + `animate()` +
   `useTransform(toFixed)`) is the genuinely reusable core — it's ESLint-safe and works
   for any "count to N on activation" need. Worth promoting to a shared helper if more
   slides need it (note: shared helpers live in `components/`, which slide agents can't
   edit — would need a coordinating change across the repo).

Data stays in `data/metrics.json` so the template is content-only to retarget.
