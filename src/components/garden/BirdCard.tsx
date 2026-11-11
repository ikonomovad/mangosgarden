import type { ReactNode } from "react";
import type { Bird } from "@/data/birds";
import { BirdSvg } from "./BirdSvg";
import { LEARNED_LINE } from "@/data/mango-lines";

const RARITY_LABEL = { common: "Common", uncommon: "Uncommon", rare: "Rare ✨" };

export function BirdCard({ bird, isNew = false, visits, learned = false, footer }: { bird: Bird; isNew?: boolean; visits?: number; learned?: boolean; footer?: ReactNode }) {
  const rare = bird.rarity === "rare";
  return (
    <div className="card-pop relative w-full overflow-hidden rounded-card border-4 border-card bg-paper p-6 text-center shadow-soft">
      {(rare || isNew) && <Sparkles />}
      <span className={`inline-block rounded-full px-3 py-1 font-display text-xs ${rare ? "bg-rare text-rare-foreground" : "bg-secondary text-secondary-foreground"}`}>
        {RARITY_LABEL[bird.rarity]}
      </span>
      {isNew ? (
        <span className="ml-2 inline-block rounded-full bg-primary px-3 py-1 font-display text-xs text-primary-foreground">New bird!</span>
      ) : visits ? (
        <span className="ml-2 inline-block rounded-full bg-muted px-3 py-1 font-display text-xs text-muted-foreground">Visited {visits} times</span>
      ) : null}
      <div className="mx-auto my-4 h-40 w-40 rounded-full bg-garden-soft p-4">
        <BirdSvg look={bird.look} title={bird.name} className="h-full w-full" />
      </div>
      <h2 className="font-display text-3xl text-foreground">{bird.name}</h2>
      <p className="mt-3 font-body text-base text-muted-foreground">{bird.fact}</p>
      {learned && <p role="status" className="mt-3 font-display text-sm text-secondary-foreground">{LEARNED_LINE}</p>}
      {footer && <div className="mt-5 border-t-2 border-dashed border-border pt-4 text-left">{footer}</div>}
    </div>
  );
}

function Sparkles() {
  const spots = [
    { left: "12%", top: "14%", delay: "0s" },
    { left: "82%", top: "10%", delay: ".3s" },
    { left: "20%", top: "56%", delay: ".6s" },
    { left: "78%", top: "48%", delay: ".15s" },
    { left: "50%", top: "6%", delay: ".45s" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {spots.map((s, i) => (
        <span key={i} className="sparkle absolute text-xl text-rare" style={{ left: s.left, top: s.top, animationDelay: s.delay }}>
          ✦
        </span>
      ))}
    </div>
  );
}
