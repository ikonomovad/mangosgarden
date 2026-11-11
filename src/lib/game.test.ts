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
    const r = { yesterday: "robin", twoDaysAgo: "jay" };
    expect(freshness("robin", r)).toBe(0.2);
    expect(freshness("jay", r)).toBe(0.6);
    expect(freshness("hoopoe", r)).toBe(1);
  });
  it("score = rarity x affinity x freshness", () => {
    expect(scoreBird(getBird("robin")!, "mealworms", {})).toBe(30);
    expect(scoreBird(getBird("hoopoe")!, "millet", { yesterday: "hoopoe" })).toBeCloseTo(1 * 0.2 * 0.2);
  });
  it("same day + same food gives the same bird", () => {
    for (const f of FOOD_IDS) expect(pickVisitor("2026-11-11", f).id).toBe(pickVisitor("2026-11-11", f).id);
  });
});
