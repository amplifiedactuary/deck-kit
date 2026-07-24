---
name: "deck-kit:five-options"
description: Use when you don't yet know what a slide should look like — generate ~5 divergent variants of one form in parallel, view them side by side, and pick or merge instead of arguing in the abstract. This is the kit's signature "ideation through code" workflow.
---

# Five Options

> **Deck Kit** — build a presentation deck as code with your coding agent.

The signature move of this kit: when you can't picture the right slide yet, **stop describing it and generate options instead.** Have your agent produce about five genuinely different takes on the same content, look at them together, and choose. This is *ideation through code* — and it's the whole reason "slides as code" is worth the trouble.

When slides are code, a variant is cheap. Copying a folder and reworking its layout costs your agent a minute, not an afternoon, so there's no reason to commit to the first idea. Five real options you can step through beat any amount of arguing over what *might* look good. You stop guessing and start choosing.

This skill is **teach-only**. It does not ship five variants for you, and it adds no slides to the deck. It teaches you the workflow and points you at a real, in-deck example so you can see the payoff before you run it yourself.

## When to use this

- You have content but no clear picture of the slide — you're stuck choosing a treatment.
- You keep going back and forth in words about layout, emphasis, or look, and it isn't converging.
- A slide matters enough to be worth seeing a few real alternatives rather than settling for the first draft.
- You're briefing a coding agent and want it to *explore* rather than commit to one guess.

## How to run it

The loop is: **diverge, view together, pick or merge, then delete the rest.**

1. **Brief your agent for divergence, not consensus.** Give it the content once, then ask for about five variants that deliberately differ — and name the axes so they don't all drift the same way. For example: one calm and minimal, one dense and data-forward, one with a single huge number, one built around a diagram, one that's type-led with no chart. The goal is *spread*, not five flavours of the same idea.

2. **One folder per variant.** Each variant is a normal slide: copy `slides/_template/` to its own `slides/<id>/`, build it, and register it in `deck/deck.ts`. Use ids that read as siblings, e.g. `intro-a`, `intro-b`, `intro-c`. The slide contract — what `Slide.tsx` must export and how to register it — is in the `build-a-slide` skill; follow it for every variant.

3. **Mark each variant's lineage.** In `deck/curation.ts`, set the `variantOf` field (on the `Curation` type in `lib/types.ts`) to the slide id of the form they all descend from. This records that `intro-a`, `intro-b`, … are takes on one parent, so later you (or your agent) can see at a glance which slides are alternatives competing for the same slot.

4. **View them together.** Run `npm run dev`, press `O` for Overview, and you'll see all five as cards. Click into each and step through with `→`. Seeing them on one screen, at full size, is the moment the abstract argument resolves itself — one option is usually obviously better than your first instinct.

5. **Pick or merge — then delete the rest.** Choose the winner, or tell your agent to merge the best bits of two into one. Then **remove the losing variants**: delete their `slides/<id>/` folders and their entries in `deck/deck.ts` and `deck/curation.ts`. Don't let dead options pile up; the value was in the comparison, and once you've chosen they're just clutter.

Run the full gate before committing the result — `npm run typecheck && npm run lint && npm test && npm run build` — so a half-deleted variant or a stale registry entry never lands.

## Worked example

The kit ships a real, frozen instance of "same content, two options" you can study right now: the two **palette** slides.

- `slides/palette-insurance-navy/Slide.tsx` — the four numbers as a formal, navy-and-gold annual-report poster, ornamented and serif-led.
- `slides/palette-bw-contrast/Slide.tsx` — the *same kind of* four-number summary rendered in pure black and white, with a hard-edged cell strip and no hue anywhere.

Open both: `npm run dev`, press `O`, and click into each. Same job — a few headline numbers and a closing line — two completely different answers to "what should this look like?" Neither is a tweak of the other; they're genuine alternatives. That's exactly the spread you're aiming for when you ask your agent for five, just shown here as two so the contrast is easy to read.

Note these two are kept side by side on purpose as a teaching pair, so neither is deleted. In your own use you'd keep the winner and remove the rest — but seeing both preserved here makes the "view together and compare" step concrete.

## Try it with your agent

Hand your coding agent something like this:

> I have a slide that needs to show three headline numbers and a one-line takeaway, but I don't know what it should look like. Read the `build-a-slide` skill for the slide contract, then create FIVE divergent variants — copy `slides/_template/` into `slides/numbers-a/` through `slides/numbers-e/`, and make them genuinely different: one minimal, one data-dense, one with a single dominant number, one diagram-led, one type-led. Register each in `deck/deck.ts`, and in `deck/curation.ts` set `variantOf` on all five to the same parent id so I can see they're siblings. Run `npm run typecheck && npm run lint && npm test`, then tell me to open Overview (`O`) and compare. After I pick one, delete the other four folders and their registry and curation entries.

Then look at all five in Overview, choose or ask for a merge, and have the losers deleted.

## Related skills

- `pick-a-form` — choose the kind of slide (layout or visual form) you're generating variants of in the first place.
- `choose-a-look` — settle the palette and typographic treatment across your variants, as the palette pair illustrates.
- `build-a-slide` — the slide contract every variant must follow: what `Slide.tsx` exports, how steps work, and how to register it.
