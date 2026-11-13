import { describe, expect, it } from "vitest";
import { BIRDS } from "@/data/birds";
import { favoritesKnown, pendingMilestones, reactionFor, selectReaction, milestoneCount } from "./personality";

function bird(id: string) {
  const result = BIRDS.find((b) => b.id === id);
  if (!result) throw new Error("Missing test bird");
  return result;
}

describe("Mango reactions", () => {
  it("prioritizes rare birds even when new or returning from yesterday", () => {
    expect(reactionFor(bird("hoopoe"), true)).toBe("rare");
    expect(reactionFor(bird("hoopoe"), false, "hoopoe")).toBe("rare");
  });
  it("recognizes a brand-new bird", () => {
    expect(reactionFor(bird("robin"), true)).toBe("new");
  });
  it("recognizes a repeat visitor", () => {
    expect(reactionFor(bird("robin"), false)).toBe("repeat");
  });
  it("recognizes yesterday's visitor", () => {
    expect(reactionFor(bird("robin"), false, "robin")).toBe("yesterday");
  });
  it("never chooses the previous variant from each three-variant group", () => {
    for (const group of ["rare", "new", "repeat", "yesterday"] as const) {
      const choices = [0, 1, 2].map((i) => selectReaction(group, undefined, () => i / 3));
      expect(choices).toEqual([0, 1, 2]);
      for (const previous of choices) {
        expect(selectReaction(group, previous, () => 0)).not.toBe(previous);
        expect(selectReaction(group, previous, () => 0.999)).not.toBe(previous);
      }
    }
  });
});

describe("one-time milestones", () => {
  it("marks the first bird, but not an empty collection", () => {
    expect(pendingMilestones(0, 0, [])).toEqual([]);
    expect(pendingMilestones(1, 1, [])).toEqual(["first-bird"]);
  });
  for (const days of [3, 7, 14, 30] as const) {
    it(`unlocks the ${days}-day milestone at exactly ${days} days`, () => {
      expect(pendingMilestones(1, days - 1, [])).not.toContain(`streak-${days}`);
      expect(pendingMilestones(1, days, [])).toContain(`streak-${days}`);
      expect(pendingMilestones(1, days, [`streak-${days}`])).not.toContain(`streak-${days}`);
    });
  }
  for (const [id, count] of [["collection-half", 10], ["collection-all", 20]] as const) {
    it(`unlocks ${id} at ${count} of 20 birds only once`, () => {
      expect(pendingMilestones(count - 1, 1, [])).not.toContain(id);
      expect(pendingMilestones(count, 1, [])).toContain(id);
      expect(pendingMilestones(count, 1, [id])).not.toContain(id);
    });
  }
  it("derives the halfway and full-book milestones from the bird count", () => {
    expect(pendingMilestones(7, 1, [], 15)).toContain("collection-half");
    expect(pendingMilestones(6, 1, [], 15)).not.toContain("collection-half");
    expect(milestoneCount("collection-half", 15)).toBe(7);
    expect(milestoneCount("collection-all", 15)).toBe(15);
  });
});

it("reveals favorite foods only from the third visit onward", () => {
  expect(favoritesKnown(1)).toBe(false);
  expect(favoritesKnown(2)).toBe(false);
  expect(favoritesKnown(3)).toBe(true);
  expect(favoritesKnown(4)).toBe(true);
});