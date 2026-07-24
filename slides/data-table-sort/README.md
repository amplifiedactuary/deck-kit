> **PLACEHOLDER — experiment, not talk content.**

# 48 · Living table (`data-table-sort`)

An example slide demonstrating a **table as the hero device**. Tables are the native
language of actuarial decks — this one is beautifully typeset, alive but disciplined.
Five region rows re-sort themselves per step with smooth framer-motion `layout` row
glides, each re-sort answering a different question. The point being tested: a
self-sorting table may be the most *credible* animated data device in a room of
senior actuaries — familiar form, unfamiliar life.

## Steps

| Step | Sort | What happens |
|------|------|--------------|
| 0 | Alphabetical | Table lands, neutral. Caption: "the regions" — no story yet. Bars show % GWP. |
| 1 | % GWP ↓ | "% GWP" header highlights, rows glide into place. Caption answers *where does the premium go?* (East is the largest named region at 31%; "Other / international" is the emerging book). |
| 2 | NPS score ↓ | Header highlight moves, rows re-glide, inline bars re-scale to NPS. Caption answers *where are customers happiest?* (West punches above its GWP weight). |
| 3 | % of work ↓ (spotlight) | Table re-sorts back to GWP share and dims all rows except East, which promotes in amber. Takeaway: "East drives volume, but the growth opportunity sits where satisfaction already leads." |

Safe mode renders the final step (spotlight state) as a static poster — this is also
what the overview thumbnail shows.

## Data provenance (`data/lanes.json`)

**Fictional sample data** for Northwind Insurance FY 2025 regional performance.
Regional GWP share (%) and NPS scores are invented for layout demonstration only.
No real insurer data was used.
