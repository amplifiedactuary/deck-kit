# Design notes — type-serif-display

## Design intent

A reusable **serif display** template. The brief: make web-safe serifs feel like the
masthead of a literary quarterly — authoritative, calm, expensive — and step through
2–3 treatments so it reads as a *trials sheet*, not a single statement.

Decisions:
- **Optical-sizing feel without variable fonts.** Display scale (150px headline,
  228px drop-cap) gets tight tracking (`-0.02em`); the smaller italic and small-caps
  cuts get *looser* tracking. That contrast mimics how a true optical-size family
  tightens at display and opens at text.
- **Three cuts, one voice.** Roman headline (step 0) → light italic pull-line
  (step 1) → small-caps colophon (step 2). Each step adds a *treatment*, so the slide
  documents the family the way a type specimen would.
- **Drop-cap** is the one chromatic accent (amber token) — the rest stays ink/dim so
  the type, not colour, carries the slide.
- **Editorial rules** (two faint hairlines at top/bottom) frame the measure and give
  the "printed page" cue without clutter.
- **Generous measure**: `max-width` caps the headline (~1380px) and body (~1240px) so
  lines break where an editor would break them, not at the canvas edge.
- Ligatures / kerning / contextual alternates enabled via `font-feature-settings`,
  with `text-rendering: optimizeLegibility` — small touches that read at projector size.

### safeMode

`hasSafeMode: false`. There's no heavy motion — just Reveal fade-ups, which Reveal
renders instantly under `safeMode`. No distinct static markup is warranted.

## Templatise

To reuse as a real serif-display component:

1. **Swap copy** — the eyebrow, headline, pull-line and colophon are all inline
   statement strings. Replace them; the layout is measure-capped and will reflow.
2. **Retune the scale ladder** — the three font sizes (150 / 52 / 40px) plus the
   drop-cap (228px) are the only display knobs. Keep the *ratios* and the slide
   re-skins to any serif.
3. **Drop in a self-hosted display serif (no runtime fetch).** This template uses a
   generic serif stack only — **no font files are shipped**. To use a real display
   serif (e.g. *Fraunces*, *Newsreader*, *PP Editorial*), self-host it with
   `next/font/local` so it's bundled at build time with **zero runtime fetch**:

   ```ts
   // app/fonts.ts (shell-owned — the shell adds this, NOT a slide agent)
   import localFont from "next/font/local";

   export const displaySerif = localFont({
     src: [
       { path: "./_fonts/Fraunces-Variable.woff2", style: "normal" },
       { path: "./_fonts/Fraunces-Italic-Variable.woff2", style: "italic" },
     ],
     variable: "--font-serif",
     display: "swap",
   });
   ```

   Expose `--font-serif` on `<html>` (via the font's `.variable` class), then in this
   slide replace the `SERIF` constant with `"var(--font-serif), Georgia, serif"`. The
   generic stack stays as the fallback. With a true variable display serif you also get
   real **optical sizing** (`font-optical-sizing: auto` or an `opsz` axis) and graded
   weights, which the web-safe version only approximates.

   > Adding the `.woff2` files and editing `app/` is shell-level work — a slide
   > agent must not add binary font assets or touch `app/`. This note documents the
   > intended swap-in, nothing more.
