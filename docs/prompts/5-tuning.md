Tune how often rare birds appear in Mango's Garden. Keep all other behavior, design, and text unchanged.

1. SIMULATION
- Add a script (npm run simulate) that simulates 5,000 players for 365 days. Each picks a random one of the 4 offered foods each day, using the real visitor algorithm, daily food offer, freshness, and new-bird boost.
- Print: median and 90th-percentile days to collect all 12 birds, median days until the first rare bird, and the share of visits that are common, uncommon, and rare.

2. TUNING
- Raise the rare weight from 1 to 4 and the uncommon weight from 4 to 6. Keep common at 10.
- Add a pity boost: for each day without a rare visit, multiply the rare birds' score by 1 + 0.25 per day, capped at x3. Reset it when a rare bird visits. Save "days since last rare" in localStorage, and make "reset today" undo it too.
- Tune the numbers so the simulation shows a median of about 60 days to complete the book and a first rare bird within about 2 to 3 weeks. Report the final values.

3. TESTS AND DOCS
- Add tests for the pity boost (it grows daily, is capped, resets on a rare visit, and is undone by "reset today").
- Update the README configuration table with the new weights and pity boost values.

In your summary, show the simulation results before and after the change.