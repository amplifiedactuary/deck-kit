# Rehearsal / agent-brief notes — device-formula

> Placeholder experiment (style lab, group "devices"). Not talk content.

## Design intent

- **The device being tested:** a formula as narrative scaffold. Actuaries read
  equations natively — assembling one term by term lets each concept get its own
  beat (term lands → gloss explains → highlight moves on), and the audience's
  equation-literacy does the synthesis for free. The payoff beat is symbols →
  measured numbers: the moment abstraction becomes evidence.
- **Honesty is part of the design.** The formula is rhetorical, so the slide
  carries "Illustrative formula — not a fitted model" from step 1 onward. For this
  audience (senior actuaries), an unlabelled invented equation would cost
  credibility; labelled, it reads as a deliberate framing device.
- **Typography:** variables in italic serif (mathematical convention), operators
  upright and dimmed, numbers in mono with tabular figures so the count-up doesn't
  jitter. Equation starts oversized (1.5×) and settles as it grows — the slide
  literally makes room for the idea.
- **Motion:** framer `layout` animations recentre the equation as terms land;
  the substitution is a single rAF-driven 0→1 progress value with staggered easing
  windows (numerator first, result trailing) so the 4.9× lands last.
- **Pacing note for rehearsal:** steps 1–4 want roughly one spoken sentence each
  (the gloss line is the sentence). Step 5 is silent — let the count-up finish
  before speaking again (~2 s).

## Template-ised

What a reusable "formula build-up" template/skill would parameterise, if it
shipped in a ~50-template deck product for arbitrary talks:

- **Equation shape:** list of numerator terms (1–4), optional denominator,
  result symbol/label. Layouts beyond a single fraction: plain product, sum,
  ratio-of-sums. Auto-scale the start size from term count.
- **Per-term content:** name, gloss line, optional substituted value + unit
  label, optional colour override. Order of reveal = order of array.
- **Substitution beat:** on/off; per-slot real numbers; count-up duration and
  stagger windows; formatting (decimals, tabular-nums, unit suffixes like `h`,
  `$`, `%`, `×`).
- **Result emphasis:** final value size/colour, whether it counts up or snaps,
  optional suffix (`×`, `pp`, `σ`).
- **Honesty footnote:** required-by-default toggle with editable text
  ("Illustrative formula — not a fitted model") — templates that invite invented
  equations should make the disclaimer opt-out, not opt-in.
- **Legend/recap:** auto-generated from term names + glosses; optional source
  line (citation string straight from the data file).
- **Theming:** serif/sans choice for variables, accent colours, kicker text —
  inherited from the deck theme rather than hard-coded.
- **Safe mode / poster:** auto-derivable — the template can always render the
  completed equation + substitution + legend statically, so `hasSafeMode` comes
  free with the template.
- **Data contract:** one JSON file per slide instance (terms, values, source,
  note), keeping the "numbers live in data/, provenance recorded next to them"
  pattern.
