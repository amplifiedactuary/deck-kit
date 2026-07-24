---
name: "deck-kit:pick-a-form"
description: Use when you have a point to make on a slide but haven't decided how to show it — browse the kit's example slides as a vocabulary of forms and pick the one whose message matches yours, before you build.
---

# Pick a Form

> **Deck Kit** — build a presentation deck as code with your coding agent.

The kit ships with **~27 example slides**, and they are not there to keep — they are a *vocabulary of forms*. Each one is a different way of carrying a message: a giant sentence, a single hero number, a racing bar chart, an iceberg, a chat transcript. Before you build a slide, browse this vocabulary like a menu and pick the form whose *message* matches the point you're trying to land. The form is the argument as much as the words are.

The common mistake is to start typing a slide and reach for whatever layout you used last time. Picking the form first — deliberately, against the point — is the fastest way to a deck that feels designed rather than defaulted.

## When to use this

- You know *what* you want to say on a slide but not *how* to show it.
- You're staring at the example deck wondering which slides to keep and which to replace.
- You want a quick map of what's possible before committing to one design.
- You're briefing an agent to build a slide and want to name the form precisely ("make it like `type-numerals`") instead of describing it from scratch.

## The families

The registry in `deck/deck.ts` groups the example slides into families with comment headers. Each family answers a different kind of question. Browse them in this order — it roughly runs from "broad framing" to "specific device."

**Layouts** — *How do I structure a single idea on the canvas?*
Reach for these when the content is words and structure, not data: a headline, a before/after, a grid of related points. Representative ids: `layout-big-statement`, `layout-split-before-after`, `layout-bento`, `layout-mosaic-2x2`, `layout-full-bleed`, `layout-poster`.

**Data & metrics** — *How do I make numbers land?*
Reach for these when the point *is* a number or a trend, and you want it felt, not just read: a line that climbs, bars that re-rank, a wall of counters, a heat-mapped calendar. Representative ids: `data-agents-line`, `data-bar-race`, `data-counter-wall`, `data-gauges`, `data-table-sort`, `data-calendar-heat`, `data-dot-grid`.

**Diagrams & devices** — *How do I show a relationship or a mechanism?*
Reach for these when the idea is structural — a hierarchy, a hidden depth, a sequence, a formula — and a metaphor or diagram explains it faster than prose. Representative ids: `layout-hub-spoke`, `device-iceberg`, `device-flip-cards`, `device-scoreboard`, `device-ladder`, `device-reveal-stack`, `device-formula`.

**Typography** — *What if the type itself is the visual?*
Reach for these when restraint is the point: one number, one phrase, one word, set monumentally with no chart or panel competing for attention. Representative ids: `type-numerals`, `type-kinetic`, `type-serif-display`, `type-variable-weight`.

**Palettes** — *What should the whole thing feel like?*
These share identical content so you can compare colour and tone like-for-like. Reach for them not to copy the content but to decide the mood — corporate and conservative, or stark high-contrast. Representative ids: `palette-insurance-navy`, `palette-bw-contrast`.

**Chat** — *How do I retell a conversation?*
Reach for this when the content is a dialogue or an exchange, and the familiar shape of a messaging app does the explaining for you. Representative id: `chat-mobile-bubbles`.

## How to preview the forms

The deck *is* the menu. With the dev server running (`npm run dev`, then open `http://localhost:8800`):

1. Press **`O`** to open the **Overview** gallery — every example slide as a card, grouped in registry order so the families read top to bottom.
2. Scan for two or three candidates whose form fits your point. Click a card to jump straight to that slide.
3. Step through it with **`→`** to watch how it reveals — the choreography is part of the form, so judge it animated, not frozen on step 0.
4. Press **`O`** again to return to the gallery and compare your next candidate.

When one form clearly carries your point better than the others, that's your pick. Copy its approach into a new slide (see `build-a-slide`) — don't edit the example in place.

## Worked example

Suppose your point is: **most of the work is invisible to the people it serves.**

Two forms in the kit could carry that, and the choice changes the feeling:

- **`type-numerals`** sets a single hero figure — say *85%* — at 440px, counting up from zero and landing as a monument with one quiet caption. Pick this when the number *is* the argument and you want a sharp, quantified jolt. It's fast, stark, and unarguable. The risk: a bare statistic can feel cold and slide past without a mental picture to hang on.
- **`device-iceberg`** shows the same ratio as a scene — a small visible tip above the waterline, a vast labelled mass below it. Pick this when you want the audience to *feel* the disproportion and remember it as an image, not a digit. It trades the precision of a single number for a metaphor that sticks. The risk: a familiar metaphor needs real craft to avoid feeling like clip-art, and it takes longer to read.

Same point, two messages: `type-numerals` says *"here is the fact, undeniable."* `device-iceberg` says *"here is what the fact means."* If your slot is a stat-barrage beat, take the numeral. If it's the moment you want to reframe how the audience sees the whole thing, take the iceberg.

That contrast is the whole skill: don't ask "which slide looks nice?" — ask "which form *argues* my point?"

## Try it with your agent

Hand your coding agent something like this:

> I want a slide that makes this point: "[your point here]". Open the Overview in the example deck and look at the families in `deck/deck.ts`. Suggest two example forms that could carry this point in different ways, explain the trade-off between them in one line each, and recommend one. Then we'll build it from that form with `build-a-slide`.

## Related skills

- `five-options` — when no single form is obviously right, generate several candidate slides side by side and choose by seeing them, not by arguing.
- `content-to-deck` — turn a body of raw content into a sequence of slides; pair it with this skill to choose a form for each beat.
- `build-a-slide` — once you've picked a form, the full workflow for authoring and registering the new slide folder.
- `layouts`, `data-and-metrics`, `typography`, `diagrams-and-devices`, `chat` — the build-a-kind-of-slide skills, one per family, for the craft details of the form you chose.
