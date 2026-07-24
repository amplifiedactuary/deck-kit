---
name: "deck-kit:animated-explainers"
description: Use when a slide needs continuous motion over time rather than a few discrete clicks — a minute-or-two "explainer video" feel built in code: something that moves, grows, accumulates, or zooms out concrete-to-abstract (a process building up, a quantity piling up, a camera pull-back, a simulation running). Covers the time-driven canvas engine, authoring in beats, theming it, hosting it as a deck slide, and verifying it by screenshot. For a static composition or a handful of presenter-click reveals, use build-a-slide and diagrams-and-devices instead.
---

# Animated Explainers

> **Deck Kit** — build a presentation deck as code with your coding agent.

Most slides in this kit unfold on **presenter clicks** — discrete `step`s that reveal parts of a
figure (see `build-a-slide` and `diagrams-and-devices`). Some ideas don't work that way. When your
point is a thing *happening over time* — a storm approaching, a value accumulating, a system
assembling itself, a camera pulling back from one concrete case to the whole abstract field — you
want a **continuous, timed animation**: the "explainer video" look, but built in code so it stays
razor-sharp on a projector, replays identically, and can be scrubbed and screenshotted.

This skill is the **how**, not a particular design. The engine and the authoring method are
theme-free; the palette, fonts, and on-screen devices are yours to choose. A tiny, runnable starter
lives beside this file: **[`explainer-harness.html`](explainer-harness.html)** — open it in a
browser, then read it top to bottom. It is ~180 lines and every idea below is in it.

## When to use this

- Your content is **motion over time**: something moves, spins, grows, fills up, sweeps, or zooms.
- You want a **concrete → abstract** build — follow one specific case, then pull back to the general.
- You want an **explainer that runs for 30s–2min** and carries several ideas in one continuous take.
- You'd otherwise be tempted to drop in a **pre-rendered video** — this gives you the same feel with
  crisp text, deterministic replay, presenter control, and no giant binary in the repo.

**Not for:** a static composition (use `layouts`), or an argument that discloses in a few discrete
clicks (use `diagrams-and-devices`). If you can express it as "click → reveal → click → reveal,"
it's a device slide, not an explainer.

## The one idea that makes it work

> **Everything on screen is a pure function of the clock `t` (seconds).**

You never write "start animation A, then trigger B." You write: *given that we are 6.0 seconds in,
where is every element right now?* — and redraw the whole frame from scratch. One `render(t)`
function is the entire animation. This single discipline buys you four things for free:

- **Scrubbing / seeking** — jump to any moment; the frame recomputes exactly (`seekTo(6)` always
  shows the identical frame).
- **Deterministic replay** — press replay, get a byte-identical run (as long as randomness is seeded
  — see Common Mistakes).
- **Screenshot verification** — because seeking is exact, a headless browser can snap each beat at a
  known timestamp and you can *look* at it (see the last section).
- **No video file** — it's computed live, so it's vector-crisp at any projector resolution and
  trivially editable.

If you find yourself reaching for `setTimeout`, chained transitions, or "when this finishes, do
that," stop — you're leaving the function-of-`t` model and you'll lose all four properties.

## The harness (reuse it; don't rewrite it)

`explainer-harness.html` splits into three zones. You edit the first two and leave the third alone:

| Zone | What it is | Do you touch it? |
|---|---|---|
| **`TOKENS`** | palette + fonts — your theme | Yes — this is where a new look starts |
| **`BEATS[]`** | your content: each beat's time window + `draw(t, ctx, u)` | Yes — this is the whole explainer |
| **The engine** | master clock, 1920×1080 scaler, `seekTo`, replay, key-seek, progress bar | No — identical across every explainer |

The engine's core is just this — one path serves both the live loop and seeking, so they can never
drift apart:

```js
function render(t){
  ctx.fillStyle = TOKENS.bg; ctx.fillRect(0,0,1920,1080);      // clear
  const b = BEATS.find(b => t>=b.start && t<b.end) || last;    // active beat
  b.draw(t, ctx, ease(t, b.start, b.end));                     // draw THIS beat at t
}
window.seekTo = s => { paused = true; render(clamp(s,0,DURATION)); };  // scrub == render
```

Everything else (the seeded PRNG `mulberry32`, `lerp`, `easeInOut`, the `seg`/`ease` window helpers,
the stage scaler, the caption helper) is small and already in the file. Copy the file, keep the
engine, replace `TOKENS` and `BEATS`.

## Author in beats, not frames

The reusable *method* matters as much as the engine. **Write the beat sheet before you write any
code.** A beat is one idea with a time window:

```
Beat 3 · 24–50s · "the wind profile is a CHOICE"
  draws:   the radial curve + two data-anchor handles + a second curve overlaid
  caption: "Same storm. Two defensible wind fields."
```

Then each beat becomes one entry in `BEATS[]`:

```js
{ id:'3 — profile', start:24, end:50, draw(t, ctx, u){
    // u is eased 0..1 progress through THIS beat, precomputed for you.
    // Draw the beat's end-state, parameterised by u so it builds as u climbs.
} }
```

Rules that keep beats composable:
- **A beat draws only itself.** It reads `t`/`u` and paints its own end-state-in-progress. It never
  reaches into another beat's state.
- **`u` is your build knob.** Length, opacity, count, position — express each as a function of `u`
  (`lerp(0, 10000, u)` counts a number; `lerp(360, 1560, u)` grows a line). At `u=1` the beat is
  settled; that settled frame is also your safe-mode/poster frame.
