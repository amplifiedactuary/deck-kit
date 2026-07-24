---
name: "deck-kit:diagrams-and-devices"
description: Use when you need a slide that explains how things RELATE or that progressively discloses an argument — a centre with radiating parts, visible-versus-hidden depth, an assumption that gets overturned, a comparison, a climb of values, a claim that deepens layer by layer, or an equation assembled term by term.
---

# Diagrams and Devices

> **Deck Kit** — build a presentation deck as code with your coding agent.

Some slides aren't a list of points or a chart of numbers — they're a *shape of reasoning*. A diagram shows how parts relate to a whole; a device is a visual metaphor that unfolds an argument across presenter clicks. Both work by the same technique: lay the whole figure out once on the canvas, then reveal its parts in sequence so the audience builds the picture with you instead of seeing it all at once.

This kit ships several example slides of this kind. Each is a self-contained `slides/<id>/` folder you can read, copy, and re-skin with your own content. This skill is the map of which form fits which relationship, and the shared reveal technique underneath them all. It builds directly on `build-a-slide` — read that first if you haven't, because every form here is just a slide that drives its parts off `step` and `Reveal`.

## When to use this

- Your content is fundamentally about a **relationship** — a centre and its parts, a surface and what's under it, two sides compared, a sequence that climbs.
- You want to **disclose an argument in stages** — a claim that deepens, an equation that assembles, assumptions that flip — rather than dropping a finished picture on the audience.
- You've already picked a form with `pick-a-form` and want to know which example slide to start from and how its steps work.

## The forms

Each entry names the relationship it visualises and how its steps disclose it. Open the folder to read the real implementation.

- **`layout-hub-spoke`** — a **centre with radiating nodes**. A "hub" sits at canvas centre; divisions ring it on an inner orbit, teams on an outer orbit, joined by deliberately dim spokes. Steps light the rings outward from the hub, so the structure grows from the middle instead of arriving as a hairball. Use it for org structures, a coordinator dispatching workers, or any one-to-many fan-out.

- **`device-iceberg`** — **visible versus hidden**. A small lit tip sits above a waterline; the real mass is strata stacked below it. Steps illuminate the submerged bands in pairs, then a depth gauge brackets the ratio of what's seen to what holds it up. Use it when the point is that the visible result rests on a large unseen foundation.

- **`device-flip-cards`** — **"what you assume" versus "what happened"**. A grid of cards each open on an assumption; on each step a card flips on a 3D `rotateY` to reveal what actually happened, the colour shifting to sell the reversal. Use it to overturn a series of expectations one at a time.

- **`device-scoreboard`** — a **two-sided comparison**, framed like a game. Two big tabular numerals — a target and an actual — count up to their finals as "quarters" advance, ending on the gap between them. Use it to make a head-to-head result (target vs delivered, before vs after) feel concrete and decisive.

- **`device-ladder`** — a **climbing sequence of values**. Stacked rungs ascend up-and-to-the-right; on each step the next rung rises from the floor, lights up, and posts its multiplier. Use it for a maturity progression, a roadmap, or any "each stage is bigger than the last" climb.

- **`device-reveal-stack`** — a **claim that deepens, layer by layer**. Panels stack in physical depth: surface claim → mechanism → evidence → caveat. Each step pushes a new card to the front while older cards recede (smaller, dimmer, drifting back), so the front card is always the current depth of the argument. Use it to take one statement progressively deeper, ending on the honest qualification.

- **`device-formula`** — an **equation assembled term by term**. A lone left-hand side appears first, then each term lands in turn with a one-line gloss, and finally real numbers substitute in and count to a result. Use it to show that a single headline figure is the product of a few understandable drivers.

## The shared technique

Every form above is one slide built on the same two primitives from `build-a-slide`: the 0-based `step` prop and the `Reveal` component. The recipe:

