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

export interface Streak {
  current: number;
  best: number;
  lastVisit?: string | undefined;
}

/** Streak after visiting on `today`: +1 if last visit was yesterday, same if already today, else 1. */
export function nextStreak(s: Streak, today: string): Streak {
  if (s.lastVisit === today) return s;
  const current = s.lastVisit === daysBefore(today, 1) ? s.current + 1 : 1;
  return { current, best: Math.max(s.best, current), lastVisit: today };
}

/** Streak to display: 0 once a day has been missed. */
export function liveStreak(s: Streak, today: string): number {
  return s.lastVisit === today || s.lastVisit === daysBefore(today, 1) ? s.current : 0;
}

export function msUntilMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}
