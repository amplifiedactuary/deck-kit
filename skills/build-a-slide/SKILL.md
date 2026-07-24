---
name: "deck-kit:build-a-slide"
description: Use when authoring a new slide for this kit — the base contract every slide follows: what a slide module must export, the fixed canvas, how steps and reveals work, when to declare safe mode, and how to register the slide so it presents.
---

# Build a Slide

> **Deck Kit** — build a presentation deck as code with your coding agent.

This is the foundation skill for the kit: it defines the **slide contract** — the exact shape every slide must take and how it joins the deck. Every more specific building skill (layouts, data, typography, diagrams, chat) assumes you already know what's here. Read this once and you'll know precisely what the kit gives you and what it expects back.

## When to use this

- You're about to create your first real slide and want the rules before you start.
- You're building any slide and need to remember the exact `meta` shape, prop names, or how to register it.
- You're briefing a coding agent to author a slide and want it to follow the kit's contract instead of improvising.

## The contract

A slide is one folder, `slides/<id>/`, whose `Slide.tsx` exports two things:

1. **`meta: SlideMeta`** — the slide's metadata.
2. **a default React component** — the slide itself, taking `SlideProps`.

That's the whole contract. Nothing else is required, and the kit's shell (in `components/` and `app/`) handles everything around it — scaling, navigation, overview, safe mode, fullscreen. You only author the folder.

### `meta: SlideMeta`

Defined in `lib/types.ts`:

```ts
export const meta: SlideMeta = {
  id: "my-slide",   // MUST equal the folder name (kebab-case)
  title: "My slide", // shown in the Overview gallery
  steps: 2,          // >= 1; a slide with no internal steps uses steps: 1
  themes: [],        // theme ids from deck/themes.ts; [] is fine
  hasSafeMode: false, // true only if you render a distinct static version
};
```

