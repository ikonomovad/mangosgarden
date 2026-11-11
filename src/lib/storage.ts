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
  delete all[today];
  localStorage.setItem(KEY, JSON.stringify(all));
}
