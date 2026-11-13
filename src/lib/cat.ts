import { seededRandom } from "./random";
import { toDateKey } from "./game";

/** Monday (local) of the week containing `date`, as YYYY-MM-DD. */
export function weekStart(date: Date): string {
  const offset = (date.getDay() + 6) % 7; // Monday = 0
  return toDateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset));
}

/** The cat visits on exactly one seeded day each Monday–Sunday week. */
export function catDayIndex(date: Date): number {
  return Math.floor(seededRandom(`cat:${weekStart(date)}`)() * 7);
}

export function isCatDay(date: Date): boolean {
  return (date.getDay() + 6) % 7 === catDayIndex(date);
}

// BEGIN removable developer cat preview
export const DEBUG_CAT_KEY = "mangos-garden-debug:cat";
export function catVisible(now: Date, debug: boolean): boolean {
  if (debug) { try { if (localStorage.getItem(DEBUG_CAT_KEY) === "1") return true; } catch { /* blocked */ } }
  return isCatDay(now);
}
// END removable developer cat preview
