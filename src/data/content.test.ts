import { describe, expect, it } from "vitest";
import { BIRDS, getAffinity, getBird, RARITY_WEIGHT } from "./birds";
import { FOODS } from "./foods";

describe("garden content", () => {
  it("has 10 unique foods with wheat and walnuts replacing nyjer and fatball", () => {
    expect(FOODS.map((food) => food.id).sort()).toEqual(["sunflower", "millet", "peanuts", "wheat", "apple", "berries", "orange", "mealworms", "walnut", "water"].sort());
    expect(new Set(FOODS.map((food) => food.id)).size).toBe(10);
  });
  it("keeps the eight existing birds and adds the four requested birds", () => {
    expect(BIRDS.map((bird) => bird.id).sort()).toEqual(["robin", "bluetit", "greattit", "blackbird", "goldfinch", "sparrow", "dove", "magpie", "jackdaw", "woodpecker", "hoopoe", "waxwing"].sort());
    expect(new Set(BIRDS.map((bird) => bird.id)).size).toBe(12);
    expect(BIRDS.filter((bird) => bird.rarity === "common")).toHaveLength(9);
    expect(BIRDS.filter((bird) => bird.rarity === "uncommon").map((bird) => bird.id)).toEqual(["woodpecker"]);
    expect(BIRDS.filter((bird) => bird.rarity === "rare").map((bird) => bird.id)).toEqual(["hoopoe", "waxwing"]);
  });
  const affinities = {
    dove: { wheat: 3, millet: 3, sunflower: 1, water: 1 },
    magpie: { walnut: 3, peanuts: 1, mealworms: 1 },
    jackdaw: { wheat: 3, walnut: 1, apple: 1 },
    woodpecker: { walnut: 3, peanuts: 3, sunflower: 1, mealworms: 1 },
    robin: { mealworms: 3, berries: 1, water: 1, apple: 1 },
    bluetit: { peanuts: 3, sunflower: 3, mealworms: 1 },
    greattit: { sunflower: 3, peanuts: 1, walnut: 1 },
    goldfinch: { sunflower: 3, millet: 1 },
    sparrow: { millet: 3, water: 3, wheat: 1, sunflower: 1 },
    blackbird: { apple: 3, mealworms: 3, berries: 1, water: 1 },
    waxwing: { berries: 3, apple: 3, orange: 3 },
    hoopoe: { mealworms: 3, water: 3, apple: 1 },
  };
  for (const [id, affinity] of Object.entries(affinities)) {
    it(`${id} has the requested affinities and defaults to 0.2 for other foods`, () => {
      const bird = getBird(id);
      expect(bird?.affinity).toEqual(affinity);
      if (!bird) throw new Error(`Missing bird: ${id}`);
      for (const food of FOODS) {
        expect(getAffinity(bird, food.id)).toBe((affinity as Record<string, number>)[food.id] ?? 0.2);
      }
    });
  }
  it("both rare birds love at least two foods", () => {
    for (const bird of BIRDS.filter((bird) => bird.rarity === "rare")) {
      expect(Object.values(bird.affinity).filter((value) => value === 3).length).toBeGreaterThanOrEqual(2);
    }
  });
  it("keeps rarity weights unchanged", () => {
    expect(RARITY_WEIGHT).toEqual({ common: 10, uncommon: 6, rare: 0.5 });
  });
});