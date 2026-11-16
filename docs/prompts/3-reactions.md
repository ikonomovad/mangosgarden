Add personality to Mango's Garden. Keep all existing behavior working, including the hidden "reset today" button.

MANGO REACTIONS
- Write short, wholesome, slightly silly lines for Mango in these situations, with 3 variants each: a rare bird arrives, a brand-new bird arrives, a repeat visitor arrives, and a bird that came yesterday arrives again.
- Use the right group of lines for each visit, and avoid showing the same variant twice in a row.
- Add a small milestone line, shown once, for: first bird ever, streak of 3, 7, 14, and 30 days, 6 birds collected, and all 12 collected. Save which milestones were already shown so they never repeat.
- Add a simple idle animation to Mango on the garden screen (a gentle bob and an occasional blink), using plain CSS.
- Keep all Mango lines in the existing separate data file.

FOOD HINTS
- For each bird, save which foods have attracted it.
- On a bird's card in the bird book, show "Seen eating:" with those foods.
- Hide the "favorite foods" line until the bird has visited 3 times. Before that, show "Favorite foods: ?".
- When a bird reaches 3 visits, show a small "Mango learned something!" message on its bird card.

OPTIONAL SOUNDS (build this only if it is simple)
- Add soft, short sound effects created in code with the Web Audio API, with no audio files or libraries: a light chirp when a bird lands, and a short squawk when Mango reacts to a rare bird.
- Sounds are off by default. Add a mute/sound toggle button on the garden screen and remember the choice in localStorage.
- Play sounds only after a user tap, so mobile browsers allow them.

Do NOT add seasons, weather, accounts, or a share card. Keep animations simple CSS and the code clean and readable.