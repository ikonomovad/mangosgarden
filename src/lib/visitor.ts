// Pure visitor algorithm: rarity x affinity x freshness x new-bird bonus.
import { BIRDS, RARITY_WEIGHT, getAffinity, type Bird } from "@/data/birds";
import type { FoodId } from "@/data/foods";
import { seededRandom } from "./random";

export const NEW_BIRD_BONUS = 2;
/** Pity boost: rare birds' score grows by this much per day without a rare visit (tuned with npm run simulate)... */
export const PITY_STEP = 0.05;
/** ...up to this multiplier. */
export const PITY_CAP = 3;

export function pityMultiplier(daysSinceRare: number): number {
  return Math.min(PITY_CAP, 1 + PITY_STEP * Math.max(0, daysSinceRare));
}

/** Days-since-rare after today's visit: back to 0 on a rare visit, else +1. */
export function nextDaysSinceRare(daysSinceRare: number, bird: Bird): number {
  return bird.rarity === "rare" ? 0 : daysSinceRare + 1;
}

export interface RecentVisitors {
  yesterday?: string | undefined;
  twoDaysAgo?: string | undefined;
}

export function freshness(birdId: string, recent: RecentVisitors): number {
  if (recent.yesterday === birdId) return 0.2;
  if (recent.twoDaysAgo === birdId) return 0.6;
  return 1;
}

/** `collected` = ids the player has already seen; when omitted no bonus applies. */
export function scoreBird(bird: Bird, food: FoodId, recent: RecentVisitors, collected?: readonly string[], daysSinceRare = 0): number {
  const pity = bird.rarity === "rare" ? pityMultiplier(daysSinceRare) : 1;
  const bonus = collected && !collected.includes(bird.id) ? NEW_BIRD_BONUS : 1;
  return RARITY_WEIGHT[bird.rarity] * getAffinity(bird, food) * freshness(bird.id, recent) * bonus * pity;
}

/** Weighted random pick, seeded by date + food so it's stable all day. */
export function pickVisitor(
  dateKey: string, food: FoodId, recent: RecentVisitors = {}, collected?: readonly string[], daysSinceRare = 0, birds: Bird[] = BIRDS,
): Bird {
  const scores = birds.map((b) => scoreBird(b, food, recent, collected, daysSinceRare));
  const total = scores.reduce((a, b) => a + b, 0);
  let roll = seededRandom(`visit:${dateKey}:${food}`)() * total;
  for (let i = 0; i < birds.length; i++) {
    roll -= scores[i]!;
    if (roll < 0) return birds[i]!;
  }
  return birds[birds.length - 1]!;
}
