# type-variable-weight

> Reusable **variable-weight typography** template (component-library, group `typography`).

## What this slide shows

A single statement — *"Clarity is the new competitive advantage."* — set in very large
type, where **font-weight animates as a storytelling device**. The line opens uniformly
thin, then a heavy "spotlight" weight sweeps forward from word to word, emphasising one
meaning-bearing word at a time. On the final step the whole line settles together into a
confident medium weight. Spotlit words also brighten to full ink and tighten their letter
spacing, reinforcing the optical sense of weight.

The copy is generic placeholder text — swap it for any statement and remap which words
take the spotlight via the `emphasis` field in `WORDS`.

## Steps

| Step | What appears |
|------|--------------|
| 0    | Whole line uniformly **thin** (weight 200), dim — the calm opening |
| 1    | **"Clarity"** sweeps to heavy/black (800) and brightens; rest stay thin |
| 2    | Spotlight moves to **"new"**; "Clarity" relaxes back to thin |
| 3    | Spotlight moves to **"competitive"** |
| 4    | The **entire line settles** together into a medium weight (500), softly bright |

Connective words (`is`, `the`, `advantage.`) carry `emphasis: 0` and never take the
spotlight, so the sweep always lands on meaning.

## SafeMode

`hasSafeMode: true`. When `safeMode` is on, the slide renders a distinct **static**
state: the entire statement resolved to its **final settled emphasis** (medium weight,
no sweep, zero motion), regardless of the current step. This is a genuine alternate
render, not just an instant transition — it reads correctly on slow projectors or when
animation is unwanted.

## Data

No data files. The statement and weight stops are inline constants in `Slide.tsx`.

## Provenance

Built from `slides/_template/`. Weight animation uses `framer-motion`'s native numeric
animation of `fontWeight` (no `setState` loops, no font binary). See `notes.md` for the
design intent, how to templatise, and the variable-font swap-in.
