import { beforeEach, describe, expect, it } from "vitest";
import { getBird } from "@/data/birds";
import { nextDaysSinceRare, pityMultiplier, scoreBird } from "./visitor";
import { loadDaysSinceRare, resetDay, saveDay, saveDaysSinceRare } from "./storage";

const hoopoe = getBird("hoopoe")!, robin = getBird("robin")!;

describe("pity boost", () => {
  beforeEach(() => localStorage.clear());
  it("grows each day without a rare visit", () => {
    expect(pityMultiplier(0)).toBe(1);
    expect(pityMultiplier(1)).toBeCloseTo(1.05);
    expect(pityMultiplier(10)).toBeCloseTo(1.5);
    expect(scoreBird(hoopoe, "mealworms", {}, undefined, 10)).toBeCloseTo(scoreBird(hoopoe, "mealworms", {}) * 1.5);
  });
  it("is capped at x3", () => {
    expect(pityMultiplier(40)).toBe(3);
    expect(pityMultiplier(500)).toBe(3);
  });
  it("only boosts rare birds", () => {
    expect(scoreBird(robin, "mealworms", {}, undefined, 30)).toBe(scoreBird(robin, "mealworms", {}));
  });
  it("counts up on other visits and resets only on a NEW rare bird", () => {
    expect(nextDaysSinceRare(5, robin, [])).toBe(6);
    expect(nextDaysSinceRare(5, hoopoe, [])).toBe(0);
    expect(nextDaysSinceRare(5, hoopoe, ["hoopoe"])).toBe(6);
  });
  it("does not boost rare birds already collected", () => {
    expect(scoreBird(hoopoe, "mealworms", {}, ["hoopoe"], 30)).toBe(scoreBird(hoopoe, "mealworms", {}, ["hoopoe"], 0));
    expect(scoreBird(hoopoe, "mealworms", {}, [], 20)).toBeCloseTo(scoreBird(hoopoe, "mealworms", {}, [], 0) * 2);
  });
  it("stops applying once both rare birds are collected", () => {
    const all = ["hoopoe", "waxwing"];
    expect(scoreBird(getBird("waxwing")!, "berries", {}, all, 40)).toBe(scoreBird(getBird("waxwing")!, "berries", {}, all, 0));
  });
  it("Hoopoe loves mealworms and fat ball, likes peanuts", () => {
    expect(hoopoe.affinity).toEqual({ mealworms: 3, fatball: 3, peanuts: 1 });
  });
  it("is undone by reset today", () => {
    saveDaysSinceRare(7);
    saveDay("2026-11-11", { food: "mealworms", visitor: "hoopoe", pityBefore: 7 });
    saveDaysSinceRare(0);
    resetDay("2026-11-11");
    expect(loadDaysSinceRare()).toBe(7);
  });
  it("defaults to 0 on empty or broken storage", () => {
    expect(loadDaysSinceRare()).toBe(0);
    localStorage.setItem("mangos-garden:pity", "banana");
    expect(loadDaysSinceRare()).toBe(0);
  });
});
