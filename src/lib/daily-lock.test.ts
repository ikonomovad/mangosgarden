// Once-a-day lock, local-midnight day change and the testing reset, using a mocked clock.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextStreak, toDateKey } from "./game";
import { loadCollection, loadHistory, loadStreak, recordVisit, resetDay, saveDay, saveStreak } from "./storage";

/** The app treats a day as locked once today's record has a visitor. */
const isLocked = (day: string) => Boolean(loadHistory()[day]?.visitor);

function feed(day: string, bird = "robin") {
  const before = loadStreak();
  const collectionBefore = loadCollection()[bird] ?? null;
  recordVisit(bird, day, "mealworms");
  saveStreak(nextStreak(before, day));
  saveDay(day, { food: "mealworms", visitor: bird, streakBefore: before, collectionBefore });
}

beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => vi.useRealTimers());

describe("daily lock", () => {
  it("locks the day after feeding", () => {
    vi.setSystemTime(new Date(2026, 10, 11, 9, 0));
    const today = toDateKey(new Date());
    expect(isLocked(today)).toBe(false);
    feed(today);
    expect(isLocked(today)).toBe(true);
  });
  it("unlocks at local midnight, not before", () => {
    vi.setSystemTime(new Date(2026, 10, 11, 23, 59, 59));
    feed(toDateKey(new Date()));
    expect(isLocked(toDateKey(new Date()))).toBe(true);
    vi.setSystemTime(new Date(2026, 10, 12, 0, 0, 0));
    expect(isLocked(toDateKey(new Date()))).toBe(false);
  });
});

describe("streak across visits", () => {
  it("two visits on the same day do not double count", () => {
    const s = nextStreak(nextStreak({ current: 0, best: 0 }, "2026-11-11"), "2026-11-11");
    expect(s).toEqual({ current: 1, best: 1, lastVisit: "2026-11-11" });
  });
  it("best streak grows with the current streak and is kept after a miss", () => {
    let s = { current: 0, best: 0 } as ReturnType<typeof nextStreak>;
    for (const d of ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-05"]) s = nextStreak(s, d);
    expect(s).toEqual({ current: 1, best: 3, lastVisit: "2026-11-05" });
  });
});

describe("reset today", () => {
  it("undoes today's visit, collection count and streak change, and unlocks", () => {
    feed("2026-11-10");
    const streakBefore = loadStreak();
    const collectionBefore = loadCollection();
    feed("2026-11-11");
    expect(loadCollection().robin?.visits).toBe(2);
    expect(loadStreak().current).toBe(2);
    resetDay("2026-11-11");
    expect(isLocked("2026-11-11")).toBe(false);
    expect(loadCollection()).toEqual(collectionBefore);
    expect(loadStreak()).toEqual(streakBefore);
    expect(loadHistory()["2026-11-10"]?.visitor).toBe("robin");
  });
});
