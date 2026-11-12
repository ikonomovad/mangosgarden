import { beforeEach, describe, expect, it } from "vitest";
import { PAT_KEY, claimPat, loadPatDate, patAvailable } from "./pat";

describe("pat Mango", () => {
  beforeEach(() => localStorage.clear());
  it("first pat of the day saves the date", () => {
    expect(claimPat("2026-11-12")).toBe(true);
    expect(loadPatDate()).toBe("2026-11-12");
  });
  it("second pat the same day does nothing", () => {
    claimPat("2026-11-12");
    expect(claimPat("2026-11-12")).toBe(false);
    expect(patAvailable("2026-11-12")).toBe(false);
  });
  it("is available again on the next day", () => {
    claimPat("2026-11-12");
    expect(patAvailable("2026-11-13")).toBe(true);
    expect(claimPat("2026-11-13")).toBe(true);
  });
  it("leaves the main game data unchanged", () => {
    localStorage.setItem("mangos-garden:days", '{"x":1}');
    localStorage.setItem("mangos-garden:streak", '{"current":2}');
    const before = Object.keys(localStorage).filter((k) => k !== PAT_KEY).map((k) => [k, localStorage.getItem(k)]);
    claimPat("2026-11-12"); claimPat("2026-11-12");
    const after = Object.keys(localStorage).filter((k) => k !== PAT_KEY).map((k) => [k, localStorage.getItem(k)]);
    expect(after).toEqual(before);
  });
});
