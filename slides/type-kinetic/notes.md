# Rehearsal / agent-brief notes — type-kinetic

## Design intent

Spec #69: kinetic typography as *motion composition*, not a fade. The point is
that the words feel **choreographed** — arriving with intent and overlap, settling
into a composed statement, with a hero word that lands last as the downbeat.

Choices that make it read as "musical" rather than "everything animates at once":

- **Varied entrance vectors per word.** Uniform motion (all-fade, all-up) looks
  mechanical. Mixing slide-up / drop / scale-in / blur-in / lateral slides gives
  the line internal rhythm — the eye tracks different motions resolving together.
- **Stagger with overlap.** `staggerChildren: 0.14` is short enough that words
  overlap in flight (a chord, not a queue) but long enough to read the order.
- **Eased settling, not springs-that-wobble.** `[0.22, 1, 0.36, 1]` (a strong
  ease-out) makes each word *arrive and stop* cleanly — confident, projector-safe.
- **Hero word lands last.** "certainty." gets a longer duration (1.05s), a softer
  curve, a `0.28s` head-start delay so it resolves after its neighbours, plus
  larger size / heavier weight / amber tone / glow. That deliberate late landing
  is the emotional beat of the slide.
- **Two phrases across two steps.** The statement completes as an argument: the
  negation lands first (step 0), the reframe lands second (step 1). The presenter
  controls the pause between them.

## Why distinct from type-one-word

`type-one-word` is hard single-word cuts — punchy, abrupt, one idea at a time.
`type-kinetic` is the opposite craft: multiple words in continuous, overlapping
motion that *compose* into a phrase. Same "big type" family, different verb.

## Templatise

This is a Tier-C reusable template. Everything author-facing lives in
`data/script.ts`:

- **Swap copy:** rewrite the `text` fields. Keep one phrase per step.
- **Re-choreograph:** change each word's `vector` (`up | drop | scale | blur |
  left | right`), `size` (`sm | md | lg | xl`), `weight`, and `tone`.
- **Move the hero:** set `hero: true` on the word that should land last; pair it
  with `tone: "amber"` and an `xl` size for the standard treatment.
- **Add a phrase / step:** push another `{ step, words }` entry and bump
  `meta.steps` in `Slide.tsx` to match.

`Slide.tsx` is pure rendering/choreography machinery — it should not need editing
to retheme the copy. The motion vocabulary (size/weight/tone/vector maps) lives
at the top of `Slide.tsx` if you need to extend the design tokens themselves.

## Rehearsal

- Land step 0, hold a beat (let "not automated." register as the setup).
- Advance to step 1; let "certainty." land before speaking over it.
- R replays the full choreography if you want to re-hit the moment.
- Safe mode shows the whole statement static — fine for handouts / low-power
  projectors, but the live talk should use motion: the choreography *is* the point.
