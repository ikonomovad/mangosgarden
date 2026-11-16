Add a once-a-day "pat Mango" button to Mango's Garden. Visual and audio only. Do not change game logic, the bird or food algorithms, the streak, or the existing saved game data.

1. BUTTON
- On the food choice screen (before the player picks a food), add a small round button (44px, cream background, soft shadow, like the floating controls) with a simple flat hand SVG icon in warm brown. Place it directly above the "Put out a snack" button, aligned to its right end, with a small gap, so it never overlaps the snack button or the food options.
- It is a real button with aria-label en "Pat Mango", mk "Помилувај го Манго". Mango himself is not tappable.
- While today's pat is available, give the button a very gentle pulse as a hint. After the pat is used, show it dimmed (reduced opacity), with no pulse.

2. THE PAT (first click of the day only)
- Mango plays a short happy animation (a quick squish and bounce, plain CSS), and 3 to 5 small flat storybook hearts (SVG, soft red and pink, in our palette) float upward from him with slight random horizontal drift and fade out over about 1.2 seconds. Remove them from the DOM afterward.
- Play a short, soft, cute chirp made with the Web Audio API (no audio files), only if sound is on, following the existing sound toggle.
- Show a short Mango line in the existing speech bubble: en "Hehe, that tickles! See you tomorrow for more pats.", mk "Хехе, ме гъдалиш! До утре за уште милување." Put both in the translation files.
- Save the date of the pat under its own small localStorage key (not inside the main game data), using the shared date helper so it follows the local day and the debug fake clock.

3. ALREADY PATTED TODAY
- Later clicks the same day only make Mango do a tiny head tilt, with no hearts, no sound, and no state change.
- The pat is available again on the next local day.

4. DEBUG AND LIMITS
- Make the existing "reset today" action in the debug panel also clear today's pat, so it can be tested again.
- Patting must not affect which birds visit, the food offer, the streak, or any saved game data. It does not require feeding the birds, and feeding does not require patting.
- Respect prefers-reduced-motion: no bounce, pulse, or floating, just a single heart that appears briefly and fades. The sound still follows the toggle.
- Add tests: the first click of the day sets the pat date, a second click the same day does nothing, a new day makes it available again, and the main game data is unchanged by patting. Do not refactor unrelated code. In your summary, list only the files you changed.