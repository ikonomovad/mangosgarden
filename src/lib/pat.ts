// Once-a-day "pat Mango": its own key, separate from all game data.
import { isDateKey, todayKey } from "./game";

export const PAT_KEY = "mangos-garden:pat";

export function loadPatDate(): string | undefined {
  try { const v = localStorage.getItem(PAT_KEY); return isDateKey(v) ? v : undefined; } catch { return undefined; }
}
export const patAvailable = (today: string = todayKey()) => loadPatDate() !== today;

/** Claims today's pat. Returns true only for the first pat of the local day. */
export function claimPat(today: string = todayKey()): boolean {
  if (!patAvailable(today)) return false;
  try { localStorage.setItem(PAT_KEY, today); } catch { /* blocked: still play the moment */ }
  return true;
}
export function clearPat(today: string = todayKey()) {
  try { if (localStorage.getItem(PAT_KEY) === today) localStorage.removeItem(PAT_KEY); } catch { /* blocked */ }
}
