---
name: "deck-kit:typography"
description: Use when you want type itself to carry a slide — giant numerals, kinetic word motion, an editorial serif display, or weight used as emphasis — and need the kit's font setup and the four real type-led slide forms.
---

# Typography

> **Deck Kit** — build a presentation deck as code with your coding agent.

On most slides type is the delivery vehicle for something else — a chart, a diagram, a list. On a typography slide, **type is the design**. There is no chart to hide behind: the size, weight, rhythm, and motion of the words *are* the visual. Used well, a type-led slide is the most memorable thing in a deck — one number, one phrase, one word, sized so the room can't look away.

This kit ships four type-led slide forms in `slides/`, each a different way to let type do the work. Copy whichever fits your moment, then swap in your own words.

## When to use this

- You have **one figure** that deserves the whole screen — a headline result, a single KPI.
- You have a **short statement** (a thesis, a tagline) that should land as a phrase, not a bullet.
- You want a **calm, editorial** opener — a serif specimen rather than a chart.
- You want **emphasis without colour or boxes** — letting weight alone spotlight the words that matter.
- You're briefing a coding agent to build a type-driven slide and want it to use the kit's real fonts and forms.

## The font setup

Two typefaces are wired in for you, so you never pick or load a font per slide:

- **`--font-display` → Sora** — the display sans for headings, numbers, and statements.
- **`--font-mono` → JetBrains Mono** — the monospace for eyebrows, tags, captions, and anything that should read as a label.

Both are loaded with **`next/font`** in `app/layout.tsx` (`Sora` and `JetBrains_Mono` from `next/font/google`), which self-hosts the font files at build time — no external request at present time, no layout shift. `next/font` exposes each as a CSS variable (`--font-sora`, `--font-jetbrains`); `app/globals.css` maps those onto the friendlier `--font-display` and `--font-mono` tokens.

In a slide you don't touch any of that — you reach for the two **Tailwind classes** the tokens generate:

```tsx
<h1 className="font-display text-7xl font-semibold">A headline in Sora</h1>
<span className="font-mono text-sm uppercase tracking-[0.3em]">label in jetbrains</span>
```

Use `font-display` for anything that should feel like *voice* (headlines, numbers, statements) and `font-mono` for anything that should feel like *apparatus* (eyebrows, provenance tags, captions). The contrast between the two is itself a design tool.

### Tabular numerals

When figures sit on top of each other or animate in place, proportional digits make them jitter — a `1` is narrower than a `0`, so the number twitches as it counts. Lock the digit width with **tabular numerals**:

```tsx
<span className="font-display" style={{ fontVariantNumeric: "tabular-nums" }}>
  1,284.0
</span>
```

Every digit now occupies the same box, so a count-up animation and a column of aligned figures stay rock-steady. This is essential for the numerals form below.

### Size, weight, and motion as emphasis

A type slide has three levers and you should pull them deliberately:

- **Size** — make the one thing that matters enormous and everything else small. Hierarchy by scale, not by colour.
- **Weight** — thin resting text with a heavy spotlight reads as emphasis without adding a single box or accent. Sora's weight range (300–800) is the whole palette.
- **Motion** — *where* and *how* a word enters tells the eye what to read first and what to settle on last. Stagger, vector, and a delayed "hero" landing turn a static phrase into a sentence with a downbeat.

## The four type-led forms

Each is a real slide folder — read its `Slide.tsx` and `README.md` for the full pattern.

- **`type-numerals` — giant tabular numerals as the hero.** One enormous figure (≈440px) counts up and dominates the screen, with a small mono provenance eyebrow above and a caption beneath. Each presenter step swaps to the next figure in a sequence. The form for "here is the number that matters." (Walked in full below.)

- **`type-kinetic` — multi-word motion, hero word lands last.** A short statement assembles itself in motion: each word arrives along its own entrance vector (slide up, drop, scale-in, blur-in), staggered left-to-right like a musical phrase, and a larger, bolder **hero word lands last** as the deliberate downbeat. The form for a thesis you want the room to *watch* resolve.

