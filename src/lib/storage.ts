// Every localStorage read/write. All access is wrapped so private mode, full storage
// or corrupted JSON fall back to safe defaults instead of breaking the game.
// Birds and foods are always saved by their stable `id`, never by display name.
import { BIRDS } from "@/data/birds";
import { FOODS, FOOD_IDS, type FoodId } from "@/data/foods";
import { MILESTONE_LINES, VISIT_LINES, type Milestone, type Reaction } from "@/data/mango-lines";
import { daysBefore, isDateKey, type Streak } from "./game";
import { selectReaction } from "./personality";

// ---------- safe low-level access ----------
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage full or blocked: keep playing without saving */
  }
}
function readJSON(key: string): unknown {
  try {
    return JSON.parse(read(key) ?? "null");
  } catch {
    return null;
  }
}
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

// ---------- version + migration ----------
export const VERSION_KEY = "mangos-garden:version";
/** Bump when the saved shape changes and add a step in `migrate`. Never wipe data. */
export const STORAGE_VERSION = 1;

const BIRD_IDS = BIRDS.map((b) => b.id);
const isBirdId = (v: unknown): v is string => typeof v === "string" && BIRD_IDS.includes(v);
const isFoodId = (v: unknown): v is FoodId => typeof v === "string" && (FOOD_IDS as string[]).includes(v);
/** Accepts an id, or an old display name ("Blue Tit") and turns it into the id. */
const birdIdFrom = (v: unknown) => isBirdId(v) ? v : BIRDS.find((b) => b.name === v)?.id;
const foodIdFrom = (v: unknown) => isFoodId(v) ? v : FOODS.find((f) => f.name === v)?.id;

/** Runs once per version step; safe to call on every load. */
export function migrate() {
  const from = Number(read(VERSION_KEY)) || 0;
  if (from >= STORAGE_VERSION) return;
  if (from < 1) {
    // v0 → v1: normalise any names into stable ids; keep everything else as is.
    const days = readJSON(KEY);
    if (isObject(days)) {
      for (const rec of Object.values(days)) {
        if (!isObject(rec)) continue;
        if (Array.isArray(rec["offer"])) rec["offer"] = rec["offer"].map(foodIdFrom).filter(Boolean);
        if (rec["food"] !== undefined) rec["food"] = foodIdFrom(rec["food"]);
        if (rec["visitor"] !== undefined) rec["visitor"] = birdIdFrom(rec["visitor"]);
      }
      write(KEY, JSON.stringify(days));
    }
    const book = readJSON(BOOK_KEY);
    if (isObject(book)) {
      const next: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(book)) {
        const id = birdIdFrom(k);
        if (id && isObject(v)) next[id] = { ...v, seenFoods: Array.isArray(v["seenFoods"]) ? v["seenFoods"].map(foodIdFrom).filter(Boolean) : [] };
      }
      write(BOOK_KEY, JSON.stringify(next));
    }
  }
  write(VERSION_KEY, String(STORAGE_VERSION));
}

// ---------- daily history: today + the previous two days ----------
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
  migrate();
  const raw = readJSON(KEY);
  if (!isObject(raw)) return {};
  const out: History = {};
  for (const [date, value] of Object.entries(raw)) {
    if (!isDateKey(date) || !isObject(value)) continue;
    const rec = { ...value } as DayRecord;
    // An offer must be exactly 4 known, distinct foods; otherwise it is regenerated.
    if (!Array.isArray(rec["offer"]) || rec["offer"].length !== 4 || !rec["offer"].every(isFoodId) || new Set(rec["offer"]).size !== 4) delete rec["offer"];
    if (!isFoodId(rec["food"])) delete rec["food"];
    if (!isBirdId(rec["visitor"])) delete rec["visitor"];
    out[date] = rec;
  }
  return out;
}

export function saveDay(today: string, record: DayRecord): History {
  const all = loadHistory();
  const keep = [today, daysBefore(today, 1), daysBefore(today, 2)];
  const next: History = {};
  for (const k of keep) if (all[k]) next[k] = all[k];
  next[today] = { ...next[today], ...record };
  write(KEY, JSON.stringify(next));
  return next;
}

