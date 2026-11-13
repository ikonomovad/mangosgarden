import { describe, expect, it } from "vitest";
import { seasonFor } from "./season";

const d = (month: number) => new Date(2026, month, 15);
describe("seasonFor", () => {
  it("March–May is spring", () => { expect([2, 3, 4].map((m) => seasonFor(d(m)))).toEqual(["spring", "spring", "spring"]); });
  it("June–August is summer", () => { expect([5, 6, 7].map((m) => seasonFor(d(m)))).toEqual(["summer", "summer", "summer"]); });
  it("September–November is autumn", () => { expect([8, 9, 10].map((m) => seasonFor(d(m)))).toEqual(["autumn", "autumn", "autumn"]); });
  it("December–February is winter", () => { expect([11, 0, 1].map((m) => seasonFor(d(m)))).toEqual(["winter", "winter", "winter"]); });
  it("uses the local day at the boundary", () => { expect(seasonFor(new Date(2026, 8, 1, 0, 5))).toBe("autumn"); });
});

import { currentSeason, DEBUG_SEASON_KEY } from "./season";
describe("currentSeason", () => {
  it("ignores a pinned season when the developer panel is off", () => {
    localStorage.setItem(DEBUG_SEASON_KEY, "winter");
    expect(currentSeason(new Date(2026, 6, 1), false)).toBe("summer");
    localStorage.removeItem(DEBUG_SEASON_KEY);
  });
  it("uses a pinned season when the developer panel is on", () => {
    localStorage.setItem(DEBUG_SEASON_KEY, "winter");
    expect(currentSeason(new Date(2026, 6, 1), true)).toBe("winter");
    localStorage.removeItem(DEBUG_SEASON_KEY);
  });
});
