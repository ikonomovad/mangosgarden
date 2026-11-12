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

## Languages

English (`en`) and Macedonian (`mk`) are available from the round EN/МК control. The separate `mangos-garden:language` preference defaults to the device language when supported, otherwise English. It never changes game saves, stable bird/food IDs, scoring, or stored reaction strings. Existing English reactions are translated at display time, including after reload. Missing data translations fall back to English. Dates and numbers use the selected locale; Nunito supplies Cyrillic glyphs where Fredoka has none. Language detection happens after hydration, so server-rendered metadata starts in English and updates with the selected language in the browser.

To add another language:
1. Create `src/i18n/<code>.ts` with the same keys as `en.ts` (use `Record<keyof typeof en, string>`).
2. Import it and add one entry (id, label, locale, messages) to `languages` in `src/i18n/languages.ts`. The control cycles through this list automatically.
3. Add that language to every `BIRD_TEXT`, `FOOD_TEXT`, and `MANGO_TEXT` entry in the existing data files. Keep English text and IDs unchanged.
4. Run `npm test`; the translation coverage tests use the registry to check every language. Check long text at 360px.

## Run it

```sh
npm install        # or: bun install
npm run dev        # starts the app at http://localhost:8080
npm test           # runs all unit tests once (Vitest)
npm run test:watch # re-runs tests when files change
```

## Dates and saved data

- **Today:** every "today" (food seed, bird seed, daily lock, streak, countdown, freshness) comes from `todayKey()` in `src/lib/game.ts`: the device's local calendar date as `YYYY-MM-DD`, never UTC. Yesterday/two days ago use `daysBefore()`, which steps calendar days, so daylight-saving changes cannot break streaks or freshness. A last visit dated in the future (clock moved back) keeps the streak instead of resetting it.
- **Saved-data version:** `mangos-garden:version` (currently `1`). `migrate()` in `src/lib/storage.ts` runs on load and upgrades old saves step by step (v0 → v1 turns any saved bird/food names into stable ids); it never wipes progress. When you change the saved shape, bump `STORAGE_VERSION` and add a step.
- **Robustness:** all localStorage access is wrapped; blocked, full or corrupted storage falls back to safe defaults and unknown birds/foods are dropped.
- **Tests:** run in the fixed time zone `Europe/Skopje` (set in `vitest.config.ts`); see `src/lib/dates.test.ts`.

## Testing date-based features by hand

Days are local `YYYY-MM-DD` strings. Open the browser dev tools → Application → Local Storage:

- **Pretend today never happened:** open `/?debug=1`, scroll below the game, expand **Developer test panel**, and press **Reset today**.
- **Simulate "yesterday's visit":** in `mangos-garden:days`, rename today's key (for example `2026-11-11`) to yesterday's date, then reload. Food choice unlocks and the yesterday rules apply (fresh foods, freshness penalty, "yesterday" reaction).
- **Test streaks:** edit `mangos-garden:streak`, for example `{"current":2,"best":2,"lastVisit":"<yesterday>"}`, then feed today to reach the 3-day milestone.
- **Test food hints:** set a bird's `visits` to `2` in `mangos-garden:collection`; the next visit reveals its favorite foods.
- **Start fresh:** delete all `mangos-garden:*` keys. Milestones only show once, so clear `mangos-garden:personality` to see them again.

## Known limitations

- Days use the device clock and time zone. Changing the clock or travelling can skip or repeat a day.
- Everything is saved in this browser only: no accounts, no cross-device sync. Clearing site data erases progress.
- The daily offer and visitor are seeded by date, so two players picking the same food on the same day (with the same history) get the same bird.
- Sounds need a tap first (browser rule) and are silent on devices without Web Audio.

## Hidden developer test panel

Open `/?debug=1` (or `/book?debug=1`). This enables the collapsible drawer below the game for this browser tab's session, including navigation and reloads. Normal visits do not show it. The drawer is in page flow, not over the scene: scroll down to use it.

- **Clock:** +1 day, +2 days, -1 day step local calendar days (including daylight-saving changes). **Jump to 23:59** sets the shifted day's local time to 23:59:00; let the countdown run to midnight. **Back to real time** removes the offset. A banner in the drawer identifies the fake time while shifted.
- **Readout:** clock, today's actual offer, yesterday's saved offer, streak/best, pity counter, chosen bird/food, and daily lock. Missing previous offers are shown as unrecorded, not invented.
- **Setup:** set streak (anchored to yesterday unless already fed today), pity, or a chosen bird's visit count. Zero visits removes that bird. Existing food discoveries and first-seen dates remain when changing a collected bird's count. **Clear all game data** asks for confirmation, then clears progress, milestones and sound; unrelated browser data and the debug clock/session are kept.
- **Reset today:** calls the existing `resetDay` in `src/lib/storage.ts` unchanged, restoring the collection snapshot, streak/best, previous history and pity. Milestone/reaction memory still does not reset.
- Actions reload the current screen to use the normal saved-data loading path. Setup tools intentionally edit this browser's real game progress; use a separate browser profile for disposable tests.

The shared `getNow()` clock in `src/lib/game.ts` returns real time plus the separately stored `mangos-garden-debug:clock-offset` millisecond offset. `todayKey()` and the default `msUntilMidnight()` use it; calendar constructors for formatting saved dates and day arithmetic are not reads of the real clock. `mangos-garden-debug:enabled` is sessionStorage only. All debug storage access tolerates blocked or invalid storage. With no offset, gameplay is unchanged.

### Disable or completely remove

Set **`ENABLE_DEBUG_PANEL = false`** in `src/lib/game.ts` to disable the drawer, ignore `?debug=1`, and ignore any saved offset. No game progress is deleted.

To remove completely, delete exactly:

1. `src/debug/actions.ts`, `src/debug/DeveloperPanel.tsx`, `src/debug/DeveloperPanel.test.tsx`, and `src/debug/disabled.test.tsx` (the whole `src/debug/` directory).
2. In `src/routes/__root.tsx`, the import line ending `// Removable debug import` and the mount line containing `{/* Removable debug mount */}`.
3. In `src/lib/game.ts`, the block from `// BEGIN removable developer clock` through `// END removable developer clock`; replace it with `export function getNow(): Date { return new Date(); }`. Keep `todayKey(now = getNow())` and `msUntilMidnight(now = getNow())` so all gameplay still shares one clock.
4. In `AGENTS.md`, the rule beginning `Gameplay reads current time` and this README's **Hidden developer test panel** section; replace the reset-testing bullet above with your preferred testing procedure.

No changes to storage or game algorithms need undoing. The old normal-screen reset link was removed as requested; the reset operation remains in `src/lib/storage.ts`.
