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
3. The book and the "12 birds" milestone count birds by number: update the `collection-12` milestone in `personality.ts` and `mango-lines.ts`, and the bird-count test in `game.test.ts`.

## A new food
1. Add the id to the `FoodId` type and an entry to `FOODS` in `src/data/foods.ts`:
```ts
{ id: "suet", name: "Suet cake", emoji: "🧈" },
```
2. Add it to the `affinity` of birds that should like it (otherwise they treat it as 0.2).

## A new Mango line
Add a string to the right list in `src/data/mango-lines.ts`, for example:
```ts
repeat: [
  "Welcome back! Your usual twig is ready.",
  "You again? I'd recognise that tail anywhere!",
],
```
Reaction groups work with any number of lines (2 or more avoids repeats). A new milestone needs both a key in `MILESTONE_LINES` and a rule in `pendingMilestones`.
