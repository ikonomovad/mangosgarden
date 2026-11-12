import { describe, expect, it } from "vitest";
import { BIRDS, getBird } from "@/data/birds";
import { FOOD_IDS } from "@/data/foods";
import { daysBefore, freshness, getDailyOffer, pickVisitor, scoreBird } from "./game";

describe("daily offer", () => {
  it("offers 4 distinct foods", () => {
    const o = getDailyOffer("2026-11-11");
    expect(o).toHaveLength(4);
    expect(new Set(o).size).toBe(4);
  });
  it("is the same all day", () => {
    expect(getDailyOffer("2026-11-11", ["millet"])).toEqual(getDailyOffer("2026-11-11", ["millet"]));
  });
  it("has at least 2 foods not offered yesterday", () => {
    for (let d = 1; d <= 60; d++) {
      const key = daysBefore("2026-12-31", d);
      const yesterday = getDailyOffer(daysBefore(key, 1));
      const o = getDailyOffer(key, yesterday);
      expect(o.filter((f) => !yesterday.includes(f)).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("visitor", () => {
  it("has 12 birds: 9 common, 1 uncommon, 2 rare", () => {
    expect(BIRDS).toHaveLength(12);
    expect(BIRDS.filter((b) => b.rarity === "common")).toHaveLength(9);
    expect(BIRDS.filter((b) => b.rarity === "uncommon")).toHaveLength(1);
    expect(BIRDS.filter((b) => b.rarity === "rare")).toHaveLength(2);
  });
  it("freshness is 0.2 yesterday, 0.6 two days ago, else 1", () => {
    const r = { yesterday: "robin", twoDaysAgo: "woodpecker" };
    expect(freshness("robin", r)).toBe(0.2);
    expect(freshness("woodpecker", r)).toBe(0.6);
    expect(freshness("hoopoe", r)).toBe(1);
  });
  it("score = rarity x affinity x freshness", () => {
    expect(scoreBird(getBird("robin")!, "mealworms", {})).toBe(30);
    expect(scoreBird(getBird("hoopoe")!, "millet", { yesterday: "hoopoe" })).toBeCloseTo(0.5 * 0.2 * 0.2);
  });
  it("same day + same food gives the same bird", () => {
    for (const f of FOOD_IDS) expect(pickVisitor("2026-11-11", f).id).toBe(pickVisitor("2026-11-11", f).id);
  });
});

describe("new bird bonus", () => {
  it("doubles the score of uncollected birds", () => {
    expect(scoreBird(getBird("robin")!, "mealworms", {}, [])).toBe(60);
    expect(scoreBird(getBird("robin")!, "mealworms", {}, ["robin"])).toBe(30);
  });
});

import { liveStreak, msUntilMidnight, nextStreak } from "./game";
describe("streak", () => {
  it("first visit starts at 1", () => {
    expect(nextStreak({ current: 0, best: 0 }, "2026-11-11")).toEqual({ current: 1, best: 1, lastVisit: "2026-11-11" });
  });
  it("visiting the day after adds 1", () => {
    expect(nextStreak({ current: 4, best: 4, lastVisit: "2026-11-10" }, "2026-11-11").current).toBe(5);
  });
  it("a missed day restarts at 1 and keeps best", () => {
    expect(nextStreak({ current: 4, best: 6, lastVisit: "2026-11-09" }, "2026-11-11")).toEqual({ current: 1, best: 6, lastVisit: "2026-11-11" });
  });
  it("works across month boundaries", () => {
    expect(nextStreak({ current: 2, best: 2, lastVisit: "2026-10-31" }, "2026-11-01").current).toBe(3);
  });
  it("shows 0 once a day was missed", () => {
    expect(liveStreak({ current: 4, best: 4, lastVisit: "2026-11-09" }, "2026-11-11")).toBe(0);
  });
  it("countdown reaches next local midnight", () => {
    expect(msUntilMidnight(new Date(2026, 10, 11, 23, 0, 0))).toBe(3600000);
  });
});
