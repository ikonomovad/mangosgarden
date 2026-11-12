import { describe, expect, it } from "vitest";
import { FOODS } from "@/data/foods";
import { FOOD_ICONS } from "./FoodIcon";

describe("food icon coverage", () => {
  for (const food of FOODS) {
    it(`has dedicated artwork for ${food.id}`, () => {
      expect(Object.hasOwn(FOOD_ICONS, food.id)).toBe(true);
      expect(FOOD_ICONS[food.id]).toBeDefined();
    });
  }
});