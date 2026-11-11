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

export { freshness, nextDaysSinceRare, pickVisitor, pityMultiplier, scoreBird, type RecentVisitors } from "./visitor";

/** The ONE way to get "today": the device's LOCAL calendar date as YYYY-MM-DD (never UTC). */
export function todayKey(now: Date = new Date()): string {
  return toDateKey(now);
}

export const isDateKey = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Local calendar date of a Date as YYYY-MM-DD. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Calendar-day arithmetic via the local Date constructor (handles month ends and DST, no ms/86,400,000 math). */
export function daysBefore(dateKey: string, n: number): string {
  const [y = 0, m = 1, d = 1] = dateKey.split("-").map(Number);
  return toDateKey(new Date(y, m - 1, d - n));
}

export interface Streak {
  current: number;
  best: number;
  lastVisit?: string | undefined;
}

/** Streak after visiting on `today`: +1 if last visit was yesterday, same if already today, else 1.
 *  A last visit in the future (clock moved back) keeps the streak as is and re-anchors to today. */
export function nextStreak(s: Streak, today: string): Streak {
  if (s.lastVisit === today) return s;
  if (s.lastVisit && s.lastVisit > today) return { current: s.current, best: Math.max(s.best, s.current), lastVisit: today };
  const current = s.lastVisit === daysBefore(today, 1) ? s.current + 1 : 1;
  return { current, best: Math.max(s.best, current), lastVisit: today };
}

/** Streak to display: 0 once a day has been missed (a future last visit still counts). */
export function liveStreak(s: Streak, today: string): number {
  return (s.lastVisit !== undefined && s.lastVisit >= today) || s.lastVisit === daysBefore(today, 1) ? s.current : 0;
}

/** Real time left until the next local midnight (23 h or 25 h on DST days is correct). */
export function msUntilMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}
