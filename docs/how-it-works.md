# How it works

## Daily loop (`src/routes/index.tsx`)
1. On load, the app computes today's key with `toDateKey(new Date())` (local date).
2. If today's record already has a `visitor`, the food screen is skipped and today's bird card shows with "Come back tomorrow" and a countdown (`msUntilMidnight`). A timer reloads the day at local midnight.
3. Otherwise: welcome → garden → choose a food → the bird lands → bird card.

## Daily food offer (`getDailyOffer` in `src/lib/game.ts`)
- Picks `OFFER_SIZE` (4) of the 10 foods.
- Seeded by `offer:<date>`, so the same date always gives the same 4.
- First takes `MIN_NEW_FOODS` (2) foods that were **not** in yesterday's offer, then fills the rest from all other foods, then shuffles.
- The offer is saved into today's day record, so it never changes during the day.

## Visitor algorithm (`src/lib/visitor.ts`)
For each bird:

```text
score = rarity weight × food affinity × freshness × new-bird boost
```

- **Rarity weight:** common 10, uncommon 4, rare 1.
- **Food affinity:** loves 3, likes 1, any food not listed 0.2.
- **Freshness:** came yesterday 0.2, came two days ago 0.6, otherwise 1.
- **New-bird boost:** ×2 if the bird is not in the bird book yet.

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
- Favorite foods are shown once a bird has visited 3 times (`favoritesKnown`). On that visit Mango says "Mango learned something!".
- Undiscovered birds show as dark silhouettes named "???".

## Mango's reactions and milestones (`src/lib/personality.ts`)
- Reaction group, in priority order: **rare** bird → **yesterday** (same bird as yesterday) → **new** → **repeat**.
- Each group has 3 lines. The last variant used per group is remembered so the same line never appears twice in a row.
- Milestones: first bird, 3/7/14/30-day streaks, 6 and 12 birds collected. Each is shown once, ever, and remembered in `mangos-garden:personality` (reset does not clear it).

## Sounds (`src/lib/sounds.ts`)
- Made with the Web Audio API — no files or libraries.
- A light chirp when the bird lands; an extra short squawk for rare birds.
- Off by default. The speaker button on the garden screen toggles it and the choice is saved.
- Only played right after a food tap, so mobile browsers allow it.

## Hidden "reset today" link (testing)
The faint link at the bottom of the game. It:
- restores the bird book entry to its snapshot from before today (`collectionBefore`), or removes the bird if it was new,
- restores the streak from `streakBefore`,
- deletes today's record, unlocking the food screen.
Milestones and reaction memory are kept on purpose so celebrations do not repeat.
