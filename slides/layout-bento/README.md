> **EXAMPLE SLIDE — generic corporate sample content.**

# 07 · Bento board (style lab — layouts)

An asymmetric **bento grid**: 7 rounded tiles with varied spans on a 4×3 grid —
one 2×2 hero number tile, a 2×1 sparkline tile, a 2×1 tag-chip tile, and 1×1
kicker / quote / mini-bar / claims tiles. Tiles reveal in three clusters with soft
spring motion (no hover states — presentation, not web). The experiment tests
whether high information density can still read calmly at projector distance:
huge numbers, small-caps labels, generous padding, premium SaaS-dashboard energy.

Tile map (4 cols × 3 rows):

```
┌───────────────┬───────────────┐
│               │  sparkline 2×1│
│   HERO 2×2    ├───────┬───────┤
│   $20.4M rev  │ kicker│ quote │
├───────────────┼───────┼───────┤
│   chips 2×1   │ bars  │ claims│
└───────────────┴───────┴───────┘
```

## Steps

| Step | Cluster | What appears |
|------|---------|--------------|
| 0 | Framing | Hero tile ($20.4M revenue) + kicker tile (company framing line) |
| 1 | Telemetry | Sparkline tile (NPS monthly trend, animated path draw), business-vitals chip tile, product mix mini bar chart |
| 2 | Human notes | Quote tile + amber claims ratio tile (0.59) |

Final step with `safeMode=true` (the overview thumbnail) renders the **full
board statically** — all 7 tiles, no motion components mounted, sparkline path
fully drawn, bars at full width. `hasSafeMode: true` is genuine.

## Data provenance

fictional sample data (lib/sampleData.ts). All numbers in `data/metrics.json`
are drawn from `lib/sampleData.ts` (headlineKpis, productMix, npsOverTime, claimsRatio).
Northwind Insurance is a made-up company; no figures are derived from any real source.

| Tile | Figure | Source |
|------|--------|--------|
| Hero | $20.4M revenue · +23% growth · 84,200 policyholders | headlineKpis |
| Sparkline | NPS monthly trend (12 points) | npsOverTime shape |
| Mini bars | Motor 38% · Home 27% · Life 21% · Travel 14% | productMix |
| Chips | six headline KPIs | headlineKpis |
| Quote | fictional board comment | invented |
| Claims | 0.59 claims ratio (down from 0.71 in FY2022) | claimsRatio |

## Rules (do not delete)

- This folder is YOURS alone. Do not edit `deck/deck.ts`, the shell (`components/`,
  `lib/`, `app/`), or any other slide's folder.
- `Slide.tsx` MUST export `meta: SlideMeta` and a default component taking `SlideProps`.
- `meta.id` MUST equal this folder's name. Design on the fixed 1920×1080 canvas.
- `README.md` and `notes.md` are docs only — never imported by app code.
- `meta.hasSafeMode`: set true ONLY if your slide renders distinct static markup when the safeMode prop is on; leave false when Reveal's instant transitions are enough.
