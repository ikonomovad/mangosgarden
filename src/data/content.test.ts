import { describe, expect, it } from "vitest";
import { BIRDS, getAffinity, getBird, RARITY_WEIGHT } from "./birds";
import { FOODS } from "./foods";

const loves = (id: string) => Object.values(getBird(id)!.affinity).filter((v) => v === 3).length;

describe("garden content", () => {
  it("has 14 unique foods including figs, corn, pumpkin seeds and rosehips", () => {
    expect(FOODS.map((food) => food.id).sort()).toEqual(["sunflower", "millet", "peanuts", "wheat", "apple", "berries", "orange", "mealworms", "walnut", "water", "figs", "corn", "pumpkin", "rosehip"].sort());
    expect(new Set(FOODS.map((food) => food.id)).size).toBe(14);
  });
  it("has 20 unique birds: 14 common, 3 uncommon, 3 rare", () => {
    expect(new Set(BIRDS.map((bird) => bird.id)).size).toBe(20);
    expect(BIRDS.filter((bird) => bird.rarity === "common")).toHaveLength(14);
    expect(BIRDS.filter((bird) => bird.rarity === "uncommon").map((bird) => bird.id).sort()).toEqual(["greenwoodpecker", "jay", "woodpecker"]);
    expect(BIRDS.filter((bird) => bird.rarity === "rare").map((bird) => bird.id).sort()).toEqual(["bullfinch", "hoopoe", "waxwing"]);
  });
  const affinities: Record<string, Record<string, number>> = {
    robin: { mealworms: 3, berries: 1, water: 1, apple: 1 },
    bluetit: { peanuts: 3, sunflower: 3, mealworms: 1, pumpkin: 1 },
    greattit: { sunflower: 3, peanuts: 1, walnut: 1, pumpkin: 1 },
    blackbird: { apple: 3, mealworms: 3, figs: 1, berries: 1, water: 1 },
    goldfinch: { sunflower: 3, millet: 1 },
    sparrow: { millet: 3, water: 3, wheat: 1, sunflower: 1, corn: 1 },
    dove: { wheat: 3, millet: 3, corn: 3, sunflower: 1, water: 1 },
    magpie: { walnut: 3, peanuts: 1, mealworms: 1, corn: 1 },
    jackdaw: { wheat: 3, corn: 3, walnut: 1, apple: 1 },
    starling: { mealworms: 3, figs: 3, apple: 1, water: 1, berries: 1 },
    chaffinch: { sunflower: 3, wheat: 1, millet: 1, pumpkin: 1 },
    greenfinch: { sunflower: 3, peanuts: 1, millet: 1, pumpkin: 1 },
    treesparrow: { millet: 3, wheat: 3, sunflower: 1, water: 1, corn: 1 },
    songthrush: { figs: 3, apple: 3, mealworms: 1, berries: 1, rosehip: 1 },
    woodpecker: { walnut: 3, peanuts: 3, pumpkin: 3, sunflower: 1, mealworms: 1 },
    jay: { walnut: 3, peanuts: 3, corn: 3, figs: 1, apple: 1 },
    greenwoodpecker: { mealworms: 3, apple: 3, walnut: 1 },
    hoopoe: { mealworms: 3, water: 3, figs: 3, apple: 3 },
    waxwing: { berries: 3, apple: 3, orange: 3, rosehip: 3, figs: 1 },
    bullfinch: { rosehip: 3, berries: 3, sunflower: 3, pumpkin: 3 },
  };
  for (const [id, affinity] of Object.entries(affinities)) {
    it(`${id} has the requested affinities and defaults to 0.2 for other foods`, () => {
      const bird = getBird(id);
      if (!bird) throw new Error(`Missing bird: ${id}`);
      expect(bird.affinity).toEqual(affinity);
      for (const food of FOODS) expect(getAffinity(bird, food.id)).toBe(affinity[food.id] ?? 0.2);
    });
  }
  it("every rare bird loves at least 4 foods", () => {
    for (const bird of BIRDS.filter((b) => b.rarity === "rare")) expect(loves(bird.id)).toBeGreaterThanOrEqual(4);
  });
  it("every uncommon bird loves at least 2 foods", () => {
    for (const bird of BIRDS.filter((b) => b.rarity === "uncommon")) expect(loves(bird.id)).toBeGreaterThanOrEqual(2);
  });
  it("keeps rarity weights unchanged", () => {
    expect(RARITY_WEIGHT).toEqual({ common: 10, uncommon: 6, rare: 0.5 });
  });
});