- **`id`** must match the folder name exactly. The registry test enforces this, so a mismatch fails the gate.
- **`steps`** is how many presenter clicks this slide owns. It must be at least 1 — a slide that just shows one static composition declares `steps: 1`.
- **`themes`** is an array of theme ids (from `deck/themes.ts`). An empty array is completely fine; only list a theme if your slide actually uses it.
- **`group`** (optional) is a kebab-case section label for the Overview gallery — slides sharing a group render under one heading. It has **no effect on presentation order**; that's owned by `deck/deck.ts`.
- **`hasSafeMode`** — see [Safe mode](#safe-mode) below.

### `SlideProps`

Your default component receives these props (also in `lib/types.ts`):

```ts
export interface SlideProps {
  step: number;        // current step within this slide, 0-based
  totalSteps: number;  // the steps count from your meta
  isActive: boolean;   // true when this slide is on screen
  direction: Direction; // 1 forward, -1 backward
  restartKey: number;  // increments on R; remounts the slide to replay
  safeMode: boolean;   // true when the presenter wants static fallbacks
}
```

The three you'll reach for most:

- **`step`** — the 0-based current step. Step 0 is the slide's initial state. Drive every reveal off `step` (`step >= 1`, `step >= 2`, …).
- **`safeMode`** — pass this straight into `Reveal`, and branch on it if you provide a static twin (see below).
- **`restartKey`** — changes when the presenter presses `R`. The shell uses it to remount your slide so animations replay from the top; you rarely read it directly, but it's why pressing `R` cleanly restarts a slide.

Simple slides can ignore `totalSteps`, `isActive`, and `direction` entirely.

## The canvas

Every slide renders onto a **fixed 1920×1080 canvas**. The shell scales that canvas to fit whatever screen or projector it's shown on, so your layout looks identical everywhere. **Design to those exact dimensions.** Position elements with absolute pixels against 1920×1080 (or fill the canvas with a flex/grid layout) — never assume the real viewport size, because the shell is doing the scaling for you.

## Steps and reveals

Internal steps are how a slide unfolds across presenter clicks. The kit ships a small helper, `Reveal` (`components/Reveal.tsx`), that fades and slides content in when its `show` prop becomes true:

```tsx
<Reveal show={step >= 1} safeMode={safeMode}>
  …content that appears on step 1…
</Reveal>
```

How it behaves:

- **Hidden content keeps its layout space.** A `Reveal` whose `show` is false is invisible but still occupies its place, so the slide never reflows or jumps when a step reveals. Lay the whole slide out once and let reveals fade in over it.
- **Step-0 content always shows.** Wrap your initial composition in `<Reveal show … >` (or `show={true}`) so it animates in on mount, and gate later content behind `step >= 1`, `step >= 2`, and so on.
- **In `safeMode` the transition is instant.** Always pass `safeMode={safeMode}` through; `Reveal` collapses its animation to zero duration when safe mode is on, so the same markup just appears with no motion.

The `_template` slide shows the minimal two-step pattern: a heading that's always shown, plus a second line gated on `step >= 1`.

```tsx
export default function Slide({ step, safeMode }: SlideProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <Reveal show safeMode={safeMode}>
        <h1 className="font-display text-7xl font-semibold">Template slide</h1>
      </Reveal>
      <Reveal show={step >= 1} safeMode={safeMode}>
        <p className="text-3xl text-dim">This second line appears on the next step.</p>
      </Reveal>
    </div>
  );
}
```

Because the heading uses a bare `show`, it animates in on every mount and replay; jumping straight to a later step plays all earlier reveals at once.

## Safe mode

`safeMode` is a presenter escape hatch: if animation ever misbehaves live, pressing `S` puts every slide into a static rendering. There are two ways a slide can honour it:

1. **Do nothing special.** Just pass `safeMode={safeMode}` into your `Reveal`s. They become instant, the slide appears fully composed, and that's enough for most slides. Leave `hasSafeMode: false`.

2. **Render a distinct static version.** If your slide has heavy animation that can't simply be "shown instantly" — an animated chart, a counting number, a moving element — branch on `safeMode` and render a separate static composition. The `data-agents-line` slide is the reference pattern: it draws an animated line chart normally, but renders a `StaticChart` twin (the final, settled chart with no motion) when `safeMode` is on. **Only then** set `hasSafeMode: true` — it tells the Overview and the presenter that this slide has a genuine static fallback.

The rule of thumb: `hasSafeMode: true` is a promise that toggling safe mode produces a meaningfully different, fully-static render. If `Reveal`'s instant transition already gives you that, leave it `false`.

## Register it

A slide doesn't appear in the deck until it's registered. The workflow:

1. **Copy the template folder** to your slide's folder:
   `slides/_template/` → `slides/<id>/`. Use a kebab-case `<id>`, and make sure the folder name equals your `meta.id`.
2. **Open `deck/deck.ts`** and add **one import line** plus **one array entry** at the position where you want the slide to present:

   ```ts
   import * as mySlide from "@/slides/my-slide/Slide";
   // …then, in the deck array, at the spot you want it shown:
   { meta: mySlide.meta, Component: mySlide.default },
   ```

The array order in `deck/deck.ts` *is* the presentation order — that's the one place ordering lives. Your slide folder is order-agnostic; the registry decides where it sits.

> Note: `deck/deck.ts` is shell territory in the sense that it's shared — you add your own import and entry, but don't reorder or touch other slides' entries.

## The doc files

Every slide folder carries two markdown files alongside `Slide.tsx`. **They are documentation only — never imported by app code**, so they can't break a build:

- **`README.md`** — what the slide shows, a step-by-step table, and data provenance (which files in `data/` it reads and where the numbers came from). Delete the data section if the slide has none.
- **`notes.md`** — rehearsal and intent notes: what you mean to say over this slide, and any design rationale for the next person (or agent) who edits it.

Keep both current as you build; they're how the slide stays understandable later.

## The test gate

`npm test` runs `deck/deck.test.ts`, a **registry-integrity test** that catches the common authoring mistakes before they reach a live deck:

- every `meta.id` matches a real `slides/` folder,
- ids are unique and kebab-case,
- every slide declares `steps >= 1`,
- any `group` is kebab-case,
- every `themes` entry is a known theme id,
- the template slide is never registered.

Always run the **full gate** before committing:

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

If any stage fails, fix it before committing — a broken slide or a registry slip should never land.

## Worked example: `_template`

Walk the actual template to see the contract end to end. Open `slides/_template/Slide.tsx`:

1. It marks itself a client component, then imports `Reveal` from `@/components/Reveal` and the `SlideMeta` / `SlideProps` types from `@/lib/types`.
2. It exports `meta` with `id: "template"`, `title: "Template slide"`, `steps: 2`, `themes: []`, `hasSafeMode: false` — the two-step, no-special-safe-mode shape.
3. Its default `Slide({ step, safeMode })` destructures only the props it needs. It lays out a centred column (`flex h-full w-full flex-col items-center justify-center`), so it fills the 1920×1080 canvas.
4. The heading is wrapped in `<Reveal show safeMode={safeMode}>` — always visible, animates on mount.
5. The second line is wrapped in `<Reveal show={step >= 1} safeMode={safeMode}>` — present in the layout from the start, but only revealed once the presenter clicks to step 1.

`slides/_template/README.md` documents exactly that (a step table: step 0 heading, step 1 second line), and `slides/_template/notes.md` is the empty rehearsal-notes stub. Copy this folder, rename it, change the `id` to match, and you have a working slide before you've written any new logic.

## Try it with your agent

Hand your coding agent something like this:

> Read `slides/_template/Slide.tsx`, `components/Reveal.tsx`, and `lib/types.ts` to learn this kit's slide contract. Copy `slides/_template/` to `slides/<my-id>/`, set `meta.id` to `<my-id>`, give it a title and three reveal steps (heading on step 0, two more lines gated on `step >= 1` and `step >= 2`), and update its `README.md` step table and `notes.md`. Then add one import and one array entry to `deck/deck.ts`, and run `npm run typecheck && npm run lint && npm test && npm run build` to confirm the gate passes.

## Related skills

- `getting-started` — the on-ramp: get the dev server running and learn the slide / registry / shell mental model. Start there if you haven't.
- `layouts` — composition forms for arranging a slide's content on the canvas.
- `data-and-metrics` — charts, counters, and data-driven slides (and the safe-mode static-twin pattern in depth).
- `typography` — type-led slides: display headings, numerals, kinetic and variable-weight text.
- `diagrams-and-devices` — diagrams and presentation devices (hub-and-spoke, ladders, formulae, reveal stacks, and similar).
- `chat` — chat-style slides that replay a conversation turn by turn.
