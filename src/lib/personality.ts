// Pure reaction and milestone rules; wording lives in data/mango-lines.ts.
import { BIRDS, type Bird } from "@/data/birds";
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

export function pendingMilestones(collected: number, streak: number, shown: readonly Milestone[], total: number = BIRDS.length): Milestone[] {
  const reached: Milestone[] = [];
  if (collected >= 1) reached.push("first-bird");
  for (const days of [3, 7, 14, 30] as const) {
    if (streak >= days) reached.push(`streak-${days}`);
  }
  if (collected >= halfwayCount(total)) reached.push("collection-half");
  if (collected >= total) reached.push("collection-all");
  return reached.filter((id) => !shown.includes(id));
}

export function favoritesKnown(visits: number): boolean {
  return visits >= 3;
}
export const halfwayCount = (total: number = BIRDS.length) => Math.floor(total / 2);

/** The number a collection milestone line shows in its {count} placeholder. */
export function milestoneCount(id: Milestone, total: number = BIRDS.length): number | undefined {
  if (id === "collection-half") return halfwayCount(total);
  if (id === "collection-all") return total;
  return undefined;
}