export function resetDay(today: string) {
  const all = loadHistory();
  const record = all[today];
  const visitor = record?.visitor;
  if (visitor && record && "collectionBefore" in record) {
    const collection = loadCollection();
    if (record.collectionBefore) collection[visitor] = record.collectionBefore;
    else delete collection[visitor];
    saveCollection(collection);
  } else if (visitor) unrecordVisit(visitor); // Older saves have no snapshot.
  if (record?.streakBefore) saveStreak(record.streakBefore);
  if (typeof record?.pityBefore === "number") saveDaysSinceRare(record.pityBefore);
  delete all[today];
  write(KEY, JSON.stringify(all));
}

// ---------- bird book: kept forever ----------
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
  migrate();
  const raw = readJSON(BOOK_KEY);
  if (!isObject(raw)) return {};
  const collection: Collection = {};
  for (const [id, value] of Object.entries(raw)) {
    if (!isBirdId(id) || !isObject(value)) continue;
    const entry = value as unknown as BookEntry;
    if (!isDateKey(entry.firstSeen) || !Number.isFinite(entry.visits) || entry.visits < 1) continue;
    collection[id] = { ...entry, seenFoods: Array.isArray(entry.seenFoods) ? entry.seenFoods.filter(isFoodId) : [] };
  }
  return collection;
}

function saveCollection(c: Collection) {
  write(BOOK_KEY, JSON.stringify(c));
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

// ---------- streak ----------
const STREAK_KEY = "mangos-garden:streak";

export function loadStreak(): Streak {
  const raw = readJSON(STREAK_KEY);
  if (!isObject(raw)) return { current: 0, best: 0 };
  const current = Math.max(0, Math.floor(Number(raw["current"])) || 0);
  return {
    current,
    best: Math.max(current, Math.floor(Number(raw["best"])) || 0),
    lastVisit: isDateKey(raw["lastVisit"]) ? raw["lastVisit"] : undefined,
  };
}

export function saveStreak(s: Streak) {
  write(STREAK_KEY, JSON.stringify(s));
}

// ---------- personality: permanent, independent of reset ----------
const PERSONALITY_KEY = "mangos-garden:personality";
interface PersonalityMemory {
  shown: Milestone[];
  previous: Partial<Record<Reaction, number>>;
}

export function loadPersonality(): PersonalityMemory {
  const raw = readJSON(PERSONALITY_KEY);
  const obj = isObject(raw) ? raw : {};
  const shown = Array.isArray(obj["shown"]) ? obj["shown"].filter((id: unknown): id is Milestone => typeof id === "string" && id in MILESTONE_LINES) : [];
  const prev = isObject(obj["previous"]) ? obj["previous"] : {};
  const previous: PersonalityMemory["previous"] = {};
  for (const group of Object.keys(VISIT_LINES) as Reaction[]) {
    const value = prev[group];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value < VISIT_LINES[group].length) previous[group] = value;
  }
  return { shown, previous };
}

export function nextReactionLine(group: Reaction): string {
  const memory = loadPersonality();
  const index = selectReaction(group, memory.previous[group]);
  memory.previous[group] = index;
  write(PERSONALITY_KEY, JSON.stringify(memory));
  return VISIT_LINES[group][index] ?? VISIT_LINES[group][0] ?? "";
}

/** Claim only lines actually being displayed; reopens and testing resets never repeat them. */
export function claimMilestones(ids: Milestone[]): Milestone[] {
  const memory = loadPersonality();
  const fresh = ids.filter((id) => !memory.shown.includes(id));
  memory.shown = [...new Set([...memory.shown, ...fresh])];
  write(PERSONALITY_KEY, JSON.stringify(memory));
  return fresh;
}

// ---------- sound ----------
const SOUND_KEY = "mangos-garden:sound";
export function loadSound(): boolean {
  return read(SOUND_KEY) === "on";
}
export function saveSound(enabled: boolean) {
  write(SOUND_KEY, enabled ? "on" : "off");
}

// ---------- pity: visits since the last newly discovered rare bird ----------
const PITY_KEY = "mangos-garden:pity";
export function loadDaysSinceRare(): number {
  const n = Number(read(PITY_KEY));
  return Number.isInteger(n) && n >= 0 ? n : 0;
}
export function saveDaysSinceRare(n: number) {
  write(PITY_KEY, String(n));
}
