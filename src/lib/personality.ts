// Pure reaction and milestone rules; wording lives in data/mango-lines.ts.
import type { Bird } from "@/data/birds";
import { VISIT_LINES, type Milestone, type Reaction } from "@/data/mango-lines";

export function reactionFor(bird: Bird, isNew: boolean, yesterday?: string): Reaction {
  // Rare arrivals take priority, then yesterday's friend, then other visits.
  if (bird.rarity === "rare") return "rare";
  if (bird.id === yesterday) return "yesterday";
  return isNew ? "new" : "repeat";
}

export function selectReaction(reaction: Reaction, previous?: number, random: () => number = Math.random): number {
  const candidates = VISIT_LINES[reaction].map((_, i) => i).filter((i) => i !== previous);
  return candidates[Math.floor(random() * candidates.length)] ?? 0;
}

export function pendingMilestones(collected: number, streak: number, shown: readonly Milestone[]): Milestone[] {
  const reached: Milestone[] = [];
  if (collected >= 1) reached.push("first-bird");
  for (const days of [3, 7, 14, 30] as const) {
    if (streak >= days) reached.push(`streak-${days}`);
  }
  if (collected >= 6) reached.push("collection-6");
  if (collected >= 12) reached.push("collection-12");
  return reached.filter((id) => !shown.includes(id));
}

export function favoritesKnown(visits: number): boolean {
  return visits >= 3;
}