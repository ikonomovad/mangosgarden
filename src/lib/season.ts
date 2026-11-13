/** Northern-hemisphere meteorological seasons from the local calendar month. */
export type Season = "spring" | "summer" | "autumn" | "winter";

export function seasonFor(date: Date): Season {
  const m = date.getMonth(); // 0 = January
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

// BEGIN removable developer season preview
export const DEBUG_SEASON_KEY = "mangos-garden-debug:season";
const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

/** Season for the garden; the developer panel can pin one for previewing. */
export function currentSeason(now: Date, debug: boolean): Season {
  if (debug) {
    try {
      const pinned = localStorage.getItem(DEBUG_SEASON_KEY) as Season | null;
      if (pinned && SEASONS.includes(pinned)) return pinned;
    } catch { /* blocked */ }
  }
  return seasonFor(now);
}
// END removable developer season preview
