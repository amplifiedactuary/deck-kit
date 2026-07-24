---
name: "deck-kit:data-and-metrics"
description: Use when a slide has to carry data — a chart, a table, a wall of KPIs, a gauge, a heatmap, or a single big number that counts up. Covers the data-driven slides this kit ships, the scale-helper pattern they share, where sample data lives, and the safe-mode static-twin every animated chart needs.
---

# Data and Metrics

> **Deck Kit** — build a presentation deck as code with your coding agent.

Charts and big numbers are the same skill here, because they lean on the same toolkit: a few hand-rolled helpers that map data values to pixels on the fixed canvas, plus the kit's reveal/animation primitives. Whether you're drawing a line, racing bars, or counting a headline figure up from zero, the moves are the same — pick the form, map the numbers onto the canvas, animate the reveal, and provide a settled static version for safe mode.

Read `build-a-slide` first if you haven't — everything below assumes you know the slide contract (the `meta` shape, `SlideProps`, the 1920×1080 canvas, `Reveal`, and safe mode).

## When to use this

- A slide's job is to **show data**: a trend, a ranking, a distribution, a comparison, or a set of KPIs.
- You want a **single number to land hard** — a headline figure that counts up, or a wall of figures.
- You're choosing between the data forms this kit ships and want to know what each one is good at.
- You're briefing an agent to build a data slide and want it to follow the kit's scale-helper and safe-mode conventions instead of reaching for a charting dependency.

## The data forms this kit ships

Each lives in `slides/<id>/` and is registered in the deck under the `data` group. One short entry each — what it shows, and the technique worth borrowing.

- **`data-agents-line`** — a single line over time that **draws itself** left to right, with a glowing head dot, an area fill that follows under the stroke, and callouts that pop in as the line passes them. Technique: an SVG path revealed by animating `pathLength`, driven by a custom easing function so the sweep lingers where it matters. This is the reference slide for both the scale-helper pattern and the safe-mode static twin.
- **`data-bar-race`** — horizontal bars that **grow and re-rank** across a sequence of keyframes, rows swapping position as the order changes, with a running label/counter. Technique: framer-motion `layout` animation does the row glide for free when you reorder the list; bars scale relative to the current leader so early frames still fill the frame.
- **`data-table-sort`** — a typeset table that **re-sorts itself** per step, each sort answering a different question, rows gliding to their new positions. Technique: the same `layout` row-glide as the bar race, applied to a familiar table form — the most credible animated data device in a conservative room, because the form is ordinary and only the motion is new.
- **`data-calendar-heat`** — a GitHub-style **heatmap** grid where cells ignite in a chronological sweep, each flashing bright before settling into its heat colour. Technique: a small colour ramp keyed to each cell's value, plus a staggered reveal so the grid lights up in order rather than all at once.
- **`data-dot-grid`** — one **countable dot per unit** (a policy, a commit, a customer) laid out in a precise grid, cascading in so a bare number becomes a wall you can point at. Technique: a staggered per-dot reveal with a live counter tied to the cascade, then a recolour sweep that turns the mass into a story.
- **`data-counter-wall`** — a grid of **KPI tiles all counting up at once**, with scattered start delays and durations scaled to each value's magnitude, finishing in a size-ordered cascade. Technique: animate a numeric `MotionValue` from 0 to the target and format it on each frame; stagger the starts so the wall feels alive rather than mechanical.
- **`data-gauges`** — headline KPIs rendered as analogue **instrument dials** — tick rings, etched labels, needles with spring physics — so the numbers read like measurements rather than pitch-deck stats. Technique: hand-rolled SVG dials with a spring-driven needle angle mapping value onto the dial's arc.

Pick by intent: a trend → line; a ranking that changes → bar race or table; a distribution over a grid → heatmap; raw countable scale → dot grid; a set of headline figures → counter wall or gauges. `pick-a-form` covers this choice more broadly.

## The scale-helper pattern

None of these slides pull in a charting library. A chart is just data drawn onto the canvas, and the bridge between the two is a pair of tiny functions that convert a data value into a pixel coordinate. You define a fixed **plot rectangle** in absolute pixels on the 1920×1080 canvas — a left edge, a width, a top and a baseline — then write helpers that scale a value into that rectangle.

`data-agents-line` is the clearest example. It declares the plot box as constants (`X0`, `PLOT_W`, `Y_TOP`, `Y_BASE`) and exposes two helpers:

- `xFor(h)` — turns a position along the x-domain (here, a month) into an x pixel inside the plot.
- `yFor(v)` — turns a data value (here, an NPS score) into a y pixel, with the baseline at the bottom and larger values higher up.

Every visual element — the line path, the gridlines, the axis ticks, the callout dots, the average reference line — is positioned by calling `xFor`/`yFor`. That's the whole pattern: lay out a plot rectangle once, write `xFor`/`yFor` (and any siblings you need, like a colour-ramp helper for a heatmap), and build the chart by mapping data through them. `data-calendar-heat` does the same idea for a grid (`colX(hour)` / `rowY(day)`), and `data-table-sort` derives bar widths from a value's fraction of the column maximum. You don't need any geometry maths beyond "value, scaled into a box."

