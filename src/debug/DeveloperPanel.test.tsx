import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DEBUG_CLOCK_KEY, daysBefore, getDailyOffer, getNow, msUntilMidnight, nextStreak, todayKey } from "@/lib/game";
import { loadCollection, loadDaysSinceRare, loadHistory, loadStreak, recordVisit, saveDay, saveDaysSinceRare, saveStreak } from "@/lib/storage";
import { changeClock, clearGameData, debugEnabled, setDebugPity, setDebugStreak, setDebugVisits } from "./actions";
import { DeveloperPanel } from "./DeveloperPanel";

// Exercise the optional tools even when the app's production flag is disabled.
vi.mock("@/lib/game", async (original) => {
  const game = await original<typeof import("@/lib/game")>();
  return { ...game, ENABLE_DEBUG_PANEL: true, getNow: (realNow = new Date(), enabled = true) => game.getNow(realNow, enabled), todayKey: () => game.toDateKey(game.getNow(new Date(), true)), msUntilMidnight: () => game.msUntilMidnight(game.getNow(new Date(), true)) };
});

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 10, 11, 12));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("shared clock", () => {
  it("returns real time with no offset", () => { expect(getNow().getTime()).toBe(Date.now()); });
  it("returns shifted time with an offset", () => {
    localStorage.setItem(DEBUG_CLOCK_KEY, "3600000");
    expect(getNow().getHours()).toBe(13);
    expect(msUntilMidnight()).toBe(11 * 3600000);
  });
  it("ignores stored offsets when the flag is false", () => {
    localStorage.setItem(DEBUG_CLOCK_KEY, "86400000");
    expect(getNow(new Date(), false).getTime()).toBe(Date.now());
  });
  it("falls back to real time for corrupt or blocked offsets", () => {
    localStorage.setItem(DEBUG_CLOCK_KEY, "oops");
    expect(getNow().getTime()).toBe(Date.now());
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(getNow().getTime()).toBe(Date.now());
  });
  it("+1 calendar day unlocks a new offer and extends the next visit's streak", () => {
    const previousOffer = getDailyOffer(todayKey());
    saveDay(todayKey(), { offer: previousOffer, visitor: "robin", food: "mealworms" });
    const before = { current: 3, best: 3, lastVisit: todayKey() };
    changeClock(1);
    expect(todayKey()).toBe("2026-11-12");
    expect(loadHistory()[todayKey()]?.visitor).toBeUndefined();
    const offer = getDailyOffer(todayKey(), loadHistory()[daysBefore(todayKey(), 1)]?.offer);
    expect(offer).toHaveLength(4);
    expect(offer.filter((f) => !previousOffer.includes(f)).length).toBeGreaterThanOrEqual(2);
    expect(nextStreak(before, todayKey())).toEqual({ current: 4, best: 4, lastVisit: "2026-11-12" });
  });
  it("steps calendar days across DST, rather than adding 24 hours", () => {
    vi.setSystemTime(new Date(2027, 2, 27, 12));
    changeClock(1);
    expect(todayKey()).toBe("2027-03-28");
    expect(getNow().getHours()).toBe(12);
    expect(getNow().getTime() - Date.now()).toBe(23 * 3600000);
  });
  it("supports +2, -1, 23:59, and real time", () => {
    changeClock(2); expect(todayKey()).toBe("2026-11-13");
    changeClock(-1); expect(todayKey()).toBe("2026-11-12");
    changeClock("late"); expect(getNow().getHours()).toBe(23); expect(getNow().getMinutes()).toBe(59);
    expect(msUntilMidnight()).toBe(60000);
    changeClock("real"); expect(getNow().getTime()).toBe(Date.now());
  });
});

describe("developer tools", () => {
  it("remembers debug=1 only for the session", () => {
    expect(debugEnabled()).toBe(false);
    window.history.replaceState({}, "", "/?debug=1");
    expect(debugEnabled()).toBe(true);
    window.history.replaceState({}, "", "/book");
    expect(debugEnabled()).toBe(true);
    sessionStorage.clear(); expect(debugEnabled()).toBe(false);
  });
  it("sets a streak that continues tomorrow, pity, and chosen bird visits", () => {
    expect(setDebugStreak(7)).toBe(true);
    expect(loadStreak()).toEqual({ current: 7, best: 7, lastVisit: "2026-11-10" });
    setDebugPity(12); expect(loadDaysSinceRare()).toBe(12);
    setDebugVisits("robin", 3); expect(loadCollection()["robin"]?.visits).toBe(3);
    setDebugVisits("robin", 0); expect(loadCollection()["robin"]).toBeUndefined();
    expect(setDebugStreak(-1)).toBe(false); expect(setDebugPity(1.5)).toBe(false);
    expect(setDebugVisits("unknown", 3)).toBe(false);
  });
  it("clears only game data, preserving offset, session and unrelated keys", () => {
    changeClock(1); setDebugPity(12);
    localStorage.setItem("other", "keep"); sessionStorage.setItem("other", "keep");
    clearGameData();
    expect(loadDaysSinceRare()).toBe(0); expect(todayKey()).toBe("2026-11-12");
    expect(localStorage.getItem("other")).toBe("keep"); expect(sessionStorage.getItem("other")).toBe("keep");
  });
  it("panel reset restores new-bird entry, streak, best, freshness and pity", () => {
    window.history.replaceState({}, "", "/?debug=1");
    saveDay("2026-11-09", { food: "apple", visitor: "blackbird" });
    saveDay("2026-11-10", { food: "millet", visitor: "sparrow" });
    const before = { current: 3, best: 3, lastVisit: "2026-11-10" };
    recordVisit("hoopoe", todayKey(), "mealworms");
    saveDay(todayKey(), { visitor: "hoopoe", food: "mealworms", streakBefore: before, pityBefore: 12, collectionBefore: null });
    saveStreak(nextStreak(before, todayKey())); saveDaysSinceRare(0);
    const onApply = vi.fn();
    render(<DeveloperPanel onApply={onApply} />);
    fireEvent.click(screen.getByRole("button", { name: "Developer test panel" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset today" }));
    expect(onApply).toHaveBeenCalledOnce();
    expect(loadCollection()["hoopoe"]).toBeUndefined();
    expect(loadStreak()).toEqual(before); expect(loadDaysSinceRare()).toBe(12);
    expect(loadHistory()[todayKey()]).toBeUndefined();
    expect(loadHistory()["2026-11-10"]?.visitor).toBe("sparrow");
    expect(loadHistory()["2026-11-09"]?.visitor).toBe("blackbird");
  });
});