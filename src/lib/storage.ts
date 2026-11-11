// localStorage: keeps only today + the previous two days.
import { FOOD_IDS, type FoodId } from "@/data/foods";
import { MILESTONE_LINES, VISIT_LINES, type Milestone, type Reaction } from "@/data/mango-lines";
import { daysBefore, type Streak } from "./game";
import { selectReaction } from "./personality";

const KEY = "mangos-garden:days";

export interface DayRecord {
  offer?: FoodId[];
  food?: FoodId;
  visitor?: string;
  /** streak before today's visit, so the testing reset can undo it */
  streakBefore?: Streak;
  /** Exact book snapshot: reset must also undo foods learned today. */
  collectionBefore?: BookEntry | null;
  /** days-since-rare before today's visit, so the testing reset can undo it */
  pityBefore?: number;
  reactionLine?: string;
  learned?: boolean;
}
export type History = Record<string, DayRecord>;

export function loadHistory(): History {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw as History : {};
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
  const record = all[today];
  if (visitor && record && "collectionBefore" in record) {
    const collection = loadCollection();
    if (record.collectionBefore) collection[visitor] = record.collectionBefore;
    else delete collection[visitor];
    saveCollection(collection);
  } else if (visitor) unrecordVisit(visitor); // Older saves have no snapshot.
  const before = all[today]?.streakBefore;
  if (before) saveStreak(before);
  const pity = all[today]?.pityBefore;
  if (typeof pity === "number") saveDaysSinceRare(pity);
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
  seenFoods?: FoodId[];
}
export type Collection = Record<string, BookEntry>;

export function loadCollection(): Collection {
  try {
    const raw = JSON.parse(localStorage.getItem(BOOK_KEY) ?? "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const collection: Collection = {};
    for (const [id, value] of Object.entries(raw)) {
      if (!value || typeof value !== "object") continue;
      const entry = value as BookEntry;
      if (typeof entry.firstSeen !== "string" || !Number.isFinite(entry.visits) || entry.visits < 1) continue;
      collection[id] = { ...entry, seenFoods: Array.isArray(entry.seenFoods) ? entry.seenFoods.filter((food) => FOOD_IDS.includes(food)) : [] };
    }
    return collection;
  } catch {
    return {};
  }
}

function saveCollection(c: Collection) {
  localStorage.setItem(BOOK_KEY, JSON.stringify(c));
}

/** Records a visit; returns the updated entry. */
export function recordVisit(birdId: string, date: string, food?: FoodId): BookEntry {
  const c = loadCollection();
  const prev = c[birdId];
  const entry: BookEntry = prev
    ? { ...prev, visits: (prev.visits || 0) + 1 }
    : { firstSeen: date, visits: 1, unseenInBook: true };
  entry.seenFoods = [...new Set([...(prev?.seenFoods ?? []), ...(food ? [food] : [])])];
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
  for (const entry of Object.values(c)) delete entry.unseenInBook;
  saveCollection(c);
}

const STREAK_KEY = "mangos-garden:streak";

export function loadStreak(): Streak {
  try {
    const raw = JSON.parse(localStorage.getItem(STREAK_KEY) ?? "{}") ?? {};
    return {
      current: Number(raw.current) || 0,
      best: Number(raw.best) || 0,
      lastVisit: typeof raw.lastVisit === "string" ? raw.lastVisit : undefined,
    };
  } catch {
    return { current: 0, best: 0 };
  }
}

export function saveStreak(s: Streak) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

// Permanent personality memory is independent of the three-day history and reset.
const PERSONALITY_KEY = "mangos-garden:personality";
interface PersonalityMemory {
  shown: Milestone[];
  previous: Partial<Record<Reaction, number>>;
}

export function loadPersonality(): PersonalityMemory {
  try {
    const raw = JSON.parse(localStorage.getItem(PERSONALITY_KEY) ?? "{}");
    const shown = Array.isArray(raw?.shown) ? raw.shown.filter((id: unknown): id is Milestone => typeof id === "string" && id in MILESTONE_LINES) : [];
    const previous: PersonalityMemory["previous"] = {};
    for (const group of Object.keys(VISIT_LINES) as Reaction[]) {
      const value = raw?.previous?.[group];
      if (Number.isInteger(value) && value >= 0 && value < VISIT_LINES[group].length) previous[group] = value;
    }
    return { shown, previous };
  } catch {
    return { shown: [], previous: {} };
  }
}

export function nextReactionLine(group: Reaction): string {
  const memory = loadPersonality();
  const index = selectReaction(group, memory.previous[group]);
  memory.previous[group] = index;
  localStorage.setItem(PERSONALITY_KEY, JSON.stringify(memory));
  return VISIT_LINES[group][index] ?? VISIT_LINES[group][0] ?? "";
}

/** Claim only lines actually being displayed; reopens and testing resets never repeat them. */
export function claimMilestones(ids: Milestone[]): Milestone[] {
  const memory = loadPersonality();
  const fresh = ids.filter((id) => !memory.shown.includes(id));
  memory.shown = [...new Set([...memory.shown, ...fresh])];
  localStorage.setItem(PERSONALITY_KEY, JSON.stringify(memory));
  return fresh;
}

const SOUND_KEY = "mangos-garden:sound";
export function loadSound(): boolean {
  return localStorage.getItem(SOUND_KEY) === "on";
}
export function saveSound(enabled: boolean) {
  localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
}

// Pity boost counter: days (visits) since the last rare bird.
const PITY_KEY = "mangos-garden:pity";
export function loadDaysSinceRare(): number {
  const n = Number(localStorage.getItem(PITY_KEY));
  return Number.isInteger(n) && n >= 0 ? n : 0;
}
export function saveDaysSinceRare(n: number) {
  localStorage.setItem(PITY_KEY, String(n));
}
