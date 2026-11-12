# Adding content

## A new bird
1. Add an entry to `BIRDS` in `src/data/birds.ts`:
```ts
{
  id: "kingfisher", name: "Common Kingfisher", rarity: "rare",
  fact: "Kingfishers dive so fast they close their eyes before hitting the water.",
  affinity: { mealworms: LOVES, water: LIKES },
  look: { body: "#1f7fbf", belly: "#e8853b", wing: "#16639a", beak: "#222", marking: "mask", markingColor: "#ffffff" },
},
```
2. `id` must be unique; `marking` must be one of the `Marking` types (or add a new one and draw it in `BirdSvg.tsx`).
3. Add the same `id` to `BIRDS_MK` in that file with a Macedonian `name` and `fact`. Missing translations fall back to English, but the coverage test in `src/i18n/i18n.test.ts` expects both.
4. The rarity gem is chosen from the `rarity` field automatically — no new artwork needed.
5. The book and the "12 birds" milestone count birds by number: update the `collection-12` milestone in `personality.ts` and `mango-lines.ts`, the bird-count test in `game.test.ts`, and the "12 birds" wording in `src/i18n/en.ts` and `mk.ts`.

## A new food
1. Add the id to the `FoodId` type and an entry to `FOODS` in `src/data/foods.ts`:
```ts
{ id: "suet", name: "Suet cake", emoji: "🧈" },
```
2. Add the id to `FOODS_MK` in the same file with its Macedonian name.
3. Add artwork for the new id to `FOOD_ICONS` in `src/components/FoodIcon.tsx` — flat shapes, theme tokens, readable at 40px. `src/components/FoodIcon.test.ts` fails until every food has one; the emoji is only the fallback.
4. Add it to the `affinity` of birds that should like it (otherwise they treat it as 0.2).

## A new Mango line
Add a string to the right list in `src/data/mango-lines.ts`, for example:
```ts
repeat: [
  "Welcome back! Your usual twig is ready.",
  "You again? I'd recognise that tail anywhere!",
],
```
Reaction groups work with any number of lines (2 or more avoids repeats). A new milestone needs both a key in `MILESTONE_LINES` and a rule in `pendingMilestones`.

## A new UI string
Add the key to `src/i18n/en.ts` and the same key to `src/i18n/mk.ts`, then read it with `t("key")`. The coverage test fails if the two files drift apart.

## A new language
The README's **Languages** section lists the three steps: one new dictionary file, one entry in `languages`, and translations added to the data files.
