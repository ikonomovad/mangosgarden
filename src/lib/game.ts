// Pure game rules: daily food offer + visitor algorithm. No UI, no storage.
import { BIRDS, RARITY_WEIGHT, getAffinity, type Bird } from "@/data/birds";
import { FOOD_IDS, type FoodId } from "@/data/foods";
import { seededRandom, shuffle } from "./random";

export const OFFER_SIZE = 4;
export const MIN_NEW_FOODS = 2;

/** 4 foods for the day, seeded by date; at least 2 were not offered yesterday. */
export function getDailyOffer(dateKey: string, yesterdayOffer: FoodId[] = [], allFoods: FoodId[] = FOOD_IDS): FoodId[] {
  const rand = seededRandom(`offer:${dateKey}`);
  const fresh = shuffle(allFoods.filter((f) => !yesterdayOffer.includes(f)), rand);
  const guaranteed = fresh.slice(0, MIN_NEW_FOODS);
  const rest = shuffle(allFoods.filter((f) => !guaranteed.includes(f)), rand);
  return shuffle([...guaranteed, ...rest.slice(0, OFFER_SIZE - guaranteed.length)], rand);
}

export interface RecentVisitors {
  yesterday?: string;
  twoDaysAgo?: string;
}

export function freshness(birdId: string, recent: RecentVisitors): number {
  if (recent.yesterday === birdId) return 0.2;
  if (recent.twoDaysAgo === birdId) return 0.6;
  return 1;
}

export function scoreBird(bird: Bird, food: FoodId, recent: RecentVisitors): number {
  return RARITY_WEIGHT[bird.rarity] * getAffinity(bird, food) * freshness(bird.id, recent);
}

/** Weighted random pick, seeded by date + food so it's stable all day. */
export function pickVisitor(dateKey: string, food: FoodId, recent: RecentVisitors = {}, birds: Bird[] = BIRDS): Bird {
  const scores = birds.map((b) => scoreBird(b, food, recent));
  const total = scores.reduce((a, b) => a + b, 0);
  let roll = seededRandom(`visit:${dateKey}:${food}`)() * total;
  for (let i = 0; i < birds.length; i++) {
    roll -= scores[i];
    if (roll < 0) return birds[i];
  }
  return birds[birds.length - 1];
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBefore(dateKey: string, n: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return toDateKey(new Date(y, m - 1, d - n));
}
