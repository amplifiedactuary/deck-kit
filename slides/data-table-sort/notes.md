# notes — data-table-sort (living table)

## Design intent

- **Credibility through familiarity.** Senior actuaries read tables all day; a table
  that moves *purposefully* (one re-sort per step, each answering a stated question)
  reads as discipline, not decoration. Contrast with charts that can feel like
  "presentation tricks".
- **One motion grammar:** rows glide via framer-motion `layout` (spring 240/30);
  everything else (header highlight, bar re-scale, caption swap) is a quiet secondary
  cue pointing at *why* the rows moved. The sort indicator (▾ + accent colour) always
  names the active column — the table never moves without explaining itself.
- **The bar column is a sparkline-grade redundancy**: it re-scales to whichever
  metric the current sort uses, so the eye can verify the new order instantly without
  reading numbers.
- **Step 3 is the editorial move**: sort returns to % of work, everything dims to
  0.32 opacity except ETL, which promotes in amber (the deck's takeaway colour).
  Amber is reserved for exactly this one moment.
- Honesty note: "Other" (32%) genuinely tops the % sort; the caption handles it
  ("largest *named* lane") rather than fudging the order.
- Projector: rows 88px, cell type 31px, mono numerals right-aligned; well above the
  30px floor.

## Template-ised

If this shipped as one of ~50 reusable deck templates ("Self-sorting table"), it
would parameterise:

- **Rows**: array of records (id, label, plus N numeric fields), 3–8 rows enforced
  (beyond ~8 the glide reads as shuffle noise).
- **Columns**: which fields to show, per-column format (%, count, $, ratio),
  alignment, and which field the inline bar mirrors (fixed or "follow active sort").
- **Step script**: ordered list of `{ sortBy, direction, caption: {eyebrow, text} }`
  — the core authoring surface. Optional `spotlight: rowId` per step for the
  dim-and-promote move, and a `finale` flag choosing which step the safe-mode poster
  freezes.
- **Theming hooks**: accent/highlight colour pair, row card vs ruled-line table
  style, column-header casing.
- **Guard rails baked in**: max one sort change per step; spotlight only allowed on
  the final step(s); auto-generated sort indicator; safe-mode poster derived
  automatically from the finale step (no second markup to author).
- **Data contract**: single small JSON (records + step script) so a skill/agent can
  generate the whole slide from a table of numbers plus one question per step.
