---
name: "deck-kit:content-to-deck"
description: Use when you have an outline — a talk, a doc, a set of points — and need to turn it into an ordered sequence of slides, choosing a form for each message and pacing the whole deck.
---

# Content to Deck

> **Deck Kit** — build a presentation deck as code with your coding agent.

Picking a single slide form is easy. Turning a whole outline into a *sequence* that flows — varied, well-paced, and ordered so each message lands — is the harder skill. This is the bridge between "I have things to say" and "I have a deck".

You start from content (an outline, a document, a list of points) and end with: a chosen form for each point, an order, a step budget, and a triage of which forms make the cut.

## When to use this

- You have an outline or document and want to lay it out as a deck.
- You have a pile of candidate slide forms and need to whittle them down to a coherent sequence.
- You're handing the kit to an agent and want it to map your raw content onto real slide ids in this deck.

If you only need to pick one form for one message, use `pick-a-form` instead. Come here when the unit of work is the whole sequence.

## Step 1 — break the outline into messages

Read your outline and split it into **messages** — one idea per message, the thing you want the audience to walk away believing after that slide. A message is not a heading or a topic; it's a claim, a number, a comparison, a story. If a bullet contains two ideas, it's two messages and probably two slides.

Aim for one clear message per slide. A slide that tries to make three points makes none.

## Step 2 — map each message to a form

For each message, name its *shape*, then pick the slide form that fits that shape. The forms below are all real slide ids in this kit (registered in `deck/deck.ts`), so an agent can scaffold straight from them.

| Your message is… | Form (slide id) | Alternate |
|---|---|---|
| A bold statement / single assertion | `layout-big-statement` | `type-numerals` |
| A trend over time | `data-agents-line` | `data-calendar-heat` |
| A comparison or before / after | `layout-split-before-after` | `device-flip-cards` |
| Structure — how things relate | `layout-hub-spoke` | `device-iceberg` |
| One big number | `data-counter-wall` | `type-numerals` |
| A ranking or table | `data-table-sort` | `data-bar-race` |
| A conversation | `chat-mobile-bubbles` | — |

These cover the common shapes; the deck has more forms (`layout-bento`, `layout-poster`, `device-ladder`, `device-formula`, `type-kinetic`, the palette slides, and others). When a message doesn't fit a row above, browse the full set in `deck/deck.ts` and lean on `pick-a-form` to choose.

A note on over-using numerals: `type-numerals` works for *both* a bold statement and one big number. That's fine occasionally, but if every other slide is giant type, the deck flattens — see the variety rule below.

## Step 3 — order the sequence

**Ordering is owned by the array in `deck/deck.ts`.** The order entries appear in that array is the order they present in; the slide folders themselves are order-agnostic. To re-sequence, move entries within that array — you never renumber folders.

The starter deck is already grouped into families in a sensible spine:

**Layouts → Data → Devices → Typography → Palettes → Chat.**

That family order is a fine default skeleton, but your *content's* logic should drive the final order, not the family grouping. Sequence by argument: set up, then evidence, then implication, then close. Pull the form you need from whichever family it lives in and place it where the argument wants it.

### Variety — don't let it read as a sampler

The fastest way to make a deck feel cheap is to repeat the same visual language. Three big-statement slides in a row blur together; five data charts back-to-back numb the room. Vary the form across adjacent slides even when the shape repeats — alternate a chart with a statement, a table with a diagram. The family spine helps here: drawing from different families naturally spreads the visual language out.

## Step 4 — budget the steps (pacing)

Each slide exports `meta.steps` — the number of presenter clicks it costs to reveal fully. A one-step slide appears whole; a six-step slide reveals across six clicks. **Total clicks across the deck is your pacing budget.**

- **Not every slide needs many steps.** A bold statement is often best at one step — it lands instantly. Save multi-step reveals for slides where the *sequence of reveal* is the point (building an argument, a list that accumulates, a chart drawing in).
- **Watch the running total.** If most slides are heavy multi-step reveals, the deck drags and the clicker never rests. Mix punchy single-step slides between the builders to give the room a beat.
- **Match steps to talking time.** Roughly, more steps = more time you'll spend on that slide. Budget steps where you have the most to say.

You don't edit another slide's step count to pace the deck — you choose *which* forms to include and *how many* multi-step slides to string together.

## Step 5 — triage which forms make the cut

`deck/curation.ts` keys every slide id to a `Curation` record with a `no` (a stable display number) and a `rating`. The ratings are buckets — `loved`, `maybe`, `inspiration`, `pass`, `unrated` (see `Rating` in `lib/types.ts`) — and they're how you mark which forms survive the cut without touching the stable ordering in `deck.ts` or any slide folder.

Use it as your triage ledger:

- Rate a form `loved` once it's earning its place in the sequence; `pass` once you've looked at it and rejected it (distinct from `unrated`, which means you haven't decided yet).
- The Overview gallery reads these ratings to float favourites up, so triage pays off immediately when you're scanning the deck.
- For a finished talk you can mark slides with `track: "talk"` so the curated set is separable from exploratory forms — but day to day, the `rating` bucket is the lever.

Curation churns; ordering is stable. Keeping the two in separate files (`curation.ts` vs `deck.ts`) is deliberate — re-rate freely without risking the sequence.

## Worked example

Outline for a quarterly business review, five points:

1. *"This was our strongest quarter on record."* — a bold opening assertion → **`layout-big-statement`** (1 step; let it land).
2. *Revenue grew steadily across all three months.* — a trend over time → **`data-agents-line`** (reveal the line across a few steps).
3. *Compared with last quarter, churn is down and retention is up.* — a before / after comparison → **`layout-split-before-after`**.
4. *We closed 1,200 new accounts.* — one big number → **`data-counter-wall`**.
5. *Here's how the regions ranked by growth.* — a ranking → **`data-table-sort`**.

In `deck/deck.ts`, the presenting order is simply these five entries in this sequence:

```
layout-big-statement → data-agents-line → layout-split-before-after → data-counter-wall → data-table-sort
```

Notice the variety: a statement, then a chart, then a split layout, then a counter, then a table — five different visual languages, so no two adjacent slides feel the same. Pacing-wise, the opener and the counter are single-step punches; the line chart and the table carry the multi-step reveals where there's more to narrate. As you settle the sequence, rate the keepers `loved` in `deck/curation.ts` and `pass` on any form you auditioned but dropped.

## Try it with your agent

Hand your coding agent something like this:

> Here is my outline: [paste 5–8 points]. Read `deck/deck.ts` for the available slide ids and `lib/types.ts` for the slide contract. For each point, name its shape and propose a slide id from this kit, then give me the presenting order as the sequence those entries should appear in the `deck` array. Vary the form across adjacent slides, keep most slides to one or two steps unless the reveal is the point, and tell me which existing forms I can `pass` on in `deck/curation.ts`.

## Related skills

- `pick-a-form` — choose the right form for a single message (the per-slide decision this skill repeats across a whole outline).
- `build-a-slide` — author and register a slide folder once you've chosen its form.
- `choose-a-look` — set the palette and typographic tone so the varied sequence still reads as one deck.
