# notes — data-bar-race

## Design intent

- **Horse-race energy, dashboard restraint.** The bar race is the most "fun" chart
  form in the deck lab; the risk is it reads as gimmick. Counterweights: dark theme
  tokens only, one hue per tool (no rainbow gradients beyond a per-bar tint ramp),
  mono fonts for all numerals, a single calm header. Motion does the entertaining,
  not decoration.
- **Leader-relative scaling** keeps every phase visually full — at Hour 6 the frame
  is as alive as at Hour 61, and overtakes (Bash passing Read; the Grep/Other/Write
  midfield shuffle) read as *position* changes, not just length changes.
- **One continuous run** on step 1 rather than step-per-keyframe: the presenter
  presses once and narrates over ~8.5 s of motion. A stat barrage wants momentum;
  manual stepping would make it a chart review.
- **Spring everywhere** (layout swap, width growth, count ticker) so all three
  channels — position, length, numerals — move on the same physics and feel like one
  organism.
- Projector floor respected: bar labels 30 px, counts 28 px, total 52 px.
- Implementation is hooks-minimal per the ESLint regime: a single `setInterval`
  drives one `racePhase` integer; everything else (sort order, widths, totals) is
  pure derivation from `step` + `racePhase`. framer-motion `layout` handles re-rank.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Bar Race"), the template/skill
would parameterise:

- **Entities**: array of `{ id, label, color }` (2–10 rows; auto row-height from count).
- **Keyframes**: array of `{ label, counts }` — the engine validates monotonicity
  (optional flag for non-cumulative races) and that the last frame matches declared
  finals.
- **Timing**: per-keyframe hold ms, spring stiffness/damping presets
  ("calm / lively / frantic").
- **Scaling mode**: leader-relative (drama) vs fixed-final (honesty) — a real
  editorial choice worth surfacing as a switch.
- **Step policy**: continuous auto-run vs keyframe-per-step vs hybrid
  (auto-run with pause points).
- **Counter slot**: which aggregate ticks in the header (sum, leader value, custom
  formatter — currency, hours, calls).
- **Caption + provenance footer**: takeaway line, and a required "which numbers are
  real vs illustrative" footnote slot — provenance labelling should be a first-class
  template field, not an afterthought.
- **SafeMode poster**: auto-derived static final standings (the template gets this
  for free from the last keyframe).
