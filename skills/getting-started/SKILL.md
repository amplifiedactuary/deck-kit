---
name: "deck-kit:getting-started"
description: Use when someone new to this kit wants to get the deck running and understand how slides work — sets up the dev server and teaches the slide / registry / shell mental model.
---

# Getting Started

> **Deck Kit** — build a presentation deck as code with your coding agent.

This kit lets you build a presentation deck as a website — "slides as code" — alongside a coding agent. Each slide is an independent React component; the kit's shell handles all the presenting (scaling, navigation, overview, fullscreen). It is aimed at a semi-technical person who is comfortable running a few terminal commands and editing files with an agent's help, but does not want to wire up a slide framework from scratch.

## When to use this

- You just cloned the kit and want to see it running.
- You want the mental model — how a slide, the registry, and the shell fit together — before you build anything.
- You're handing this kit to a coding agent and need to brief it on how the project is structured.

## Prerequisite: Node.js

You need **Node.js (LTS)**. Install it from [nodejs.org](https://nodejs.org) if you don't already have it. Everything below — the dev server, the test gate, the build — runs through Node and `npm`.

Not sure whether you have Node, or whether you're allowed to install it — especially on a work machine? Start with `check-your-environment` first. It helps you find out and picks the right build for you, including a lighter, no-install path (a plain HTML deck your agent builds — not this kit, but the same way of working) if the full kit is blocked.

## On-ramp: get it running

```bash
git clone https://github.com/amplifiedactuary/deck-kit
cd deck-kit
npm install
npm run dev
```

The dev server opens at **`http://localhost:8800`**. If that port is already in use, run it on another:

```bash
npx next dev -p 8801
```

You're now looking at the example deck. Use the keyboard to move through it (see the controls below).

## The mental model

Three pieces, with clean responsibilities:

1. **A slide is a self-contained folder** — `slides/<id>/` — that exports a `meta` object and a default React component. The component receives the current `step` and a `safeMode` flag (and a few other props) and renders itself. The starting point is `slides/_template/Slide.tsx`: it exports `meta: SlideMeta` (`id`, `title`, `steps`, `themes`, `hasSafeMode`) and a default `Slide({ step, safeMode })` component. Copy that folder to start a new slide.

2. **The registry owns ordering** — `deck/deck.ts`. It imports every slide module and lists them in an array. The order in that array is the order they present in. A slide doesn't exist in the deck until it's registered here; its own folder controls *what it looks like*, the registry controls *where it sits*.

3. **The shell handles presenting** — you don't write any of this. The shell renders every slide onto a fixed **1920×1080** canvas and scales that canvas to fit the viewport, so your layout is the same on any screen or projector. It manages step navigation within and across slides, the Overview gallery, safe mode, and fullscreen.

The slide contract (the props your component gets, and the `meta` it must export) is defined in `lib/types.ts` — read it once and you'll know exactly what every slide can rely on.

## Controls

The shell listens for these keys. `PageUp` / `PageDown` matter because that's what a physical presenter clicker emits.

| Key | Action |
|-----|--------|
| `→` / `Space` / `PageDown` | Next step (advances to the next slide after the last step) |
| `←` / `PageUp` | Previous step |
| `R` | Replay the current slide's animation |
| `F` | Fullscreen |
| `O` | Overview — all slides as cards; click one to jump to it |
| `S` | Safe mode — static fallbacks instead of heavy animation |
| `Home` / `End` | First / last slide |
| `Esc` | Close overview |

## Where your content goes

- **Your slides:** create your own `slides/<id>/` folders (one folder per slide) and register each in `deck/deck.ts`. Don't edit the shell in `components/` or the canvas — slides are the only thing you author.
- **Shared sample data:** `lib/sampleData.ts` holds neutral, reusable sample values you can import across slides. Add your own shared data there rather than scattering copies.

## The gate

Before you commit, run the full gate so a broken slide or a registry mistake never lands:

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

`npm test` runs vitest, which includes a **registry-integrity test** (`deck/deck.test.ts`). It catches the common mistakes — a folder id that doesn't match its `meta.id`, a bad step count, an unknown theme id — so the deck can't silently break.

## Worked example: explore the deck

With the dev server running at `http://localhost:8800`:

1. Press **`O`** to open the Overview. You'll see every example slide as a card.
2. Click into **two or three** slides to jump straight to them.
3. Advance through a slide with **`→`** and watch each step reveal in turn.
4. Toggle **`S`** to see safe mode — slides that declare `hasSafeMode: true` swap their animation for a static version. This is your fallback if animation ever misbehaves live.

That round trip — Overview, jump, step through, safe mode — is the whole presenting surface. Once it feels familiar, you're ready to build a slide of your own.

## Try it with your agent

Hand your coding agent something like this:

> Read `slides/_template/Slide.tsx` and `lib/types.ts` to learn this kit's slide contract. Then create a new slide in `slides/<id>/` with a title and two reveal steps, register it in `deck/deck.ts`, and run `npm run typecheck && npm run lint && npm test` to confirm it passes.

## Related skills

- `build-a-slide` — the next step: the full workflow for authoring a new slide folder, wiring its steps, and registering it.
- `pick-a-form` — choose the right slide layout or visual form for your content before you build it.
