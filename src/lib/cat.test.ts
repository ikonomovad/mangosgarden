import { describe, expect, it } from "vitest";
import { catVisible, DEBUG_CAT_KEY, isCatDay, weekStart } from "./cat";

const days = (y: number, m: number, d: number) => Array.from({ length: 7 }, (_, i) => new Date(y, m, d + i, 12));
describe("weekly cat", () => {
  it("weeks start on Monday", () => { expect(weekStart(new Date(2026, 10, 15))).toBe("2026-11-09"); });
  it("appears on exactly one day in each of 52 weeks", () => {
    for (let w = 0; w < 52; w++) expect(days(2026, 0, 5 + w * 7).filter(isCatDay)).toHaveLength(1);
  });
  it("is the same day all day long", () => {
    const day = days(2026, 10, 9).find(isCatDay)!;
    expect(isCatDay(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 1))).toBe(true);
    expect(isCatDay(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59))).toBe(true);
  });
  it("debug pin only works with the panel on", () => {
    const off = days(2026, 10, 9).find((d) => !isCatDay(d))!;
    localStorage.setItem(DEBUG_CAT_KEY, "1");
    expect(catVisible(off, false)).toBe(false);
    expect(catVisible(off, true)).toBe(true);
    localStorage.removeItem(DEBUG_CAT_KEY);
  });
});
