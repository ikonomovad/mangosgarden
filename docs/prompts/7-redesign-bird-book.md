Redesign the bird book cards in Mango's Garden. Visual and UI changes only. Do not change game logic, saved data, the algorithm, tests, or other screens.

1. LOCKED (UNCOLLECTED) CARDS
- Show the real bird illustration and the real name, but hidden behind a frosted-glass effect: heavy blur on both (about 8 to 10px), reduced opacity (about 50%), and slightly desaturated, so the bird and name are not recognizable.
- Add a light frosted cream overlay on the card. No "???" text and no dark silhouette.
- Locked cards are not tappable. For screen readers, label them "Undiscovered bird" and do not expose the real name.

2. COLLECTED CARDS
- Keep the current look: the colored bird and the name, clearly visible.
- Remove the fun fact, "Seen eating", "Favorite foods", "First seen" and "Visited" text from the card itself.
- Make the card tappable, with a subtle hover and tap effect.

3. DETAILS DIALOG
- Tapping a collected card opens a simple dialog (use the existing dialog component if there is one) with a large bird illustration, the name, and these rows:
  - Fun fact (always shown)
  - First seen (date)
  - Visited X times
  - "Seen eating:" the list of foods. Show this row only if at least one food has been recorded.
  - "Favorite foods:" the list. Show this row only once the bird has 3 or more visits (the existing hint rule). Never show "?" placeholders.
- Close with an X button, a tap outside, or the Escape key. Keep the cream card style, rounded corners, and warm brown text.

4. LIMITS
- Keep the sage background, floating controls, and streak pill as they are.
- Do not change any other screen, and do not refactor unrelated code.
- In your summary, list only the files you changed.