## Data source

Numbers come from one of two places:

- **Shared sample data** — `lib/sampleData.ts` holds neutral, fictional datasets for the made-up "Northwind Insurance". Import what you need: `quarterlyRevenue`, `regionalHeadcount`, `claimsRatio`, `productMix`, `npsOverTime`, and the `headlineKpis` object. These are a consistent starter set; not every export is used by an example slide, and you're meant to build new slides from them.
- **A slide-local data file** — for anything bigger or shaped specifically for one slide, drop a `data/*.json` inside the slide folder and import it directly (the example slides each carry their own, e.g. `slides/data-agents-line/data/agents-series.json`). Keep the slide's own structured data here; keep anything you want to reuse across slides in `lib/sampleData.ts`.

Swap the sample numbers for your own as your last step — build against the fictional data so the slide works first, then replace it.

## The safe-mode static twin

Safe mode (the `S` key) is the presenter's escape hatch: if animation misbehaves live, every slide drops to a static render. For most slides, passing `safeMode` through your `Reveal`s is enough — the content just appears with no motion.

**Animated charts are the exception.** A self-drawing line, a counting number, or a racing bar can't be "shown instantly" by a reveal — there's nothing for an instant transition to land on, because the drawing *is* the content. So an animated chart must render a **distinct static version**: the final, settled chart with no motion. `data-agents-line` is the reference — it branches on `safeMode` and renders either an `AnimatedChart` (the path that draws itself) or a `StaticChart` twin (the same path, already complete, head dot parked at the end). Both share the chart chrome (axes, grid, callouts), so they look identical at rest; only the motion differs.

When you provide a real static twin like this, declare `hasSafeMode: true` in your `meta` — it's a promise to the Overview and the presenter that toggling safe mode produces a meaningfully different, fully-static render. (See `build-a-slide` for the full safe-mode contract.) Every data slide in this kit declares it, because every one of them animates something that needs a settled fallback.

## Worked example

Walk `slides/data-agents-line/Slide.tsx` top to bottom — it shows the whole pattern in one slide.

1. **Setup.** It marks itself a client component, imports `Reveal` and the slide types, and imports its data from `./data/agents-series.json`. Its `meta` declares `id: "data-agents-line"`, `steps: 2`, `group: "data"`, and `hasSafeMode: true`.
2. **Geometry and helpers.** It defines the plot rectangle as constants and the `xFor`/`yFor` helpers, then precomputes the line path string once by mapping the data through them. This is the scale-helper pattern in action — everything downstream is positioned through these functions.
3. **Header.** Absolutely positioned at the top-left: a small caps kicker, a display heading, and a one-line subtitle describing what the chart covers.
4. **Fact strip.** A row of headline figures (respondents, peak, months) pulled straight from the data's `facts`, top-right — the at-a-glance anchors that frame the chart.
5. **The chart, branched on safe mode.** The body renders `safeMode ? <StaticChart …/> : <AnimatedChart …/>`. The animated branch draws the line via `pathLength`, slides the area fill in under it, and pops callouts as the head passes. The static branch renders the same chart already settled. Both call the shared chart-chrome components, so the rest frame matches.
6. **Step-1 takeaway.** A single sentence wrapped in `<Reveal show={step >= 1} safeMode={safeMode}>` — the slide's "so what", revealed on the presenter's next click rather than competing with the chart on entry.
7. **Provenance footnote.** A small, dim line at the bottom noting the data is illustrative and where it's from. Always tell the room what's real and what's shaped — credibility costs one line of text.

Copy that shape for any chart slide: helpers and path up top, header + fact strip + branched chart + step-gated takeaway + provenance footnote in the layout.

## Try it with your agent

Hand your coding agent something like this:

> Read `slides/data-agents-line/Slide.tsx` to learn this kit's scale-helper pattern (`xFor`/`yFor` over a fixed plot rectangle) and its `AnimatedChart` vs `StaticChart` safe-mode split. Then build a new bar-chart slide in `slides/<id>/`: define a plot rectangle and a `barWidth(value)` helper, draw one bar per item from `quarterlyRevenue` in `lib/sampleData.ts`, reveal the bars on `step >= 1`, add a step-2 takeaway line and a provenance footnote, and render a static version when `safeMode` is on with `hasSafeMode: true`. Register it in `deck/deck.ts` and run `npm run typecheck && npm run lint && npm test && npm run build`.

## Related skills

- `build-a-slide` — the base contract every slide follows, including the full safe-mode rules. Read it before this one.
- `choose-a-look` — settle the visual treatment (theme, colour, density) for your data slide before you build it.
- `typography` — type-led slides and how to set numerals, headings, and labels so the data reads cleanly on a projector.
