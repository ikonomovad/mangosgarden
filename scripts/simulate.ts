// npm run simulate — 5,000 players x 365 days with the real game rules.
// Optional overrides for tuning: RARE=1 UNCOMMON=4 PITY=0 npm run simulate
import { BIRDS, RARITY_WEIGHT, type Rarity } from "@/data/birds";
import type { FoodId } from "@/data/foods";
import { daysBefore, getDailyOffer, nextDaysSinceRare, pickVisitor } from "@/lib/game";
import { seededRandom } from "@/lib/random";

if (process.env.RARE) RARITY_WEIGHT.rare = Number(process.env.RARE);
if (process.env.UNCOMMON) RARITY_WEIGHT.uncommon = Number(process.env.UNCOMMON);
const pityOn = process.env.PITY !== "0";

const PLAYERS = 5000, DAYS = 365;
const complete: number[] = [], firstRare: number[] = [];
const share: Record<Rarity, number> = { common: 0, uncommon: 0, rare: 0 };
let neverComplete = 0, neverRare = 0;

for (let p = 0; p < PLAYERS; p++) {
  const rand = seededRandom(`player:${p}`);
  const start = daysBefore("2030-01-01", Math.floor(rand() * 3650)); // spread players over real dates
  const collected = new Set<string>();
  const visitors: string[] = [];
  let offer: FoodId[] = [], daysSinceRare = 0, done = 0, rare = 0;
  for (let d = 0; d < DAYS; d++) {
    const date = daysBefore(start, -d);
    offer = getDailyOffer(date, offer);
    const food = offer[Math.floor(rand() * offer.length)]!;
    const bird = pickVisitor(date, food, { yesterday: visitors[d - 1], twoDaysAgo: visitors[d - 2] }, [...collected], pityOn ? daysSinceRare : 0);
    visitors.push(bird.id);
    daysSinceRare = nextDaysSinceRare(daysSinceRare, bird, [...collected]);
    collected.add(bird.id);
    share[bird.rarity]++;
    if (bird.rarity === "rare" && !rare) rare = d + 1;
    if (!done && collected.size === BIRDS.length) done = d + 1;
  }
  if (done) complete.push(done); else neverComplete++;
  if (rare) firstRare.push(rare); else neverRare++;
}

const pct = (xs: number[], q: number, missing: number) => {
  const all = [...xs].sort((a, b) => a - b).concat(Array(missing).fill(Infinity));
  const v = all[Math.min(all.length - 1, Math.ceil(q * all.length) - 1)]!;
  return Number.isFinite(v) ? `${v} days` : `>${DAYS} days`;
};
const total = PLAYERS * DAYS;
console.log(`Weights: common ${RARITY_WEIGHT.common}, uncommon ${RARITY_WEIGHT.uncommon}, rare ${RARITY_WEIGHT.rare}; pity ${pityOn ? "on" : "off"}`);
console.log(`Days to collect all 12 — median: ${pct(complete, 0.5, neverComplete)}, 90th percentile: ${pct(complete, 0.9, neverComplete)} (${neverComplete} players never finished)`);
console.log(`Days until first rare bird — median: ${pct(firstRare, 0.5, neverRare)}`);
for (const r of ["common", "uncommon", "rare"] as Rarity[]) console.log(`${r}: ${((share[r] / total) * 100).toFixed(1)}% of visits`);
