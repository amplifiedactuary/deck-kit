> **PLACEHOLDER — experiment, not talk content.**

# 39 · Product-line GWP bar race

An example slide demonstrating Northwind Insurance product-line growth rendered as a
**racing bar chart**. Eight horizontal bars (Motor, Home, Life, Travel, Commercial,
Marine, Liability, Other) grow and **re-rank** — rows swap position with spring layout
animation — across six quarterly keyframes, while a quarter label ("Q2 2025 · current")
and a running GWP counter tick up. Bars are scaled relative to the current leader
(classic bar-race convention), so early quarters still fill the frame.
The point being tested: playful kinetic data for a stat-barrage moment.

## Steps

| Step | What happens |
|------|--------------|
| 0 | Opening standings at the first keyframe (Q1 2023 · launch) — Motor leads, Home second |
| 1 | The race runs automatically: one interval advances through all six keyframes (~1.7 s each); bars grow, rows swap, the total ticks up |
| 2 | Final standings (Q2 2025) + takeaway caption ("Motor led from the start…") |

Design choice: the race is **one continuous auto-run on step 1** (not one keyframe per
step) — the kinetic sweep *is* the experiment; advancing manually would kill the
horse-race feel. Re-entering step 1 (including backward navigation or replay via
`restartKey`) restarts the race from keyframe 0.

**SafeMode** renders a fully static final-standings poster (plain divs, no motion
components, caption shown) — this is also what the overview thumbnail shows.

## Data provenance

`data/race.json` — **fictional sample data** for Northwind Insurance. All product-line
GWP values ($K) across six quarters (Q1 2023 → Q2 2025) are invented for layout
demonstration — not sourced from any real insurer.
