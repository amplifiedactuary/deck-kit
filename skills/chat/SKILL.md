---
name: "deck-kit:chat"
description: Use when you want to render a conversation as a slide — iMessage-style bubbles revealed turn by turn. A striking, wow-factor form that is rarely the right call for a business audience; reach for it sparingly and honestly.
---

# Chat

> **Deck Kit** — build a presentation deck as code with your coding agent.

There is one way this kit renders a conversation: as **iMessage-style bubbles**. The sender's
messages sit right-aligned in accent-blue bubbles; the other party's sit left-aligned in light-grey
bubbles, each preceded by the familiar three-dot typing indicator. Timestamp dividers mark the
passage of time, and turns reveal one by one as the presenter clicks through `step`.

It is built end to end in the `chat-mobile-bubbles` slide — read that one folder and you have the
whole form.

## When to use this

Be honest with yourself first: **this is a wow-factor lure, not a workhorse.** A familiar phone
conversation at presentation scale is eye-catching — it is often the thing that makes people want to
try the kit — but it is *rarely* the right choice for a board or business deck. It draws attention to
the medium rather than the message, reads as informal, and burns several clicks on content a single
bullet could carry.

Use it sparingly, and only when the conversation **is** the point:

- A short, human exchange you genuinely want the audience to *feel* as a conversation (a handoff, a
  request and a grounded reply, a moment of collaboration).
- One memorable beat in an otherwise restrained deck — the single slide people remember.

If you are reaching for it to "make a data slide more fun," stop. A clear layout or a single number
will land better. Most decks should use this form **once, or not at all.**

## How turns map to steps

A conversation is a list of items — messages, timestamp dividers, delivery receipts — and each item
carries a `step` number: the presenter click on which it appears. Items sharing a `step` arrive
together on the same click; the typing-dots-then-pop choreography plays automatically for the other
party's bubbles.

So `meta.steps` is just the highest `step` in your conversation plus one (step 0 is the opening
state). Adding a turn means adding an item with the next `step`; tightening the deck means merging
items onto the same `step`. Keep the content **invented and generic** — a made-up exchange that
illustrates your point, never a real transcript.

This form declares `hasSafeMode: true`: it renders a distinct static version (the whole conversation
up to the current `step`, no motion, no dots) when safe mode is on. If you adapt it, keep that twin.

## Worked example

Open `slides/chat-mobile-bubbles/Slide.tsx` and `slides/chat-mobile-bubbles/data/conversation.json`.
The conversation data drives everything; the component reads each item's `step` and reveals it on the
matching click. It is a six-step exchange (`steps: 6`, so steps 0 through 5):

- **Step 0** — the header, the first timestamp divider, and the opening message are on screen.
- **Step 1** — typing dots appear, then the reply pops in.
- **Steps 2–4** — each click reveals the next turn; a step that holds two items (a reply plus a
  follow-up) plays them in sequence with a short pause.
- **Step 5** — a second timestamp divider, the closing message, and a "Delivered" receipt land
  together.

Trace one bubble through the code: its JSON item has a `step`, the slide compares that to the current
`step` to decide whether it is hidden, arriving (play typing dots, then spring it in), or already
shown. Forward clicks play the choreography; stepping back or jumping in shows arrived bubbles
instantly. To add a turn, append an item to the JSON with the next `step` and bump `meta.steps`.

## Try it with your agent

Hand your coding agent something like this:

> Read `slides/chat-mobile-bubbles/Slide.tsx`, its `data/conversation.json`, and the `build-a-slide`
> skill for the slide contract. Copy the folder to a new `slides/<my-id>/`, set `meta.id` to match,
> and replace the conversation with a short invented four-turn exchange of my own — two senders, one
> timestamp divider. Map each turn to its `step`, set `meta.steps` accordingly, keep
> `hasSafeMode: true`, update the README step table, register it in `deck/deck.ts`, and run the full
> gate. Push back if a chat slide is the wrong fit for what I'm presenting.

## Related skills

- `build-a-slide` — the base contract every slide follows (`meta`, steps, reveals, registering).
  Read it before adapting this form.
- `content-to-deck` — deciding what each beat of your deck should be; it will usually tell you a chat
  slide is *not* the right call, which is worth hearing.
