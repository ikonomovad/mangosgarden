// localStorage: keeps only today + the previous two days.
import type { FoodId } from "@/data/foods";
import { daysBefore } from "./game";

const KEY = "mangos-garden:days";

export interface DayRecord {
  offer?: FoodId[];
  food?: FoodId;
  visitor?: string;
}
export type History = Record<string, DayRecord>;

export function loadHistory(): History {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as History;
  } catch {
    return {};
  }
}

export function saveDay(today: string, record: DayRecord): History {
  const all = loadHistory();
  const keep = [today, daysBefore(today, 1), daysBefore(today, 2)];
  const next: History = {};
  for (const k of keep) if (all[k]) next[k] = all[k];
  next[today] = { ...next[today], ...record };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function resetDay(today: string) {
  const all = loadHistory();
  const visitor = all[today]?.visitor;
  if (visitor) unrecordVisit(visitor);
  delete all[today];
  localStorage.setItem(KEY, JSON.stringify(all));
}

// Bird book: kept forever (separate key from the 3-day history).
const BOOK_KEY = "mangos-garden:collection";

export interface BookEntry {
  firstSeen: string;
  visits: number;
  /** true until the player has opened the bird book after discovering it */
  unseenInBook?: boolean;
}
export type Collection = Record<string, BookEntry>;

export function loadCollection(): Collection {
  try {
    const raw = JSON.parse(localStorage.getItem(BOOK_KEY) ?? "{}");
    return raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Collection) : {};
  } catch {
    return {};
  }
}

function saveCollection(c: Collection) {
  localStorage.setItem(BOOK_KEY, JSON.stringify(c));
}

/** Records a visit; returns the updated entry. */
export function recordVisit(birdId: string, date: string): BookEntry {
  const c = loadCollection();
  const prev = c[birdId];
  const entry: BookEntry = prev
    ? { ...prev, visits: (prev.visits || 0) + 1 }
    : { firstSeen: date, visits: 1, unseenInBook: true };
  c[birdId] = entry;
  saveCollection(c);
  return entry;
}

/** Undo one visit (used by the testing reset). */
export function unrecordVisit(birdId: string) {
  const c = loadCollection();
  const e = c[birdId];
  if (!e) return;
  if (e.visits <= 1) delete c[birdId];
  else c[birdId] = { ...e, visits: e.visits - 1 };
  saveCollection(c);
}

export function markBookSeen() {
  const c = loadCollection();
  for (const id in c) if (c[id]) delete c[id]!.unseenInBook;
  saveCollection(c);
}
