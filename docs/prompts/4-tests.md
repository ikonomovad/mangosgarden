Add developer documentation and automated tests to Mango's Garden. Do not change any app behavior, design, or text. This step is only documentation and tests.

DOCUMENTATION
Write a clear README.md in the project root, plus a docs/ folder if needed, for a developer who has never seen this project. Include:
- What the game is and the daily loop, in a few sentences.
- Project structure: what each folder and file does (components, data files, logic functions, storage code).
- How it works, step by step:
  - the daily food offer (4 of 10, date-seeded, at least 2 different from yesterday)
  - the visitor algorithm (score = rarity weight x food affinity x freshness x new-bird boost, seeded weighted random)
  - the once-a-day lock and the local-midnight day change
  - the streak rules (consecutive days, restarts at 1 after a missed day, best streak)
  - the bird book, visit counts, and food hints (revealed after 3 visits)
  - milestones and Mango's reaction lines
  - sounds (Web Audio API, off by default, mute toggle)
  - the hidden "reset today" testing button
- Everything saved in localStorage: every key, the exact data shape, and what each value is used for.
- A configuration reference listing every tunable value in one table (rarity weights, affinity values, freshness multipliers, new-bird boost, number of foods offered, milestone thresholds, hint threshold) with where it lives in the code and what changing it does.
- How to add a new bird, a new food, or a new Mango line (step-by-step, with a small example).
- How to run the app and the tests locally, and how to test date-based features (editing localStorage dates).
- Known limitations (for example device-clock based days and no cross-device sync).

TESTS
- Add Vitest (this is the one allowed extra dependency) and a "test" script in package.json.
- Write unit tests for the pure logic, not the UI:
  - Visitor algorithm: scores are computed correctly; a bird that came yesterday is less likely than before; the same date and food always give the same bird; uncollected birds get the boost; exactly one bird is returned; rarity weights make rare birds clearly less frequent over many seeded runs.
  - Daily food offer: always 4 distinct foods from the 10; the same date gives the same 4; at least 2 differ from yesterday's offer.
  - Streak logic: first visit gives 1; consecutive days add 1; a missed day restarts at 1; best streak updates; two visits on the same day do not double count.
  - Daily lock and reset: after feeding, the day is locked; a new local day unlocks; "reset today" undoes today's visit, collection count, and streak change.
  - Collection and milestones: first-seen date and visit counts update correctly; each milestone shows only once.
  - Storage handling: empty, missing, or corrupted localStorage data does not crash and falls back to safe defaults.
- Mock the date and localStorage in tests so they are deterministic. Do not use real timers or real randomness.
- Keep tests in a clear folder structure next to the code they cover, with descriptive test names.
- If a test reveals a real bug, do not silently change app behavior. List it in your summary and leave the failing test marked clearly, so I can decide how to fix it.