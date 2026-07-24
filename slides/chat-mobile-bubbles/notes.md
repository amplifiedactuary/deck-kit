# Design notes — chat-mobile-bubbles

## Design intent

- **The metaphor IS the argument.** Everyone in the room texts. Rendering a
  manager–analyst relationship as a message thread reframes collaboration from "reporting
  workflow" to "delegating to someone capable" — the delegation dynamic lands
  emotionally before any chart could.
- **Composition: full-canvas chat column (~920px), not a phone frame.** Chosen for
  projector legibility — 30px body text in 640px-max bubbles, every word readable from
  the back row. The **alternative considered**: a literal phone frame (rounded bezel,
  notch, ~520px wide, full height, centred). It sells the metaphor harder and would
  make a gorgeous overview thumbnail, but at 1080p it forces ~24px text and tighter
  wrapping — readability lost for chrome. If this graduates beyond a lab, a *subtle*
  bezel hint (rounded hairline border, no notch) around the current column is the
  compromise worth trying. The column already carries faint side hairlines as a nod.
- **Light-grey incoming bubbles on a dark canvas** is deliberately a hybrid (light-mode
  iMessage bubbles, dark-mode stage). The grey bubbles glow against the dark deck
  background and match the brief; pure dark-mode iMessage (#26262a incoming) recedes
  too much on a projector.
- **Authenticity details that do the selling:** bubble tails only on the *last* bubble
  of a same-sender run (real iMessage grouping), tighter intra-group spacing, typing
  indicator with staggered bouncing dots, bold-day timestamp dividers, green presence
  dot, "Delivered" receipt under the final sent message, iOS-blue chevron/video glyphs.
- **Choreography:** one or two arrivals per step. The analyst's messages wait ~1s behind
  typing dots, then spring-pop (stiffness 420, damping 26, origin at the tail corner).
  Paired beats (answer→approval, report→quip) land ~1s apart within one step so the
  presenter clicks once per conversational beat, not once per bubble. Backward nav and
  safe mode skip all theatrics.
- Layout is fully reserved (hidden messages keep their space) so nothing ever reflows —
  bubbles pop into place, the column never jumps.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Chat conversation" type),
the parameterisation would be:

- **`messages[]`** — sender, text, step, optional `divider`/`receipt` rows (exactly the
  current JSON schema). Step grouping stays data-driven: any number of beats, 1–3
  messages per beat.
- **Personas** — per-sender config: side (left/right), bubble fill (solid or gradient),
  text colour, display name, avatar (initial, glyph, or image), status line. Supports
  >2 senders (group-chat variant with sender labels above left bubbles).
- **Skin** — `imessage` (this), `whatsapp` (green/ticks/wallpaper), `slack` (flat,
  threaded), `terminal` (monospace, for dev audiences). Skin owns tails, radii,
  receipts vocabulary ("Delivered" vs "✓✓"), header chrome.
- **Frame variant** — `column` (this) vs `phone` (bezel, auto-scales type down) vs
  `bare` (bubbles only, for compositing onto another slide).
- **Timing knobs** — typing-indicator duration, inter-message gap within a step,
  spring preset (or `reduced-motion: pop→fade`). Sensible defaults; most users touch
  nothing.
- **Auto-layout guard** — the template should *measure* total thread height against the
  canvas and warn (or auto-shrink font within a 26–36px band) when the conversation
  overflows 1080px — the one thing hand-tuned here (copy lengths were budgeted to fit).
- **Safe-mode poster for free** — the static full-conversation render falls out of the
  same data; every instance gets a strong overview thumbnail without extra work.

The hard-won details a template captures so nobody re-derives them: tail-on-last-of-run
grouping, reserved layout (no reflow), the two-element tail mask trick needing the
canvas bg colour, and pacing double-beats inside one presenter click.
