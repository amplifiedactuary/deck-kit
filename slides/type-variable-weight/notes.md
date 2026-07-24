# Rehearsal / agent-brief notes — type-variable-weight

(Never rendered in the app.)

## Design intent

Weight is one of typography's most under-used expressive axes. This template proves the
point: instead of bolding a word *statically*, the **emphasis moves** — a heavy weight
sweeps across the line and pauses on each meaning-bearing word in turn, the way a speaker
leans on a word for a beat before moving on. The effect is rhythmic and editorial, not a
gimmick: only the meaning-carrying words ever go black; connectives stay thin throughout.

Three reinforcing cues fire together so the emphasis reads even on a far-back projector
seat:

1. **Weight** — 200 (thin) → 800 (near-black) for the spotlit word.
2. **Brightness** — resting words sit in a dim tone; the spotlit word jumps to full ink.
3. **Tracking** — the heavy word tightens its letter-spacing slightly, which the eye
   reads as extra density / weight (optical-weight simulation, see below).

The opening (all thin) and the close (all settling to a calm medium) bookend the sweep so
the slide has a clear beginning, middle, and resolution rather than just flickering bold.

### Why `motion.span` + `animate={{ fontWeight }}` (not setState)

Framer-motion animates numeric `fontWeight` natively. Keying the `animate` target off
`step` means React re-renders with a new target and framer tweens to it — there is **no
`useEffect` + `setState` loop**, so `react-hooks/set-state-in-effect` can't fire. This is
simpler than the `animate()`-imperative pattern used by count-up slides and is the right
tool when the value to animate is a real CSS property.

### Optical-weight caveat (system fonts)

The system font stack only ships a handful of discrete weight faces (typically 400/700,
sometimes 300/500/600/900). Numeric weights like 200 or 800 **snap to the nearest
available face** rather than interpolating — so the "sweep" is really a cross-fade between
two faces plus the brightness/tracking shifts, not a continuous wght glide. It still reads
beautifully, but for a *truly* continuous breath-of-weight you need a variable font.

## Variable-font swap-in (unlocks continuous wght / opsz)

To get smooth, continuous weight interpolation (and optical-size correction at this huge
display size):

1. Add a variable font via `next/font/local` (e.g. an Inter or Fraunces variable file) in
   the **shell**, not this slide folder — agents own only their slide, so this is an
   shell-level change. Expose it as a CSS variable (e.g. `--font-display`).
2. Animate `fontVariationSettings` instead of (or alongside) `fontWeight`. Because
   `fontVariationSettings` is a *string*, drive it with `useMotionValue` + `useTransform`:

   ```tsx
   const wght = useMotionValue(W_REST);
   const fvs = useTransform(wght, (w) => `"wght" ${w}`);
   useEffect(() => { const c = animate(wght, target, { duration: 0.7 }); return () => c.stop(); }, [target]);
   // <motion.span style={{ fontVariationSettings: fvs }}>
   ```

   This keeps the no-`setState`-in-effect contract (the motion value updates the DOM
   directly; React never re-renders on each frame).
3. If the font exposes an `opsz` axis, push it up with weight so heavy words also gain the
   optical-size treatment (tighter spacing, adjusted contrast) automatically.

No font binary is added in this template — the brief forbids it and the system stack +
`globals.css` already animate numeric `font-weight`.

## Templatise

Reuse checklist when forking this into another statement:

- **Copy** in `Slide.tsx`: edit the `WORDS` array. Each entry is `{ text, emphasis }`.
  Set `emphasis` to the spotlight step (1-based) on which that word goes heavy; use `0`
  for connective words that should stay thin.
- **Step count**: `meta.steps` = (number of spotlight words) + 2 — one for the thin
  opening (step 0) and one for the settled close (final step). With 3 spotlit words that's
  `5`. Keep `WORDS` emphasis values in `1..(steps-2)`.
- **Weights / tone**: tune `W_REST`, `W_HEAVY`, `W_SETTLE` and the `INK` / `REST_TONE`
  constants. All colours come from `app/globals.css` tokens — stay on-palette.
- **Size**: `fontSize: 152` fills the 1920×1080 canvas for a ~6-word line; drop it for
  longer statements. Everything is absolute px — no viewport units.
- **SafeMode**: leave as-is; it resolves to the settled final state automatically via
  `effectiveStep`. If you change the settle behaviour, keep a distinct static render so
  `hasSafeMode: true` stays honest.
- **Sub-label**: the mono caption is decorative — change or remove freely.
