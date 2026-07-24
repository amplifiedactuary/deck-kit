# 28 · Mobile bubbles

> **EXAMPLE SLIDE — generic corporate sample content.**

## What this slide shows

An example slide demonstrating a business conversation retold as an iMessage-style exchange at
presentation scale. The manager's messages arrive right-aligned in accent-blue bubbles
(white text); the analyst's arrive left-aligned in light-grey bubbles (dark text), each
preceded by the familiar three-dot typing indicator. A chat header ("Alex (Analyst) ·
available") and timestamp dividers ("Monday 09:14" → "Wednesday 16:45") set a two-day
working timeline. The question being tested: does the most universally familiar
conversation format on earth make a collaborative workflow feel *personal* —
a manager briefing a capable colleague — rather than technical?

## Steps

| Step | What appears |
|------|--------------|
| 0    | Header + "Monday 09:14" divider + manager's opening brief ("Can you pull together the Q4 revenue summary…") |
| 1    | Typing dots → Analyst: "On it. Pulling Motor, Home, Life, and Travel lines…" |
| 2    | Typing dots → Analyst: "Q4 revenue is $6.3M, up 23% on Q3. Motor is the driver — 38% of mix." |
| 3    | Manager's question: "What's behind the claims ratio drop?" |
| 4    | Typing dots → Analyst's grounded answer (Home segment, assumptions flagged), then Manager: "Looks good. Include the NPS trend too." |
| 5    | "Wednesday 16:45" divider → Analyst's closing update (12 pages, charts refreshed) → Manager: "Perfect. Sending to the board tonight." + Delivered receipt |

Forward navigation plays the arrival choreography (typing dots, spring pop, paced
double-messages); backward navigation and remounts render arrived messages instantly.
Safe mode (and overview thumbnails) renders a fully static poster — the whole
conversation visible at the final step, no dots, no springs.

## Data

`data/conversation.json` — fictional sample data (lib/sampleData.ts).

**Provenance: entirely fictional.** Northwind Insurance is a made-up company. All
figures (revenue, claims ratio, product mix) are consistent with the sample data in
`lib/sampleData.ts` but are not derived from any real source.

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
