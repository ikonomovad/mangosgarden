# Configuration reference

| Value | Default | Where | What changing it does |
|---|---|---|---|
| Rarity weights | common 10, uncommon 6, rare 0.5 | `RARITY_WEIGHT`, `src/data/birds.ts` | Higher = that rarity visits more often |
| Affinity: loves | 3 | `LOVES`, `src/data/birds.ts` | How strongly a favorite food attracts a bird |
| Affinity: likes | 1 | `LIKES`, `src/data/birds.ts` | Pull of a liked food |
| Affinity: doesn't care | 0.2 | `MEH`, `src/data/birds.ts` | Chance a bird comes for a food it doesn't list |
| Freshness: came yesterday | 0.2 | `freshness`, `src/lib/visitor.ts` | Lower = fewer back-to-back repeats |
| Freshness: came 2 days ago | 0.6 | `freshness`, `src/lib/visitor.ts` | Same, one day further back |
| Pity boost step | +0.05 per day | `PITY_STEP`, `src/lib/visitor.ts` | How fast rare birds get likelier each day without a rare visit (resets on a rare visit) |
| Pity boost cap | x3 | `PITY_CAP`, `src/lib/visitor.ts` | Highest the rare-bird boost can go |
| New-bird boost | 2 | `NEW_BIRD_BONUS`, `src/lib/visitor.ts` | Higher = the book fills faster |
| Foods offered per day | 4 | `OFFER_SIZE`, `src/lib/game.ts` | Number of food buttons |
| Foods new vs yesterday | 2 | `MIN_NEW_FOODS`, `src/lib/game.ts` | Minimum change in the offer from day to day |
| History days kept | today + 2 | `saveDay`, `src/lib/storage.ts` | Must cover the freshness rule (2 days back) |
| Streak milestones | 3, 7, 14, 30 days | `pendingMilestones`, `src/lib/personality.ts` (+ lines in `MILESTONE_LINES`) | When streak celebrations appear |
| Collection milestones | 1, 6, 12 birds | `pendingMilestones`, `src/lib/personality.ts` | When collection celebrations appear |
| Food hint threshold | 3 visits | `favoritesKnown`, `src/lib/personality.ts` | Visits needed to reveal favorite foods |
| Sound timing and pitch | chirp 1 s after tap | `playArrival`, `src/lib/sounds.ts` | When and how the chirp/squawk sound |

After changing a value, run `npm run simulate` (5,000 players x 365 days; current tuning gives a median of ~60 days to finish the book and ~18 days to the first rare bird), then `npm test`: some tests check the defaults on purpose and will tell you what moved.
