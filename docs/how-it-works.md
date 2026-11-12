# How it works

## Daily loop (`src/routes/index.tsx`)
1. On load, the app computes today's key with `todayKey()` (the device's local calendar date).
2. If today's record already has a `visitor`, the food screen is skipped and today's bird card shows with "Come back tomorrow" and a countdown (`msUntilMidnight`). A timer reloads the day at local midnight.
3. Otherwise: welcome → garden → **Put out a snack** opens the *Today's pantry* dialog → choose a food → the bird lands → bird card.
4. Every screen state carries exactly one `<h1>`: the welcome title, a visually hidden "Mango's Garden" on the garden, "Someone's here…" while the bird lands, and the bird's name on the card.

## Garden screen
- The scene fills the whole visible viewport (`GardenScene` in `full` mode); the food button, **Pet Mango** and the floating controls sit on top of it.
- `src/components/garden/GardenDecor.tsx` draws the wildflowers, fig branch, distant apple tree and drifting butterflies. All of it is `pointer-events: none`, sits behind the UI, thins out or hides on small screens, and stops moving under `prefers-reduced-motion`.
- **Pet Mango** (`src/lib/pat.ts` + `src/components/garden/PatMango.tsx`) is once per local day: the first tap bounces Mango, floats hearts, plays a chirp and shows a tickle line. The button then hides itself but keeps its space, so nothing shifts, and it does not come back until tomorrow. It has its own storage key and never touches game data.

## Daily food offer (`getDailyOffer` in `src/lib/game.ts`)
- Picks `OFFER_SIZE` (4) of the 10 foods.
- Seeded by `offer:<date>`, so the same date always gives the same 4.
- First takes `MIN_NEW_FOODS` (2) foods that were **not** in yesterday's offer, then fills the rest from all other foods, then shuffles.
- The offer is saved into today's day record, so it never changes during the day.

## Visitor algorithm (`src/lib/visitor.ts`)
For each bird:

```text
score = rarity weight × food affinity × freshness × new-bird boost × pity boost
```

- **Rarity weight:** common 10, uncommon 6, rare 0.5.
- **Food affinity:** loves 3, likes 1, any food not listed 0.2.
- **Freshness:** came yesterday 0.2, came two days ago 0.6, otherwise 1.
- **New-bird boost:** ×2 if the bird is not in the bird book yet.
- **Pity boost:** ×(1 + 0.05 per day since the last *newly discovered* rare bird), capped ×3. It only lifts rare birds still missing from the book, resets only when a new rare bird is discovered, and stops applying once both rares are collected.

Then one bird is chosen by weighted random, seeded by `visit:<date>:<food>` — the same date and food always give the same bird.

## Once-a-day lock and midnight
- Feeding saves `visitor` into today's record. Any record with a visitor means "locked".
- A new local date has no record, so it is unlocked automatically. Nothing is cleared at midnight.

## Streak (`nextStreak`, `liveStreak` in `src/lib/game.ts`)
- First visit → 1. Visit the day after the last visit → +1. A missed day → restarts at 1.
- A second visit on the same day changes nothing.
- `best` is the highest streak ever.
- On screen, the streak shows 0 once a day has been missed (until the next visit).

## Bird book, visits and food hints
- `recordVisit` saves `firstSeen` (first date), `visits` (count) and `seenFoods` (foods that attracted it).
- New birds are flagged `unseenInBook` until the book is opened.
- The header shows "X of 12 collected" with a progress bar, total visits and best streak.
- Collected cards show the bird, its name and a small rarity gem, and open a dialog. Locked cards show the real bird and its name behind a soft blur, are not tappable and carry no links.
- The dialog shows the bird inside a double ring in its rarity colour, the name with its rarity tooltip, the fun fact, first seen, visit count, and "Seen eating" / "Favorite foods" as food chips.
- Favorite foods are revealed once a bird has visited 3 times (`favoritesKnown`). Until then the row shows a lock, "Visit N more times to discover" and an `n/3` counter. On the revealing visit Mango says "Mango learned something!".
- "Find out more" and "Ask ChatGPT" open searches for that bird in the selected language (`src/lib/bird-links.ts`); the same two links sit under the fun fact on today's visitor card.

## Rarity badge (`src/components/garden/RarityBadge.tsx`)
One flat SVG gem per rarity — round sage green with a leaf, hexagon warm blue with a feather, gold diamond with a star and two sparkles. The translated label lives in a tooltip: on hover/keyboard focus on desktop, on tap (with a 3s auto-close) on touch. It is a real 44px button with an aria-label, and its light-sweep animation waits for the bird's landing effect on the visitor card. All badge animation is off under `prefers-reduced-motion`.

## Food artwork (`src/components/FoodIcon.tsx`)
`FOOD_ICONS` maps every food id to one flat SVG drawn with the theme tokens; `FoodIcon` renders it at any size and falls back to the data emoji only when artwork is missing. The pantry, the visitor card and the book chips all reuse it.

## Mango's reactions and milestones (`src/lib/personality.ts`)
- Reaction group, in priority order: **rare** bird → **yesterday** (same bird as yesterday) → **new** → **repeat**.
- Each group has 3 lines. The last variant used per group is remembered so the same line never appears twice in a row.
- Milestones: first bird, 3/7/14/30-day streaks, 6 and 12 birds collected. Each is shown once, ever, and remembered in `mangos-garden:personality` (reset does not clear it).

## Sounds (`src/lib/sounds.ts`)
- Made with the Web Audio API — no files or libraries.
- A light chirp when the bird lands; an extra short squawk for rare birds; a short chirp for the daily pat.
- Off by default. The speaker button in the floating controls toggles it and the choice is saved.
- Only played right after a tap (a food choice or a pat), so mobile browsers allow it.

## Language (`src/i18n/`)
- `en.ts` and `mk.ts` hold every UI string; `languages.ts` is the registry (id, label, locale, messages) and provides `t()`, `localized()` and `initialLanguage()`.
- The chosen language is saved under `mangos-garden:language`, defaults to the device language when supported, and never changes saved game data, stable ids, scoring or stored reaction strings.
- Bird names/facts, food names and Mango lines carry their translations inside the data files and fall back to English when one is missing.

## Testing: the developer panel
The old faint "reset today" link is gone. Use the hidden developer test panel instead: open `/?debug=1`, scroll below the game and expand **Developer test panel**. **Reset today** restores the collection snapshot (`collectionBefore`), the streak (`streakBefore`), the previous history, the pity counter and today's pat, and deletes today's record so the food screen unlocks. Milestones and reaction memory are kept on purpose so celebrations do not repeat. See the README's **Hidden developer test panel** section for the clock, readout and setup tools.
