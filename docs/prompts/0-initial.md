Build a playful, mobile-friendly experience using the details below.

Project type: A daily collection game called "Mango's Garden"
Theme: Cozy garden where wild birds visit, hosted by my pet lovebird Mango
Who it's for: Anyone who wants a calm, one-minute daily break and likes birds
What the player does: Each day the game offers 4 foods, chosen at random from a set of 10. The player picks one to put out. Exactly one bird visits, picked by a weighted random algorithm (see below). Mango reacts to it.
What they get at the end: A bird card showing today's visitor with its picture, name, and a fun fact
Tone: Wholesome, warm, a little silly (Mango has personality)
Colors and style: Cozy storybook, soft greens and warm pastels, flat cute illustrations

Mango: a small lovebird with a bright yellow body, a red/orange face, and green on his tail. Draw him in these colors, perched on a branch, with expressive reactions (happy, grumpy, excited).

Foods (10 in total): sunflower seeds, millet, peanuts, nyjer seeds, apple slices, mixed berries, orange half, mealworms, fat ball, fresh water in a bird bath.

DAILY FOOD OFFER
- Each day, offer 4 of the 10 foods, chosen at random.
- Seed the choice with the date, so the same 4 foods show all day, even after a reload.
- Make sure at least 2 of today's 4 foods were not offered yesterday.
- Save yesterday's offered foods in localStorage to check this.

Content to include: Suggest content for me.
- Create 12 birds common in Europe: 9 common, 1 uncommon, 2 rare (for example hoopoe and waxwing).
- Put all bird data in one separate data file so I can edit it easily. Each bird has: name, rarity weight (common 10, uncommon 4, rare 1), a one-line fun fact, an affinity for each of the 10 foods (loves = 3, likes = 1, doesn't care = 0.2), and its look (body color, belly color, wing color, beak color, and one small marking such as a red breast or a crest). Several birds should love or like the same food.
- Write 3 short reaction lines for Mango per mood (happy, grumpy, excited).

VISITOR ALGORITHM
1. For each bird: score = rarity weight x food affinity x freshness.
2. Freshness: x0.2 if the bird visited yesterday, x0.6 if it visited two days ago, otherwise x1.
3. Pick exactly one bird by weighted random selection using the scores.
4. Seed the randomness with the date plus the chosen food, so the same food on the same day always gives the same bird.
5. Save only the last two days' offered foods and visitors in localStorage so freshness works.

WHAT TO BUILD (FIRST STEP ONLY)
- A welcome screen with a catchy headline, Mango in the garden, and a clear Start button.
- A garden scene with a feeder, a branch, and Mango on his perch, greeting the player with a random line.
- A food choice screen showing today's 4 offered foods. After choosing, play a short, simple landing effect (about 1 second, plain CSS): the bird drops in from above and bounces once, and Mango reacts.
- A bird card as the final screen, showing the bird's picture, name, and fun fact, with a "Come back tomorrow" message. No Play Again or Copy Result button.
- A small sparkle effect only when a rare bird appears. Keep all animations lightweight and simple.
- A small hidden "reset today" button for testing, which I will remove later.

Do NOT build the bird book, streak, or once-a-day lock yet. I'll add those in the next steps.

RULES
- No login, no backend. Everything runs in the browser.
- Mobile-first layout.

TECHNICAL NOTES
- Use the default stack (React, TypeScript, Tailwind). Add no extra libraries unless needed.
- Use plain CSS animations only, no animation libraries.
- Draw birds with one reusable, simple, cute SVG bird component (round body, small beak, wing, tail). Each bird's data entry sets its colors and one small marking, so every species looks different without separate images. Keep the style flat and storybook.
- Keep data in separate files: birds, foods, and Mango's reaction lines.
- Put the visitor-picking algorithm and the daily food offer in their own small, pure functions so they can be tested and tuned separately from the UI.
- Use localStorage for saved data. No backend, database, or accounts.
- Use small, reusable components and keep the code clean and readable, since I will edit it myself.