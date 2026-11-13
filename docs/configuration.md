# Configuration reference

| Value | Default | Where | What changing it does |
|---|---|---|---|
| Rarity weights | common 10, uncommon 6, rare 0.5 | `RARITY_WEIGHT`, `src/data/birds.ts` | Higher = that rarity visits more often |
| Affinity: loves | 3 | `LOVES`, `src/data/birds.ts` | How strongly a favorite food attracts a bird |
| Affinity: likes | 1 | `LIKES`, `src/data/birds.ts` | Pull of a liked food |
| Affinity: doesn't care | 0.2 | `MEH`, `src/data/birds.ts` | Chance a bird comes for a food it doesn't list |
| Freshness: came yesterday | 0.2 | `freshness`, `src/lib/visitor.ts` | Lower = fewer back-to-back repeats |
| Freshness: came 2 days ago | 0.6 | `freshness`, `src/lib/visitor.ts` | Same, one day further back |
| Pity boost step | +0.05 per day | `PITY_STEP`, `src/lib/visitor.ts` | How fast rare birds get likelier each day since the last new rare discovery; applies only to uncollected rares and resets only on a new rare bird |
| Pity boost cap | x3 | `PITY_CAP`, `src/lib/visitor.ts` | Highest the rare-bird boost can go |
| New-bird boost | 2 | `NEW_BIRD_BONUS`, `src/lib/visitor.ts` | Higher = the book fills faster |
| Foods offered per day | 4 | `OFFER_SIZE`, `src/lib/game.ts` | Number of food buttons |
| Foods new vs yesterday | 2 | `MIN_NEW_FOODS`, `src/lib/game.ts` | Minimum change in the offer from day to day |
| History days kept | today + 2 | `saveDay`, `src/lib/storage.ts` | Must cover the freshness rule (2 days back) |
| Streak milestones | 3, 7, 14, 30 days | `pendingMilestones`, `src/lib/personality.ts` (+ lines in `MILESTONE_LINES`) | When streak celebrations appear |
| Collection milestones | 1, half (floor(N/2)), all N birds | `pendingMilestones`, `src/lib/personality.ts` | When collection celebrations appear |
| Food hint threshold | 3 visits | `favoritesKnown`, `src/lib/personality.ts` | Visits needed to reveal favorite foods; the dialog's lock hint counts down to this number |
| Pet Mango | once per local day | `claimPat`, `src/lib/pat.ts` | The pat hides until tomorrow; its own key keeps it out of game data |
| Season months | spring Mar–May, summer Jun–Aug, autumn Sep–Nov, winter Dec–Feb | `seasonFor`, `src/lib/season.ts` | Which colours and decoration the garden shows; never moves the perch, feeder or buttons |
| Cat visits | exactly one day per Monday–Sunday week | `catDayIndex` / `isCatDay`, `src/lib/cat.ts` | How often the black cat sits in the garden; the seed is the week's Monday, so nothing is stored |
| Sound timing and pitch | chirp 1 s after tap | `playArrival`, `src/lib/sounds.ts` | When and how the chirp/squawk sound |
| Pat sound | one short chirp | `playPat`, `src/lib/sounds.ts` | The noise a pat makes |
| Language default | device language, else English | `initialLanguage`, `src/i18n/languages.ts` | Which language a first visit opens in |
| Page width | 480px | `--page-max`, `src/styles.css` | How wide the game column gets on desktop |
| Gem light sweep | 0.9s, rare repeats every 4s | `gem-sweep`, `src/styles.css` | How the rarity badge shimmers |

After changing a value, run `npm run simulate` (5,000 players x 365 days; current tuning gives a median of 75 days to finish the book, 18 days to the first rare bird and 2 unfinished players after a year), then `npm test`: some tests check the defaults on purpose and will tell you what moved.
