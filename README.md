# Mango's Garden

A tiny daily bird-feeding game for phones. Once a day the player puts out one of four snacks. A wild bird visits, Mango the parrot reacts, and the bird goes into the **Bird book**. After that the garden is closed until local midnight. Come back every day to grow a streak and fill the book with all 12 birds.

Rarity tuning (see `npm run simulate`):

| Value | Default |
|---|---|
| Rarity weights | common 10, uncommon 6, rare 0.5 |
| Pity boost | uncollected rare birds only: x(1 + 0.05 per day since the last new rare bird), capped at x3, reset only when a new rare bird is discovered; off once both rares are collected |

More detail: [docs/how-it-works.md](docs/how-it-works.md) · [docs/storage.md](docs/storage.md) · [docs/configuration.md](docs/configuration.md) · [docs/extending.md](docs/extending.md)

## Project structure

```text
src/
  data/                 Game content. Edit these to tune the game.
    birds.ts            The 12 birds, rarity weights, food affinity values and how each bird looks
    foods.ts            The 10 foods (id, name, emoji)
    mango-lines.ts      Everything Mango says: greetings, moods, visit reactions, milestones
  lib/                  Pure logic plus storage. No React in here.
    game.ts             Daily food offer, date keys, streak math, midnight countdown
    visitor.ts          Visitor scoring and the seeded weighted pick
    personality.ts      Which reaction group to use, non-repeating variants, milestones, food-hint threshold
    random.ts           Seeded random number generator and shuffle (deterministic)
    storage.ts          Every localStorage read/write, with safe fallbacks
    sounds.ts           Web Audio chirp and squawk (no audio files)
    *.test.ts           Unit tests next to the code they cover
  components/garden/    UI pieces
    BirdSvg.tsx         Draws any bird from its data "look" fields
    Mango.tsx           Mango the parrot
    GardenScene.tsx     Garden background, feeder, Mango and speech bubble
    FoodPicker.tsx      The 4 food buttons
    BirdCard.tsx        The card shown after a visit
    SpeechBubble.tsx    Mango's speech bubble
  routes/
    index.tsx           The game: welcome → garden → choose food → landing → bird card
    book.tsx            The Bird book page
    __root.tsx          Page shell and metadata
```

## Run it

```sh
npm install        # or: bun install
npm run dev        # starts the app at http://localhost:8080
npm test           # runs all unit tests once (Vitest)
npm run test:watch # re-runs tests when files change
```

## Testing date-based features by hand

Days are local `YYYY-MM-DD` strings. Open the browser dev tools → Application → Local Storage:

- **Pretend today never happened:** use the hidden "reset today" link at the bottom of the game screen.
- **Simulate "yesterday's visit":** in `mangos-garden:days`, rename today's key (for example `2026-11-11`) to yesterday's date, then reload. Food choice unlocks and the yesterday rules apply (fresh foods, freshness penalty, "yesterday" reaction).
- **Test streaks:** edit `mangos-garden:streak`, for example `{"current":2,"best":2,"lastVisit":"<yesterday>"}`, then feed today to reach the 3-day milestone.
- **Test food hints:** set a bird's `visits` to `2` in `mangos-garden:collection`; the next visit reveals its favorite foods.
- **Start fresh:** delete all `mangos-garden:*` keys. Milestones only show once, so clear `mangos-garden:personality` to see them again.

## Known limitations

- Days use the device clock and time zone. Changing the clock or travelling can skip or repeat a day.
- Everything is saved in this browser only: no accounts, no cross-device sync. Clearing site data erases progress.
- The daily offer and visitor are seeded by date, so two players picking the same food on the same day (with the same history) get the same bird.
- Sounds need a tap first (browser rule) and are silent on devices without Web Audio.
