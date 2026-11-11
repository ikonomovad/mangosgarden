// Visitor algorithm: pure, seeded, deterministic (no Math.random, no timers).
import { describe, expect, it } from "vitest";
import { BIRDS, RARITY_WEIGHT, getBird, LOVES, MEH } from "@/data/birds";
import { FOOD_IDS } from "@/data/foods";
import { daysBefore } from "./game";
import { NEW_BIRD_BONUS, freshness, pickVisitor, scoreBird } from "./visitor";

const robin = getBird("robin")!;

describe("scoreBird", () => {
  it("multiplies rarity weight, food affinity, freshness and the new-bird boost", () => {
    const expected = RARITY_WEIGHT.common * LOVES * 0.6 * NEW_BIRD_BONUS;
    expect(scoreBird(robin, "mealworms", { twoDaysAgo: "robin" }, [])).toBeCloseTo(expected);
  });
  it("uses the 'doesn't care' affinity for foods a bird doesn't list", () => {
    expect(scoreBird(robin, "nyjer", {})).toBeCloseTo(RARITY_WEIGHT.common * MEH);
  });
  it("gives a bird that came yesterday a lower score than before", () => {
    expect(scoreBird(robin, "mealworms", { yesterday: "robin" })).toBeLessThan(scoreBird(robin, "mealworms", {}));
    expect(freshness("robin", { yesterday: "robin" })).toBe(0.2);
  });
  it("boosts only birds that are not collected yet", () => {
    expect(scoreBird(robin, "mealworms", {}, ["jay"])).toBe(scoreBird(robin, "mealworms", {}, ["robin"]) * NEW_BIRD_BONUS);
  });
});

describe("pickVisitor", () => {
  it("returns exactly one bird from the list, for every food", () => {
    for (const food of FOOD_IDS) {
      const bird = pickVisitor("2026-11-11", food);
      expect(BIRDS).toContain(bird);
    }
  });
  it("same date and food always give the same bird", () => {
    for (const food of FOOD_IDS) {
      const ids = Array.from({ length: 5 }, () => pickVisitor("2026-03-02", food, {}, ["robin"]).id);
      expect(new Set(ids).size).toBe(1);
    }
  });
  it("makes yesterday's bird come less often over many seeded days", () => {
    let normal = 0, afterVisit = 0;
    for (let d = 0; d < 400; d++) {
      const date = daysBefore("2027-12-31", d);
      if (pickVisitor(date, "mealworms").id === "robin") normal++;
      if (pickVisitor(date, "mealworms", { yesterday: "robin" }).id === "robin") afterVisit++;
    }
    expect(afterVisit).toBeLessThan(normal);
  });
  it("makes rare birds clearly less frequent than common birds over many seeded runs", () => {
    const counts = { common: 0, uncommon: 0, rare: 0 };
    for (let d = 0; d < 365; d++) {
      for (const food of FOOD_IDS) counts[pickVisitor(daysBefore("2027-12-31", d), food).rarity]++;
    }
    const perBird = (r: keyof typeof counts) => counts[r] / BIRDS.filter((b) => b.rarity === r).length;
    expect(perBird("rare") * 3).toBeLessThan(perBird("common"));
  });
});
