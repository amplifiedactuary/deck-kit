> **PLACEHOLDER — experiment, not talk content.**

# 42 · Calendar heatmap — the ignition sweep

An example slide demonstrating three days of Northwind Insurance customer contacts rendered
as a cinematic GitHub-contribution-style calendar. Columns are the 24 hours of the
day, rows are the three contact days (Mon 14 Apr → Wed 16 Apr), cells are generous
66×100 px blocks on a 5-stop heat ramp from near-background to hot amber. On reveal,
cells ignite in a chronological sweep — each flashes warm white-amber for a beat
before settling into its heat colour — so the audience literally watches the week's
rhythm. Overnight cells with activity glow; the pre-dawn quiet window stays dark.

The question the experiment asks: can the *rhythm* of customer contact volume be made
instantly readable from the stage — daytime peaks, overnight stretches, and a quiet
window — without a single number being read aloud?

## Steps

| Step | What appears |
|------|--------------|
| 0 | Title, hour axis (00–21), day labels, empty slot grid. Out-of-window hours render as fainter voids. |
| 1 | Ignition sweep: cells light chronologically, day by day (~5 s total), with a warm flash before settling into the heat colour. Overnight-active cells settle with an amber glow. |
| 2 | Three pinned callouts with rings + leader lines (Tue 02:00 overnight contacts · Tue 03–07 quiet window · Tue 11:00 peak hour), the events/hour legend (top-right), and the glow-key hint. |

**SafeMode:** distinct static markup — fully ignited grid, callouts, rings, and
legend all rendered with no animation. Reads as a standalone poster (this is what
the overview thumbnail shows).

## Data provenance

`data/calendar.json` — **fictional sample data** for Northwind Insurance. The hourly
contact counts (Mon–Wed peak week) are invented to show realistic business-hours
patterns: daytime peak around midday, overnight tail, pre-dawn quiet window. All
values are illustrative only — no real insurer data was used.
