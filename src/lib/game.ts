// Pure game rules: daily food offer + visitor algorithm. No UI, no storage.
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

export { freshness, pickVisitor, scoreBird, type RecentVisitors } from "./visitor";

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBefore(dateKey: string, n: number): string {
  const [y = 0, m = 1, d = 1] = dateKey.split("-").map(Number);
  return toDateKey(new Date(y, m - 1, d - n));
}
