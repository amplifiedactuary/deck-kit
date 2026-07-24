---
name: "deck-kit:choose-a-look"
description: Use when you're deciding the visual style of your deck — palette, typography, dark vs light, brand colours, projector-readability — and want to know the one place to change to reskin every slide at once.
---

# Choose a Look

> **Deck Kit** — build a presentation deck as code with your coding agent.

Before you build many slides, decide how the whole deck should *feel*. A consistent look — one palette, one type pairing, a clear contrast strategy — does more for an audience than any single clever slide. This kit centralises that decision: the colours and fonts every slide draws from live in one file, so reskinning the deck is one edit, not a tour through dozens of components.

## When to use this

- You're starting a deck and want to set its palette, typography, and light/dark mood up front.
- You need to apply a brand — a corporate navy, a product accent colour — across the whole deck.
- You're preparing for a real room and want to be sure the deck reads from the back of it.
- An agent is about to generate slides and you want it to inherit one coherent look rather than inventing a new one per slide.

## How to think about a look

A few decisions, made once, carry the whole deck:

- **Palette.** Pick a small set of roles, not a rainbow: a background, a panel/surface, an edge/hairline, a primary text colour, a dimmer secondary text colour, and one or two accents. Restraint reads as polish; more than two accent hues reads as noise.
- **Typography pairing.** One display face for headlines and one mono (or second) face for labels, kickers, and data. The kit ships with a display/mono pairing already wired (see below); a pairing chosen on purpose beats whatever a slide reaches for ad hoc.
- **Dark vs light.** Dark backgrounds suit dim conference rooms and look modern on a projector; light backgrounds suit printed handouts and brightly lit rooms. Decide which room you're actually presenting in, then commit.
- **Brand colours.** If there's a brand, map it onto the role tokens (accent = brand primary, background/panel = brand neutrals) rather than scattering brand hex values inside slides.

### Projector-readability — the test that decides everything

A look that's beautiful on your laptop can be unreadable on a projector. Bias every choice toward legibility:

- **High contrast.** Aim for a strong separation between text and background. Faint grey-on-grey vanishes on a washed-out projector.
- **Large type.** Slides render on a fixed 1920×1080 canvas, so size for the room: oversized headlines, generous data figures, never body-copy density.
- **Few colours, used consistently.** One accent that always means the same thing is easier to follow than many decorative ones.
- **Test from the back of the room.** The real check: stand as far from the screen as your furthest audience member and confirm you can still read the smallest text. If you can't, scale up or raise contrast.

## How to reskin — the real mechanism

The deck's colours and fonts are defined as CSS custom properties in `app/globals.css`, inside an `@theme` block. These are the single source of truth — change a value here and everything that references it updates at once.

```css
@theme {
  --color-bg: #07090d;     /* page / canvas background */
  --color-panel: #10141c;  /* raised surfaces, cards */
  --color-edge: #1d2533;   /* hairlines, borders, dividers */
  --color-ink: #e8edf5;    /* primary text */
  --color-dim: #8b95a7;    /* secondary / muted text */
  --color-accent: #7dd3fc; /* primary accent */
  --color-amber: #fbbf24;  /* secondary accent */
  --font-display: var(--font-sora), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), monospace;
}
```

The seven colour roles and their defaults: `--color-bg` (#07090d), `--color-panel` (#10141c), `--color-edge` (#1d2533), `--color-ink` (#e8edf5), `--color-dim` (#8b95a7), `--color-accent` (#7dd3fc), and `--color-amber` (#fbbf24). The two fonts are `--font-display` (Sora) and `--font-mono` (JetBrains).

Slides consume these two ways:

- **In CSS / inline styles:** reference the token with `var(...)`, e.g. `color: var(--color-ink)` or `background: var(--color-panel)`.
- **In Tailwind classes:** the two fonts are exposed as utility classes `font-display` and `font-mono`, so a headline uses `className="font-display"` and a label uses `className="font-mono"`.

Because a well-behaved slide only ever names these tokens (never raw hex), editing one value in `app/globals.css` reskins every slide that uses it. To go light, raise `--color-bg`/`--color-panel` to near-white and drop `--color-ink`/`--color-dim` to dark greys; to apply a brand, set `--color-accent` to the brand primary and tune the neutrals.

> A practical exception: a slide built deliberately as a *self-contained palette study* may hard-code its own colours so it stays fixed regardless of the deck theme — the worked example below is exactly that. For ordinary content slides, prefer the tokens so they follow the deck.

## Deck-wide key themes are a separate idea

Don't confuse the colour tokens above with the deck's **key themes**. The themes are the recurring *messages* of your talk, listed in `deck/themes.ts`:

```ts
export const THEMES: ThemeDef[] = [
  { id: "clarity",  label: "Clarity of intent",       color: "#7dd3fc" },
  { id: "evidence", label: "Evidence over assertion", color: "#fbbf24" },
  { id: "impact",   label: "Measurable impact",       color: "#6ee7b7" },
];
```

These power a key-themes sidebar that tracks which ideas have been raised so far. They are *not* the deck's colour scheme — each theme just carries a small swatch for its own marker. A slide opts a theme in through its `meta.themes` array (e.g. `themes: ["clarity"]`); a slide with `themes: []` simply doesn't light any of them up. So `app/globals.css` decides what the deck *looks like*; `deck/themes.ts` decides which *ideas* the sidebar tracks.

## Worked example

The kit ships the same corporate "year in numbers" content under two opposite looks so you can compare them directly:

- **`slides/palette-insurance-navy/`** — a corporate reskin: deep navy backgrounds, gold accents and hairline rules, an ivory headline, a faint heraldic watermark. The annual-report register.
- **`slides/palette-bw-contrast/`** — a high-contrast study: pure black and white with greys used only for hierarchy, no hue anywhere. Maximum projector legibility.

Both are self-contained palette studies (they fix their own colours rather than reading the deck tokens), which is exactly why they're useful side by side. To compare:

1. Start the dev server (`npm run dev`) and open `http://localhost:8800`.
2. Press `O` for the Overview and find both `palette-insurance-navy` and `palette-bw-contrast`.
3. Jump into each and step through with `→`. Same content, two distinct moods — notice how contrast and type weight change what reads first.

Use that comparison to decide where your own deck should sit, then encode the decision in `app/globals.css` so every other slide inherits it.

## Try it with your agent

Hand your coding agent something like this:

> Read `app/globals.css` and `deck/themes.ts`. I want to reskin this deck to a light look with a brand accent of `#1f6feb`. Update the `@theme` tokens in `app/globals.css` — raise `--color-bg` and `--color-panel` toward white, set `--color-ink`/`--color-dim` to readable dark greys, and set `--color-accent` to the brand colour. Then run `npm run dev` so I can check it reads well, and confirm the change is in one file only.

## Related skills

- `five-options` — generate several distinct look directions before committing to one.
- `typography` — go deeper on the type pairing, sizing, and hierarchy choices.
- `pick-a-form` — once the look is set, choose the right layout or visual form for each slide.
