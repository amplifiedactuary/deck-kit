---
name: "deck-kit:layouts"
description: Use when you need to arrange a slide's content on the canvas — the structural / compositional forms (big statement, before/after split, bento grid, 2×2 mosaic, full bleed, poster) and the technique of positioning pieces on the fixed 1920×1080 canvas and bringing them in across steps.
---

# Layouts

> **Deck Kit** — build a presentation deck as code with your coding agent.

A layout is the *shape* of a slide — how its pieces are arranged on the canvas and the order they arrive in. This skill is the menu of structural forms the kit ships, plus the one technique they all share: place everything on the fixed canvas, then let `step` decide what is lit at any moment. Layout is about composition, not content — once you know which shape serves your message, the [`content-to-deck`](#related-skills) and [`typography`](#related-skills) skills fill it in.

## When to use this

- You know *what* a slide needs to say and now need to choose *how to arrange it* on screen.
- You want a quick tour of the compositional forms the kit already demonstrates, so you can copy the nearest one.
- You're briefing a coding agent and want it to start from a real example layout rather than invent a grid from scratch.

This is a building skill. It assumes you already know the base contract — `meta`, `SlideProps`, the canvas, `Reveal`, and how to register a slide. If you don't, read [`build-a-slide`](#related-skills) first; everything below builds on it.

## The shared technique

Every layout in this kit is the same two moves:

1. **Position on the fixed 1920×1080 canvas.** As `build-a-slide` covers, the shell renders each slide onto an exact 1920×1080 canvas and scales it to fit any screen. So you lay out against those literal pixels and never the real viewport. Two ways to do it, mixed freely:
   - **Flex / grid that fills the canvas** — `flex h-full w-full …` for centred or column compositions (this is what `layout-big-statement` and the `_template` use).
   - **Absolute pixel positioning** — compute coordinates against 1920×1080 in module-scope constants (`const X0 = 88; const COL = 415;` …) and place elements with `position: absolute` / `style={{ left, top, width }}`. This is how the denser grids (`layout-bento`, `layout-mosaic-2x2`) keep cells exactly aligned, and it guarantees the server prerender and client render agree because the geometry is computed once, deterministically, at module scope.

2. **Bring pieces in with `step` + `Reveal`.** Lay the *whole* composition out once so it never reflows, then gate each piece on the step it should appear at — `<Reveal show={step >= 1} safeMode={safeMode}>` for simple fades, or a `framer-motion` `animate` keyed off `step` when you want a piece to dim, shrink, or shift rather than just appear. A `Reveal` that is hidden still holds its space, so the layout is stable across every click. Always thread `safeMode` through so the presenter's static fallback works.

The forms below differ only in *where* the pieces sit and *what rhythm* the steps follow.

## The forms

Each ships as a real slide folder you can read and copy. Pick by the message you're trying to land.

- **`layout-big-statement`** — *one sentence in giant type.* For a single line that must dominate the room. The sentence is split into typographic chunks; one chunk lands per step and emphasis rides the newest words while earlier ones dim, so attention always sits on the most recent phrase. Centred flex column; the final step settles a hairline rule and footer. Use it for a thesis, a punchline, or a section opener.

- **`layout-split-before-after`** — *two columns with a delta.* A vertical divide cuts the canvas in two: a calm, muted "before" panel on the left and an accent-lit, denser "after" on the right, so the contrast itself is the argument. Use it whenever the point is a change — old way vs. new way, slow vs. fast — and you want the audience to read both states at once and feel the difference.

- **`layout-bento`** — *an asymmetric grid of cards.* A bento grid of rounded tiles with varied spans (a big hero tile, wide sparkline and tag tiles, small stat tiles) reveals in a few clusters. Use it for a dashboard-style summary: several related facts that belong together on one screen but each deserve their own frame. The asymmetry keeps high density reading calmly instead of like a spreadsheet.

- **`layout-mosaic-2x2`** — *four quadrants, each a different genre.* The canvas splits into four equal cells around a designed centre junction; each cell hosts a different mini-visual (a big stat, a quote, a tiny chart, a diagram) and one cell ignites per step while the others sit dimmed but present. Use it when you have four parallel points of equal weight and want a steady four-beat rhythm that always shows the whole grid.

- **`layout-full-bleed`** — *the backdrop is the slide.* The entire canvas is one evocative, code-drawn background under a dark scrim, with only a kicker, a statement, and a thin attribution floating on top. No panels, no chrome. Use it for a mood beat or a dramatic transition where atmosphere matters more than information.

- **`layout-poster`** — *one colossal word.* A single word set enormous (bleeding off the canvas edge) in a high-contrast treatment, with a tiny mono subline for counter-scale and exactly one accent element. Use it as a hard punctuation mark between sections — the typographic equivalent of a held silence.

## Worked example

Walk `slides/layout-big-statement/Slide.tsx` to see the shared technique made concrete.

**The content is a list, not a string.** The sentence lives as an array of chunks at module scope:

```tsx
const CHUNKS = [
  { text: "The customer", size: 168, accent: false },
  { text: "is never",     size: 168, accent: false },
  { text: "the problem.", size: 168, accent: false },
  { text: "Clarity is.",  size: 220, accent: true  },
];
```

Splitting the sentence this way is what lets the slide reveal it *phrase by phrase* and give the closing chunk both larger type and the accent colour.

**Layout once, then map over the chunks.** The component fills the canvas with a centred flex column (`flex h-full w-full flex-col items-center justify-center`) and maps every chunk into the layout up front — so all four lines occupy their space from step 0 and nothing reflows as they arrive:

```tsx
const currentChunk = Math.min(step, CHUNKS.length - 1);

{CHUNKS.map((chunk, i) => {
  const revealed = step >= i;             // this chunk has been reached
  const isCurrent = revealed && i === currentChunk; // it's the newest one
  return (
    <motion.div
      animate={
        !revealed
          ? { opacity: 0,    y: 44, scale: 1    }  // not yet arrived
          : isCurrent
            ? { opacity: 1,    y: 0,  scale: 1    } // full emphasis
            : { opacity: 0.34, y: 0,  scale: 0.96 } // revealed but receded
      }
    >
      {chunk.text}
    </motion.div>
  );
})}
```

**`step` drives the emphasis, not just visibility.** Three states fall out of `step`: a chunk not yet reached is invisible and offset; the chunk at `currentChunk` (the newest one) is fully lit; and any earlier revealed chunk drops to 34% opacity and shrinks slightly. So as the presenter clicks, the bright phrase walks down the sentence and the rest settles into quiet context — the *emphasis* moves, which is the whole point of the form. `Math.min(step, CHUNKS.length - 1)` pins emphasis to the last chunk once the sentence is complete, so it stays strong on the final step.

**A settle beat after the words.** One step past the last chunk (`step >= CHUNKS.length`), a hairline rule animates its width open and a footer fades in, inside a fixed-height container so adding them never nudges the sentence above. That's the closing punctuation.

**Safe mode is a real twin.** Because the slide animates opacity and scale (not just fade-in), it can't rely on `Reveal` going instant — so it declares `hasSafeMode: true` and branches to a `StaticStatement` component with identical structure but plain CSS opacity/transform and no `motion`. Toggling safe mode therefore produces a genuinely static, fully-composed slide rather than a half-animated one. That mirrors the rule in `build-a-slide`: only claim `hasSafeMode: true` when you ship a distinct static render.

The takeaway you can reuse for any layout: **hold content in data, lay the full composition out once, and let `step` decide what is lit** — visibility, emphasis, or both.

## Try it with your agent

Hand your coding agent something like this:

> Read `skills/build-a-slide/SKILL.md` for the slide contract, then read `slides/layout-big-statement/Slide.tsx`. Copy it to a new slide folder, replace the `CHUNKS` array with my sentence broken into 3–4 phrases (last one as the accent), keep the per-step emphasis-shift behaviour and the static safe-mode twin, update `meta.id`/`title`/`steps` and the `README.md` step table, register it in `deck/deck.ts`, and run `npm run typecheck && npm run lint && npm test && npm run build`.

If you're choosing between forms first, describe your content ("a before/after", "four equal points", "one big number") and ask the agent which of the six layout slides above is the closest starting point to copy.

## Related skills

- `build-a-slide` — the base contract every layout assumes: `meta`, `SlideProps`, the fixed canvas, `Reveal`, steps, safe mode, and registration. Read it first.
- `typography` — type-led treatment of the words inside these layouts: display headings, numerals, kinetic and variable-weight text.
- `content-to-deck` — going from raw material to a sequence of slides, including which layout form each beat should take.
