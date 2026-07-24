# AGENTS.md — rules for parallel slide agents

This deck is built so that multiple coding agents can each own ONE slide folder
without conflicts. If you are an agent assigned a slide, these rules are binding.

## Your sandbox

You own exactly one folder: `slides/<your-slide-id>/`. You may create/edit anything
inside it: `Slide.tsx`, `README.md`, `notes.md`, `data/*`.

## Hard rules

1. **Never edit `deck/deck.ts`** (it registers slides into the deck), the shell
   (`components/`, `lib/`, `app/`), `deck/themes.ts`, or any other slide's folder.
2. `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking
   `SlideProps` (both types in `lib/types.ts`). `meta.id` MUST equal your folder name
   (kebab-case).
3. Design on the fixed **1920×1080 canvas** in absolute pixels — the shell scales it.
   Never use viewport units.
4. Steps: reveal content per `step` (0-based, `meta.steps` total). Use
   `components/Reveal.tsx` for standard fade-ups. Respect `safeMode` if your slide
   animates heavily; set `meta.hasSafeMode: true` ONLY if you render distinct static
   markup when the `safeMode` prop is on (Reveal's instant transitions are enough for
   simple slides — leave it false there).
5. Want the key-themes sidebar? Wrap your content in
   `components/ThemesSidebarLayout.tsx` and declare your `meta.themes` (ids from
   `deck/themes.ts`).
6. All slide data is committed to your `data/` folder (small curated JSON/images).
   **No remote fetches at presentation runtime.**
7. `README.md` documents the slide (steps table, data provenance); `notes.md` holds
   rehearsal/agent-brief notes. Neither is ever rendered in the app.
8. Before handing off: `npm run typecheck && npm run lint && npm test && npm run build`
   must pass.

## How to start

Copy `slides/_template/` to `slides/<your-slide-id>/` and work from there.

## Visual style

Dark, cinematic, high-contrast, conference-grade, large typography, minimal clutter.
Premium data-product feel — not hacker/neon, not corporate-deck. Projector-readable
above all. Palette + fonts come from `app/globals.css` theme tokens
(`bg`, `panel`, `edge`, `ink`, `dim`, `accent`, `amber`; `font-display`, `font-mono`).