- **`type-serif-display` — editorial serif display.** A calm, authoritative specimen: a giant serif headline with a drop-cap, an italic pull-line, and a small-caps colophon — three cuts of one voice (roman, italic, small-caps). Uses a web-safe serif stack so it renders identically offline. The deliberate opposite of neon; the form for a literary opener or section title.

- **`type-variable-weight` — weight sweep spotlights words.** One large statement opens uniformly thin, then a heavy spotlight weight **sweeps forward word by word**, emphasising one meaning-bearing word per step, before the whole line settles into a confident medium. Connective words ("is", "the") never take the spotlight, so the sweep always lands on meaning. The form for building a sentence's argument live, using weight alone.

## Worked example

Walk `slides/type-numerals/Slide.tsx` — the cleanest demonstration of giant tabular numerals as the hero element.

1. **The data is a small array of figures.** `NUMERALS` is a list of `{ value, decimals, unit, unitInline, caption, tag }`, pulled from neutral sample data in `lib/sampleData.ts`. Each entry is one "monument" — one screen-filling figure with its caption and a mono provenance `tag`. The `step` index selects which one is on screen, so the slide's `meta.steps` equals the number of figures.

2. **The figure is the whole composition.** A centred flex column holds one enormous number — `text-[440px]`, `font-display`, `font-semibold`, with tight `leading-[0.82]` and negative tracking so it reads as a single dense mass. Critically it carries `style={{ fontVariantNumeric: "tabular-nums" }}`: as the value counts up, every digit holds its box and the number never twitches.

3. **The count-up runs on a MotionValue, not React state.** `AnimatedFigure` creates a `useMotionValue(0)` and a `useTransform` that formats the running value (locked decimals, thousands grouping via `formatFigure`). `animate(mv, n.value, …)` drives it from 0 to the target with an eased curve; the rendered `motion.span` updates outside React's render loop, so a 440px number animates smoothly with no re-render storm. A `replayKey` (`idx + restartKey * 100`) re-keys the figure so the count restarts cleanly when the step changes or the presenter presses replay.

4. **The supporting type stays quiet.** A `font-mono` eyebrow at top-left carries the provenance tag in uppercase, wide-tracked small caps; step pips at top-right show position in the sequence; and a `font-display` caption sits beneath the figure in the dim tone. All of it is small on purpose — nothing competes with the number.

5. **Safe mode swaps the count for the settled value.** Because the count-up is heavy motion, the slide honours `safeMode` with a distinct twin: `StaticFigure` renders the same 440px tabular figure at its final value with no animation, and the wrapper sets `transition={{ duration: 0 }}`. That genuine static render is why its `meta` declares `hasSafeMode: true`.

The takeaway: pick one figure, make it enormous, lock its digits with tabular numerals, and let everything else be small mono apparatus around it. That's the entire form.

## Try it with your agent

Hand your coding agent something like this:

> Read `skills/build-a-slide/SKILL.md` for the slide contract, then read `slides/type-numerals/Slide.tsx` to see how a giant tabular-numeral hero is built. Copy it to a new slide folder, replace the `NUMERALS` array with my own three figures (each with its own caption and a mono provenance tag), keep `fontVariantNumeric: "tabular-nums"` and the `StaticFigure` safe-mode twin, set `meta.steps` to the number of figures, register it in `deck/deck.ts`, and run `npm run typecheck && npm run lint && npm test && npm run build`.

For a statement rather than a number, point it at `slides/type-kinetic` or `slides/type-variable-weight` instead; for an editorial opener, `slides/type-serif-display`.

## Related skills

- `build-a-slide` — the base contract every slide follows (`meta`, the 1920×1080 canvas, steps and reveals, safe mode, registration). Read it before building any type-led slide.
- `choose-a-look` — decide whether a type-led treatment is the right form for this moment before you commit to one.
- `layouts` — composition forms for arranging content on the canvas when type isn't carrying the whole slide on its own.
