// Empty, missing or corrupted localStorage must never crash; loaders fall back to safe defaults.
import { beforeEach, describe, expect, it } from "vitest";
import { loadCollection, loadHistory, loadPersonality, loadSound, loadStreak, recordVisit, resetDay, saveDay } from "./storage";

const KEYS = ["days", "collection", "streak", "personality", "sound"].map((k) => `mangos-garden:${k}`);
const BAD = ["{broken", "null", "[]", "42", '"text"'];

beforeEach(() => localStorage.clear());

describe("storage fallbacks", () => {
  it("returns defaults with nothing saved", () => {
    expect(loadHistory()).toEqual({});
    expect(loadCollection()).toEqual({});
    expect(loadStreak()).toEqual({ current: 0, best: 0, lastVisit: undefined });
    expect(loadPersonality()).toEqual({ shown: [], previous: {} });
    expect(loadSound()).toBe(false);
  });
  for (const raw of BAD) {
    it(`survives corrupted value ${raw} in every key`, () => {
      for (const k of KEYS) localStorage.setItem(k, raw);
      expect(loadHistory()).toEqual({});
      expect(loadCollection()).toEqual({});
      expect(loadStreak().current).toBe(0);
      expect(loadPersonality().shown).toEqual([]);
      expect(loadSound()).toBe(false);
      expect(() => resetDay("2026-11-11")).not.toThrow();
    });
  }
  it("drops invalid bird book entries but keeps valid ones", () => {
    localStorage.setItem("mangos-garden:collection", JSON.stringify({
      robin: { firstSeen: "2026-11-01", visits: 2, seenFoods: ["apple", "pizza"] },
      jay: { firstSeen: 5, visits: 1 },
      wren: { firstSeen: "2026-11-01", visits: 0 },
    }));
    expect(loadCollection()).toEqual({ robin: { firstSeen: "2026-11-01", visits: 2, seenFoods: ["apple"] } });
  });
});

describe("collection", () => {
  it("sets first-seen once and counts every visit", () => {
    recordVisit("robin", "2026-11-09");
    recordVisit("robin", "2026-11-12");
    expect(loadCollection().robin).toMatchObject({ firstSeen: "2026-11-09", visits: 2 });
  });
  it("daily history keeps only today and the two previous days", () => {
    for (const d of ["2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11"]) saveDay(d, { offer: ["apple"] });
    expect(Object.keys(loadHistory()).sort()).toEqual(["2026-11-09", "2026-11-10", "2026-11-11"]);
  });
});
