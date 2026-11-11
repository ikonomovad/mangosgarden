import { beforeEach, describe, expect, it } from "vitest";
import { claimMilestones, loadCollection, loadHistory, loadPersonality, loadSound, loadStreak, nextReactionLine, recordVisit, resetDay, saveDay, saveSound, saveStreak } from "./storage";

beforeEach(() => localStorage.clear());

describe("food discoveries and reset", () => {
  it("keeps all distinct foods that attracted a bird, along with first-seen and visits", () => {
    recordVisit("robin", "2026-11-09", "mealworms");
    recordVisit("robin", "2026-11-10", "apple");
    recordVisit("robin", "2026-11-11", "mealworms");
    expect(loadCollection()["robin"]).toMatchObject({ firstSeen: "2026-11-09", visits: 3, seenFoods: ["mealworms", "apple"] });
  });
  it("reset restores the precise previous food hints, visits, and streak and unlocks today", () => {
    const previous = recordVisit("robin", "2026-11-10", "mealworms");
    const streakBefore = { current: 2, best: 5, lastVisit: "2026-11-10" };
    recordVisit("robin", "2026-11-11", "apple");
    saveStreak({ current: 3, best: 5, lastVisit: "2026-11-11" });
    saveDay("2026-11-11", { visitor: "robin", food: "apple", collectionBefore: previous, streakBefore });
    resetDay("2026-11-11");
    expect(loadCollection()["robin"]).toEqual(previous);
    expect(loadStreak()).toEqual(streakBefore);
    expect(loadHistory()["2026-11-11"]).toBeUndefined();
  });
  it("reset removes a first discovery without forgetting shown milestones", () => {
    recordVisit("robin", "2026-11-11", "mealworms");
    saveDay("2026-11-11", { visitor: "robin", collectionBefore: null });
    expect(claimMilestones(["first-bird"])).toEqual(["first-bird"]);
    resetDay("2026-11-11");
    expect(loadCollection()).toEqual({});
    expect(claimMilestones(["first-bird"])).toEqual([]);
  });
  it("migrates older collection entries without inventing foods", () => {
    localStorage.setItem("mangos-garden:collection", JSON.stringify({ robin: { firstSeen: "2026-11-09", visits: 2 } }));
    expect(loadCollection()["robin"]?.seenFoods).toEqual([]);
    expect(recordVisit("robin", "2026-11-11", "apple")).toMatchObject({ visits: 3, seenFoods: ["apple"] });
  });
  it("handles empty, cleared, and malformed saved data", () => {
    expect(loadCollection()).toEqual({});
    expect(loadPersonality().shown).toEqual([]);
    for (const raw of ["null", "[]", "{broken", '{"robin":null}']) {
      localStorage.setItem("mangos-garden:collection", raw);
      expect(loadCollection()).toEqual({});
    }
  });
});

it("stores non-repeating reaction choices across reads and resets", () => {
  const first = nextReactionLine("new");
  const second = nextReactionLine("new");
  expect(second).not.toBe(first);
  resetDay("2026-11-11");
  expect(nextReactionLine("new")).not.toBe(second);
});

it("persists every milestone once, independently of daily history", () => {
  const ids = ["first-bird", "streak-3", "streak-7", "streak-14", "streak-30", "collection-6", "collection-12"] as const;
  expect(claimMilestones([...ids])).toEqual(ids);
  saveDay("2026-12-01", { offer: ["apple"] });
  expect(claimMilestones([...ids])).toEqual([]);
});

it("keeps sounds off by default and remembers the chosen setting", () => {
  expect(loadSound()).toBe(false);
  saveSound(true);
  expect(loadSound()).toBe(true);
  saveSound(false);
  expect(loadSound()).toBe(false);
});