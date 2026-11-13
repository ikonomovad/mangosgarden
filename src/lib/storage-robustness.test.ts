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
      nuthatch: { firstSeen: 5, visits: 1 },
      wren: { firstSeen: "2026-11-01", visits: 0 },
    }));
    expect(loadCollection()).toEqual({ robin: { firstSeen: "2026-11-01", visits: 2, seenFoods: ["apple"] } });
  });
});

describe("collection", () => {
  it("sets first-seen once and counts every visit", () => {
    recordVisit("robin", "2026-11-09");
    recordVisit("robin", "2026-11-12");
    expect(loadCollection()["robin"]).toMatchObject({ firstSeen: "2026-11-09", visits: 2 });
  });
  it("daily history keeps only today and the two previous days", () => {
    for (const d of ["2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11"]) saveDay(d, { offer: ["apple"] });
    expect(Object.keys(loadHistory()).sort()).toEqual(["2026-11-09", "2026-11-10", "2026-11-11"]);
  });
});

describe("retired content IDs", () => {
  beforeEach(() => localStorage.setItem("mangos-garden:version", "1"));
  it("ignores removed birds and foods while preserving valid discoveries and counts", () => {
    const entry = { firstSeen: "2026-11-01", visits: 3, seenFoods: ["apple", "nyjer", "fatball", "water"] };
    localStorage.setItem("mangos-garden:collection", JSON.stringify({
      robin: entry, kingfisher: entry, siskin: entry, wren: entry, nuthatch: entry,
    }));
    expect(loadCollection()).toEqual({ robin: { ...entry, seenFoods: ["apple", "water"] } });
    expect(Object.keys(loadCollection())).toHaveLength(1);
  });
  it("drops retired daily visitors and invalid offers", () => {
    localStorage.setItem("mangos-garden:days", JSON.stringify({
      "2026-11-11": { visitor: "nuthatch", food: "apple", offer: ["nyjer", "apple", "millet", "water"] },
    }));
    expect(loadHistory()["2026-11-11"]).toEqual({ food: "apple" });
  });
  it("a retained bird fed a removed food cannot leave an invisible daily lock", () => {
    localStorage.setItem("mangos-garden:days", JSON.stringify({
      "2026-11-11": { visitor: "hoopoe", food: "fatball" },
    }));
    expect(loadHistory()["2026-11-11"]?.food).toBeUndefined();
    expect(loadHistory()["2026-11-11"]?.visitor).toBeUndefined();
  });
  it("reset restores valid discoveries while ignoring retired foods in snapshots", () => {
    const previous = { firstSeen: "2026-11-01", visits: 2, seenFoods: ["nyjer", "apple", "fatball"] };
    recordVisit("robin", "2026-11-11", "water");
    saveDay("2026-11-11", { visitor: "robin", food: "water", collectionBefore: previous as unknown as import("./storage").BookEntry });
    resetDay("2026-11-11");
    expect(loadCollection()["robin"]).toEqual({ ...previous, seenFoods: ["apple"] });
  });
});
