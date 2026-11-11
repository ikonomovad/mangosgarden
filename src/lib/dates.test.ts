import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { daysBefore, getDailyOffer, liveStreak, msUntilMidnight, nextStreak, todayKey } from "./game";
import {
  STORAGE_VERSION, VERSION_KEY, loadCollection, loadDaysSinceRare, loadHistory, loadStreak,
  migrate, recordVisit, resetDay, saveDay, saveDaysSinceRare, saveStreak,
} from "./storage";

// vitest.config.ts pins TZ=Europe/Skopje (UTC+1, UTC+2 in summer).
beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

describe("local calendar date", () => {
  it("time zone is fixed for these tests", () => {
    expect(new Date(2026, 0, 1).getTimezoneOffset()).toBe(-60);
  });
  it("23:30 local is still today even though UTC is the same day", () => {
    expect(todayKey(new Date(2026, 10, 11, 23, 30))).toBe("2026-11-11");
  });
  it("00:30 local is the new day although UTC is still yesterday", () => {
    const d = new Date(2026, 10, 12, 0, 30);
    expect(d.toISOString().slice(0, 10)).toBe("2026-11-11");
    expect(todayKey(d)).toBe("2026-11-12");
  });
  it("visits at 23:30 and 00:30 the next night extend the streak", () => {
    const a = nextStreak({ current: 0, best: 0 }, todayKey(new Date(2026, 10, 11, 23, 30)));
    const b = nextStreak(a, todayKey(new Date(2026, 10, 12, 0, 30)));
    expect(b).toEqual({ current: 2, best: 2, lastVisit: "2026-11-12" });
  });
});

describe("daylight-saving day 2027-03-28", () => {
  it("yesterday/two days ago are real calendar days", () => {
    expect(daysBefore("2027-03-29", 1)).toBe("2027-03-28");
    expect(daysBefore("2027-03-28", 1)).toBe("2027-03-27");
    expect(daysBefore("2027-03-29", 2)).toBe("2027-03-27");
  });
  it("streak continues across the change", () => {
    let s = nextStreak({ current: 0, best: 0 }, "2027-03-27");
    s = nextStreak(s, "2027-03-28");
    s = nextStreak(s, "2027-03-29");
    expect(s.current).toBe(3);
  });
  it("countdown is 23 real hours from midnight on the short day", () => {
    expect(msUntilMidnight(new Date(2027, 2, 28, 0, 0))).toBe(23 * 3600000);
  });
  it("the offer has at least 2 foods not offered the calendar day before", () => {
    const y = getDailyOffer("2027-03-27");
    const t = getDailyOffer("2027-03-28", y);
    expect(t.filter((f) => !y.includes(f)).length).toBeGreaterThanOrEqual(2);
  });
});

describe("streak edge cases", () => {
  it("a missed day restarts at 1 and shows 0 until then", () => {
    const s = { current: 5, best: 5, lastVisit: "2026-11-09" };
    expect(liveStreak(s, "2026-11-11")).toBe(0);
    expect(nextStreak(s, "2026-11-11")).toEqual({ current: 1, best: 5, lastVisit: "2026-11-11" });
  });
  it("a future last visit (clock moved back) keeps the streak", () => {
    const s = { current: 4, best: 6, lastVisit: "2026-11-15" };
    expect(liveStreak(s, "2026-11-11")).toBe(4);
    const next = nextStreak(s, "2026-11-11");
    expect(next).toEqual({ current: 4, best: 6, lastVisit: "2026-11-11" });
    expect(nextStreak(next, "2026-11-12").current).toBe(5);
  });
});

describe("same-day reload", () => {
  it("gives the same 4 foods, from the saved offer and from the seed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 11, 8, 0));
    const key = todayKey();
    const offer = getDailyOffer(key, loadHistory()[daysBefore(key, 1)]?.offer);
    saveDay(key, { offer });
    vi.setSystemTime(new Date(2026, 10, 11, 23, 59));
    expect(todayKey()).toBe(key);
    expect(loadHistory()[key]?.offer).toEqual(offer);
    expect(getDailyOffer(key)).toEqual(getDailyOffer(key));
  });
});

describe("saved data", () => {
  it("missing data gives safe defaults", () => {
    expect(loadHistory()).toEqual({});
    expect(loadCollection()).toEqual({});
    expect(loadStreak()).toEqual({ current: 0, best: 0 });
    expect(loadDaysSinceRare()).toBe(0);
  });
  it("corrupted data gives safe defaults and drops bad entries", () => {
    localStorage.setItem("mangos-garden:days", "{oops");
    localStorage.setItem("mangos-garden:streak", '"x"');
    localStorage.setItem("mangos-garden:collection", JSON.stringify({ dodo: { firstSeen: "2026-11-11", visits: 1 }, robin: { firstSeen: "nope", visits: 1 } }));
    expect(loadHistory()).toEqual({});
    expect(loadStreak()).toEqual({ current: 0, best: 0 });
    expect(loadCollection()).toEqual({});
  });
  it("an invalid saved offer is dropped so it can be regenerated", () => {
    localStorage.setItem("mangos-garden:days", JSON.stringify({ "2026-11-11": { offer: ["pizza", "millet"] } }));
    expect(loadHistory()["2026-11-11"]?.offer).toBeUndefined();
  });
  it("blocked storage never throws", () => {
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("full"); });
    expect(() => { saveDay("2026-11-11", { food: "millet" }); saveStreak({ current: 1, best: 1 }); }).not.toThrow();
    expect(loadCollection()).toEqual({});
    get.mockRestore(); set.mockRestore();
  });
  it("migrates old saves (names to ids) without losing progress and stamps the version", () => {
    localStorage.setItem("mangos-garden:collection", JSON.stringify({ "Blue Tit": { firstSeen: "2026-11-01", visits: 4, seenFoods: ["Peanuts", "millet"] } }));
    localStorage.setItem("mangos-garden:days", JSON.stringify({ "2026-11-10": { food: "Peanuts", visitor: "Blue Tit" } }));
    migrate();
    expect(localStorage.getItem(VERSION_KEY)).toBe(String(STORAGE_VERSION));
    expect(loadCollection().bluetit).toMatchObject({ firstSeen: "2026-11-01", visits: 4, seenFoods: ["peanuts", "millet"] });
    expect(loadHistory()["2026-11-10"]).toMatchObject({ food: "peanuts", visitor: "bluetit" });
  });
});

describe("reset today restores everything", () => {
  it("new bird, streak, best streak, freshness history and pity", () => {
    saveDay("2026-11-09", { food: "apple", visitor: "blackbird" });
    saveDay("2026-11-10", { food: "millet", visitor: "sparrow" });
    const streakBefore = { current: 3, best: 3, lastVisit: "2026-11-10" };
    saveStreak(streakBefore);
    saveDaysSinceRare(12);
    // Today: a brand-new rare bird
    saveDay("2026-11-11", { food: "mealworms", visitor: "hoopoe", streakBefore, pityBefore: 12, collectionBefore: null });
    recordVisit("hoopoe", "2026-11-11", "mealworms");
    saveStreak(nextStreak(streakBefore, "2026-11-11"));
    saveDaysSinceRare(0);

    resetDay("2026-11-11");
    expect(loadCollection().hoopoe).toBeUndefined();
    expect(loadStreak()).toEqual(streakBefore);
    expect(loadDaysSinceRare()).toBe(12);
    const h = loadHistory();
    expect(h["2026-11-11"]).toBeUndefined();
    expect(h["2026-11-10"]?.visitor).toBe("sparrow");
    expect(h["2026-11-09"]?.visitor).toBe("blackbird");
  });
});
