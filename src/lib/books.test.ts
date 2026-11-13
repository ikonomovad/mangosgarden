import { beforeEach, expect, it } from "vitest";
import { BIRDS } from "@/data/birds";
import { claimMilestones, loadBooks, loadCollection, loadDaysSinceRare, loadHistory, loadPersonality, loadStreak, recordVisit, saveDay, saveDaysSinceRare, saveStreak, startNewBook } from "./storage";

beforeEach(() => localStorage.clear());
const fill = () => BIRDS.forEach((b) => recordVisit(b.id, "2026-11-12", "apple"));

it("refuses to start a new book before the book is complete", () => {
  recordVisit("robin", "2026-11-12");
  expect(startNewBook("2026-11-13")).toBeNull();
  expect(Object.keys(loadCollection())).toEqual(["robin"]);
  expect(loadBooks().completed).toBe(0);
});

it("resets collection, pity and the three collection milestones, keeping streak and today's lock", () => {
  fill();
  saveDaysSinceRare(9);
  saveStreak({ current: 4, best: 8, lastVisit: "2026-11-13" });
  claimMilestones(["first-bird", "collection-half", "collection-all", "streak-3"]);
  saveDay("2026-11-13", { visitor: "robin", food: "apple", collectionBefore: { firstSeen: "2026-11-01", visits: 2 } });
  expect(startNewBook("2026-11-13")).toEqual({ completed: 1, firstCompleted: "2026-11-13" });
  expect(loadCollection()).toEqual({});
  expect(loadDaysSinceRare()).toBe(0);
  expect(loadPersonality().shown).toEqual(["streak-3"]);
  expect(loadStreak()).toEqual({ current: 4, best: 8, lastVisit: "2026-11-13" });
  const today = loadHistory()["2026-11-13"];
  expect(today?.visitor).toBe("robin");
  expect(today?.collectionBefore).toBeUndefined();
});

it("counts completed books and keeps the first completion date", () => {
  fill(); startNewBook("2026-11-13");
  fill(); expect(startNewBook("2027-01-02")).toEqual({ completed: 2, firstCompleted: "2026-11-13" });
});

it("falls back safely when books data is corrupted", () => {
  for (const raw of ["{broken", "null", "[]", '{"completed":-3}', '{"completed":"x"}']) {
    localStorage.setItem("mangos-garden:books", raw);
    expect(loadBooks()).toEqual({ completed: 0 });
  }
});