- **Overlap windows to cross-fade.** Beats can share time; draw both and fade on their own `u`s.
- **Keep the beat list flat and data-first** — the same shape as the kit's device slides, where one
  array drives everything. Re-cutting the explainer is editing the array, not the engine.

## A few drawing patterns you'll reuse

- **Draw-on:** grow a length/arc with `u`. (`lineTo(lerp(x0, x1, u), y)`.)
- **Count / fill:** sample a value from `u` rather than incrementing a variable — so seeking works.
- **Accumulate:** N discrete things landing (dots into bins, cells lighting) — drive the count with
  `Math.floor(lerp(0, N, u))` and place each with the **seeded** PRNG so it's stable on replay.
- **Camera move (the concrete→abstract money shot):** wrap a beat in
  `ctx.translate/scale(lerp(zoomed, 1, u))` so the whole scene pulls back as one continuous move.
- **Layer canvas + DOM:** draw shapes/curves on the canvas; for crisp large headings, absolutely
  position HTML text over the stage instead of `fillText`. Both live in the 1920×1080 stage.

## Theme it (this is what other people will change)

The look is **separable from the engine**, in two layers:

1. **Tokens** — `TOKENS` holds colours and font shorthands. A new theme starts and often ends here.
2. **Devices** — the small drawing helpers (`caption()` in the starter; add your own gauge, chart,
   card, ledger). These are your component library; they read `TOKENS` so a token change reskins
   them all at once.

To take an existing explainer to a completely different look and topic: change `TOKENS`, swap the
device helpers for your visual vocabulary, and rewrite the `BEATS` draw bodies. The clock, scaler,
seeking, replay, and verification harness are untouched. That separation is the point — the *how* is
constant; the *what* is yours.

## Make it a good citizen in the deck

Hosted as a kit slide, an explainer is a React component that mounts a `<canvas>` and runs the
clock. Wire the engine to `SlideProps` (see `build-a-slide`) in one of two modes:

- **Autoplay** (most explainers): `meta.steps = 1`. Start the clock when `isActive` becomes true,
  and restart it when `restartKey` changes (that's what `R` does). The piece plays as one take.
- **Presenter-driven:** set `meta.steps` to your beat count and, instead of a wall clock, ease the
  clock toward `BEATS[step].end` — each presenter click advances to the next beat and the animation
  glides there. Now a clicker walks the explainer beat by beat.

**Safe mode:** render the **final settled frame** — `render(DURATION)` — as the static poster, and
declare `hasSafeMode: true`. Because every beat's `u=1` state is already its resting state, the last
frame is a valid still with no extra code.

## Verify by screenshot (the build loop)

Function-of-`t` makes this skill testable, so use it. After implementing the beats, drive a headless
browser to `seekTo` each beat's midpoint, screenshot, and **read the images**:

```python
# Playwright (Python). Assumes window.seekTo(seconds) is exposed — the harness does.
for t in [2, 6, 10.5]:                      # a timestamp inside each beat
    page.evaluate(f"window.seekTo({t})")
    page.wait_for_timeout(200)
    page.screenshot(path=f"/tmp/beat-{t}.png")
```

The loop: **beat sheet → implement → seek-and-screenshot every beat → look → fix.** It catches text
that overflows, elements that overlap, a build that hasn't landed by the time you claimed, or a
caption that says the wrong thing. It's the same reason the model works: if you can seek to it, you
can prove it.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| `setTimeout` / chained transitions | Can't seek or replay; state drifts | Make it a function of `t`; sample, don't schedule |
| `Math.random()` in a beat | Different picture every replay/seek | Seed a PRNG (`mulberry32`) once; sample from it |
| One long pre-rendered video | Blurry on projectors, fixed clock, huge file | Compute live; you keep crispness + control |
| Too many ideas per beat | Audience can't read it in the window | One idea per beat; split or lengthen the window |
| `fillText` for big headings | Canvas text is soft at scale | Absolutely-position HTML text over the stage |
| No safe-mode frame | Deck safe mode shows a blank/mid-build canvas | Render `DURATION` (the settled last frame) as the poster |

## Try it with your agent

> Read `skills/animated-explainers/SKILL.md` and open `explainer-harness.html` to learn the
> function-of-`t` engine. First write me a **beat sheet** for a ~90s explainer of `<my concept>`,
> concrete→abstract: each beat = a time window, the one idea it lands, what's drawn, and a caption.
> Then copy the harness, set `TOKENS` to `<my palette + fonts>`, and implement each beat as a
> `draw(t, ctx, u)` that builds off the eased `u`. Keep the engine untouched. Verify by seeking to
> each beat with a headless browser, screenshotting, and reading the frames; iterate until each beat
> is legible and lands on time. Finally, wrap it as a kit slide (autoplay on `isActive`, restart on
> `restartKey`, render the last frame for safe mode).

## Related skills

- `build-a-slide` — the slide contract (`meta`, `SlideProps`, `step`, `safeMode`) you wire the
  engine into. Read it first if you're hosting the explainer as a deck slide.
- `diagrams-and-devices` — the **discrete-click** sibling. If your idea is a few reveals rather than
  continuous motion, build it there instead.
- `choose-a-look` / `typography` — where your `TOKENS` (palette, fonts) come from.
- `data-and-metrics` — for the chart maths (curves, distributions, counters) a beat might draw.
