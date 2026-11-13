import { BIRDS } from "@/data/birds";
import { DEBUG_CLOCK_KEY, ENABLE_DEBUG_PANEL, daysBefore, getDailyOffer, getNow, todayKey } from "@/lib/game";
import { clearPat } from "@/lib/pat";
import { loadCollection, loadDaysSinceRare, loadHistory, loadStreak, resetDay, saveDaysSinceRare, saveStreak } from "@/lib/storage";

export const DEBUG_SESSION_KEY = "mangos-garden-debug:enabled";
const GAME_KEYS = ["days", "collection", "streak", "pity", "personality", "sound", "version", "pat", "books"];

export function debugEnabled() {
  if (!ENABLE_DEBUG_PANEL) return false;
  const requested = new URLSearchParams(window.location.search).get("debug") === "1";
  try {
    if (requested) sessionStorage.setItem(DEBUG_SESSION_KEY, "1");
    return requested || sessionStorage.getItem(DEBUG_SESSION_KEY) === "1";
  } catch { return requested; }
}

export type ClockAction = number | "late" | "real";
export function changeClock(action: ClockAction): boolean {
  if (!ENABLE_DEBUG_PANEL) return false;
  const target = getNow();
  if (typeof action === "number") target.setDate(target.getDate() + action);
  if (action === "late") target.setHours(23, 59, 0, 0);
  try {
    if (action === "real") localStorage.removeItem(DEBUG_CLOCK_KEY);
    else localStorage.setItem(DEBUG_CLOCK_KEY, String(target.getTime() - Date.now()));
    return true;
  } catch { return false; }
}

export function readDebugState() {
  const now = getNow();
  const today = todayKey(now);
  const history = loadHistory();
  const yesterday = history[daysBefore(today, 1)];
  let shifted = false;
  try { shifted = ENABLE_DEBUG_PANEL && Number(localStorage.getItem(DEBUG_CLOCK_KEY)) !== 0; } catch { /* blocked */ }
  return {
    now, today, shifted,
    offer: history[today]?.offer ?? getDailyOffer(today, yesterday?.offer),
    yesterdayOffer: yesterday?.offer ?? [],
    streak: loadStreak(), pity: loadDaysSinceRare(),
    visit: history[today], locked: !!history[today]?.visitor,
  };
}

export function resetToday() { resetDay(todayKey()); clearPat(todayKey()); }

export function setDebugStreak(count: number) {
  if (!Number.isSafeInteger(count) || count < 0) return false;
  const previous = loadStreak();
  saveStreak({ current: count, best: Math.max(count, previous.best), lastVisit: count ? (loadHistory()[todayKey()]?.visitor ? todayKey() : daysBefore(todayKey(), 1)) : undefined });
  return true;
}

export function setDebugPity(count: number) {
  if (!Number.isSafeInteger(count) || count < 0) return false;
  saveDaysSinceRare(count);
  return true;
}

export function setDebugVisits(id: string, count: number) {
  if (!BIRDS.some((b) => b.id === id) || !Number.isSafeInteger(count) || count < 0) return false;
  const book = loadCollection();
  if (!count) delete book[id];
  else book[id] = { ...(book[id] ?? { firstSeen: todayKey(), unseenInBook: true, seenFoods: [] }), visits: count };
  try { localStorage.setItem("mangos-garden:collection", JSON.stringify(book)); return true; } catch { return false; }
}

export function clearGameData() {
  try {
    for (const key of GAME_KEYS) localStorage.removeItem(`mangos-garden:${key}`);
    return true;
  } catch { return false; }
}
export function completeBook() {
  const book = loadCollection();
  for (const b of BIRDS) book[b.id] ??= { firstSeen: todayKey(), visits: 1, seenFoods: [], unseenInBook: true };
  try { localStorage.setItem("mangos-garden:collection", JSON.stringify(book)); return true; } catch { return false; }
}
