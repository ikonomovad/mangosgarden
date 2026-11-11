# Saved data (localStorage)

All keys start with `mangos-garden:`. Every loader is wrapped in try/catch and validates shapes: missing or broken data falls back to the defaults below, never a crash.

| Key | Default | Kept |
|---|---|---|
| `mangos-garden:days` | `{}` | today + 2 previous days |
| `mangos-garden:collection` | `{}` | forever |
| `mangos-garden:streak` | `{current:0,best:0}` | forever |
| `mangos-garden:personality` | `{shown:[],previous:{}}` | forever (not reset) |
| `mangos-garden:sound` | off | forever |

## `mangos-garden:days`
```json
{
  "2026-11-11": {
    "offer": ["apple", "millet", "water", "peanuts"],
    "food": "apple",
    "visitor": "robin",
    "streakBefore": { "current": 2, "best": 5, "lastVisit": "2026-11-10" },
    "collectionBefore": { "firstSeen": "2026-11-01", "visits": 1, "seenFoods": ["millet"] },
    "reactionLine": "Welcome back! Your usual twig is ready.",
    "learned": false
  }
}
```
- `offer` — today's 4 foods (also used to make tomorrow's offer fresh).
- `food`, `visitor` — today's choice and bird; `visitor` present = day locked. Yesterday's and two-days-ago visitors feed the freshness rule.
- `streakBefore`, `collectionBefore` — snapshots so "reset today" can undo exactly (`null` = bird was new).
- `reactionLine` — Mango's line, so reopening shows the same one.
- `learned` — true if this visit revealed the bird's favorite foods.

## `mangos-garden:collection`
```json
{ "robin": { "firstSeen": "2026-11-01", "visits": 3, "seenFoods": ["millet", "apple"], "unseenInBook": true } }
```
`firstSeen` date, `visits` count, `seenFoods` foods that attracted it, `unseenInBook` = "new" badge until the book is opened. Entries with a bad date or visits < 1 are dropped; unknown foods are filtered.

## `mangos-garden:streak`
```json
{ "current": 3, "best": 7, "lastVisit": "2026-11-11" }
```

## `mangos-garden:personality`
```json
{ "shown": ["first-bird", "streak-3"], "previous": { "new": 1, "repeat": 0 } }
```
`shown` = milestones already celebrated; `previous` = last line index used per reaction group.

## `mangos-garden:sound`
The string `"on"` or `"off"`. Anything else counts as off.

## `mangos-garden:pity`

A plain number: visits since the last newly discovered rare bird (drives the pity boost). Missing or invalid means 0. Each day record stores `pityBefore` so "reset today" can restore it.

## `mangos-garden:version`

A plain number: the saved-data format version (currently `1`). Missing means `0` (saves from before versioning); `migrate()` upgrades them in place without losing progress.
