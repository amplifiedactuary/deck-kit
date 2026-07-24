# Deck Kit

Build a presentation deck as a website, with your coding agent — slides as code.

## Quick start

Paste this into your coding agent (Claude Code, Cursor, Copilot, or similar). It
handles the rest — cloning, running, and getting oriented:

```
You're my coding agent. Help me build a presentation as a website — slides as
code — using the Deck Kit.

1. Get it running: clone https://github.com/amplifiedactuary/deck-kit and cd
   into it. Run `npm install` then `npm run dev` (use `npx next dev -p 8801` if
   port 8800 is taken) and open the URL it prints. If Node isn't installed, or
   I'm not sure I'm allowed to install it, read skills/check-your-environment/SKILL.md
   first and walk me through my options before doing anything else.
2. Get oriented: read skills/getting-started/SKILL.md for the architecture (each
   slide is a React component on a fixed 1920x1080 canvas, registered in
   deck/deck.ts), then skills/pick-a-form/SKILL.md and skills/build-a-slide/SKILL.md.
3. Recommended - also install Superpowers; it complements this kit. It's a free,
   open library of skills for working well with a coding agent (planning,
   parallel work, review loops), with per-tool setup at
   https://github.com/obra/superpowers. Use it alongside the kit as we build.
4. When you add or change a slide, follow skills/build-a-slide/SKILL.md and run
   `npm run typecheck && npm run lint && npm test && npm run build` before committing.
5. Then ask me what the deck is about, and help me build it slide by slide.
```

---

## How it works

Slides are independent React components on a fixed 1920×1080 canvas. The shell
handles scaling, step navigation, overview, safe mode, and fullscreen. Each slide
is a self-contained folder; the registry in `deck/deck.ts` controls ordering.

## Prerequisites

**Node.js (LTS)** — install from [nodejs.org](https://nodejs.org) if you don't
have it. Without Node you can't run the dev server or build the deck.

Not sure whether you have Node, or whether you're allowed to install it (e.g. a
work laptop)? Start with [`check-your-environment`](skills/check-your-environment/SKILL.md)
— it checks your setup and picks the right build for you.

## Run

```bash
npm install
npm run dev     # dev server → http://localhost:8800
npm run build   # static export to out/
```

Gate (run before committing):

```bash
npm run typecheck && npm run lint && npm test
```

## Controls

| Key | Action |
|-----|--------|
| `→` / `Space` / `PageDown` | next step (then next slide) |
| `←` / `PageUp` | previous step (lands on previous slide's final step) |
| `R` | replay current slide's animation |
| `F` | fullscreen |
| `O` | overview (all slides as cards — click to jump) |
| `S` | safe mode (static fallbacks for heavy animation) |
| `Home` / `End` | first / last slide |
| `Esc` | close overview |

`PageUp` / `PageDown` are what physical presenter clickers emit. On-screen corner
buttons (`‹ ▦ ⛶ ›`) are the fallback if the clicker fails.

## Add a slide

1. Copy `slides/_template/` to `slides/<your-id>/` (kebab-case folder name).
2. Open `slides/<your-id>/Slide.tsx` and fill in `meta: SlideMeta` (id, title,
   steps, themes, hasSafeMode) + the default component that takes `SlideProps`.
3. Register it in `deck/deck.ts` — one import line + one entry in the array, at
   the position you want.
4. `npm test` — the registry-integrity tests catch id / steps / theme-id mistakes.

## Works well with Superpowers

This kit builds the *deck*. [**Superpowers**](https://github.com/obra/superpowers)
is *how you work* with a coding agent — a free, open (MIT) library of skills by
Jesse Vincent for getting clear before you build, running work in parallel, and
reviewing output you can trust. They complement each other: point your agent at
this kit's skills to build slides, and at Superpowers for the working method.

Superpowers installs per tool — Claude Code, Cursor, GitHub Copilot, Codex and
more — via the Quickstart in its README: https://github.com/obra/superpowers

We recommend installing it alongside this kit.

## The skills

Agent-readable playbooks in `skills/`. Point your agent at the one you need.

**Start here**
- [`deck-kit:check-your-environment`](skills/check-your-environment/SKILL.md) — what you can run, what you may install, which build to choose.
- [`deck-kit:getting-started`](skills/getting-started/SKILL.md) — install, run, and the architecture.

**Decide what to build**
- [`deck-kit:pick-a-form`](skills/pick-a-form/SKILL.md) — browse the forms as a vocabulary.
- [`deck-kit:five-options`](skills/five-options/SKILL.md) — generate variants, compare, choose.
- [`deck-kit:choose-a-look`](skills/choose-a-look/SKILL.md) — palettes, type, projector-readability.
- [`deck-kit:content-to-deck`](skills/content-to-deck/SKILL.md) — turn an outline into a sequence.

**Build a kind of slide**
- [`deck-kit:build-a-slide`](skills/build-a-slide/SKILL.md) — the base contract (start here).
- [`deck-kit:layouts`](skills/layouts/SKILL.md) — structural slides.
- [`deck-kit:data-and-metrics`](skills/data-and-metrics/SKILL.md) — charts and big numbers.
- [`deck-kit:typography`](skills/typography/SKILL.md) — type as a design tool.
- [`deck-kit:diagrams-and-devices`](skills/diagrams-and-devices/SKILL.md) — show how things relate.
- [`deck-kit:animated-explainers`](skills/animated-explainers/SKILL.md) — a timed, seekable canvas animation when the point is motion over time.
- [`deck-kit:chat`](skills/chat/SKILL.md) — render a conversation (wow-factor; use sparingly).