1. **Lay the whole figure out once.** Place every node, stratum, card, or term at its final position on the fixed **1920×1080** canvas. Diagrams are easiest with absolute pixel coordinates (an SVG `viewBox="0 0 1920 1080"` plus HTML overlays for text), so a part's place never shifts as it appears.
2. **Gate each part on a step.** Wrap each part — or compute its visibility — against `step`: the first part shows on step 0, later parts behind `step >= 1`, `step >= 2`, and so on. Drive a count (`Math.min(step + 1, parts.length)`) when parts accumulate, like the reveal-stack and iceberg do.
3. **Reveal, don't reflow.** Because a hidden `Reveal` still occupies its layout space, the figure holds its shape from the first frame; each click only fades or animates a part in. Nothing jumps.
4. **Honour safe mode.** Pass `safeMode={safeMode}` into every `Reveal`, and for heavy motion (a flip, a counting numeral, an animated build) branch on `safeMode` to render the fully-composed final state. Set `hasSafeMode: true` only when you provide that distinct static render — these device slides do.

Keep the parts in a single data array (`PANELS`, `STRATA`, `TERMS`, …) and map over it. One array drives both the count and the layout, so re-skinning the slide is editing data, not geometry.

## Worked example

Walk `slides/device-reveal-stack/Slide.tsx` — it's the clearest model of progressive disclosure, because each step adds exactly one layer of an argument.

- **The data.** A `PANELS` array holds five layers in order: `THE HEADLINE`, `THE MECHANISM`, `THE EVIDENCE`, `WHAT MADE IT HOLD`, and `THE HONEST CAVEAT`. Each panel carries a `kicker`, a `tone` (blue for supporting depth, amber for the closing caveat), a `title`, a one-line `body`, and an optional `stat` chip. The meaning lives entirely in this array; the rest of the file is geometry.
- **The step-to-count mapping.** A single line does the disclosure: `const visibleCount = safeMode ? PANELS.length : Math.min(step + 1, PANELS.length);`. Step 0 shows one panel; each click adds one; safe mode shows them all at once.
- **What each step adds.** The slide renders the visible panels back-to-front as a stack of cards. The newest panel sits at the front — full size, full colour, accent border — and every older panel recedes behind it (it shrinks by `SCALE_STEP`, drifts up-and-left by `OFFSET_X`/`OFFSET_Y`, and dims by `DIM_STEP`). So step 1 doesn't replace step 0's card; it pushes a deeper layer in front of it while the earlier claim slips back into context. By the last step the amber caveat is in front, with the whole supporting stack visible behind it.
- **The reading aids.** A vertical depth meter on the right lights one dot per visible panel, and a footer line names the frontmost layer (`LAYER 3 OF 5 — THE EVIDENCE`). Both key off `visibleCount`, so they stay in lockstep with the stack without any extra step logic.
- **Safe mode.** Because `visibleCount` collapses to `PANELS.length` and every `Reveal`/`motion` transition is gated on `safeMode`, toggling safe mode renders the entire settled stack with no motion — a valid static poster — which is why the slide declares `hasSafeMode: true`.

The pattern generalises: an ordered array, a `visibleCount` derived from `step`, a layout that maps over the visible slice, and reading aids that follow the same count. Swap the `PANELS` contents for your own argument and the disclosure mechanics come for free.

## Try it with your agent

Hand your coding agent something like this:

> Read `slides/device-reveal-stack/Slide.tsx` and `components/Reveal.tsx` to learn the progressive-disclosure pattern. Copy `slides/device-reveal-stack/` to `slides/<my-id>/`, set `meta.id` to `<my-id>`, and replace the `PANELS` array with my four layers: a headline claim, the mechanism behind it, the evidence, and the honest caveat (use the amber tone for the caveat). Keep the `visibleCount` / step logic and the safe-mode branch untouched. Update the slide's `README.md` step table and `notes.md`, register it with one import and one entry in `deck/deck.ts`, then run `npm run typecheck && npm run lint && npm test && npm run build`.

## Related skills

- `build-a-slide` — the base slide contract these forms are built on: `meta`, `SlideProps`, the 1920×1080 canvas, `step`, `Reveal`, and safe mode. Read it first.
- `layouts` — composition forms for arranging static content on the canvas, when your slide is about placement rather than a relationship or a staged argument.
- `content-to-deck` — turn a raw outline or notes into a sequence of slides, including choosing where a diagram or device earns its place in the flow.
