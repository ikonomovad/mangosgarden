import { useLanguage } from "@/i18n/LanguageProvider";
import type { ReactNode } from "react";
import { BIRD_TEXT, type Bird } from "@/data/birds";
import { BirdSvg } from "./BirdSvg";
import { RarityBadge } from "./RarityBadge";
import { birdChatUrl, birdSearchUrl } from "@/lib/bird-links";
import { LEARNED_LINE, MANGO_TEXT } from "@/data/mango-lines";



export function BirdCard({ bird, isNew = false, visits, learned = false, footer }: { bird: Bird; isNew?: boolean; visits?: number; learned?: boolean; footer?: ReactNode }) {
  const { t, text, language } = useLanguage();
  const content = text(BIRD_TEXT[bird.id] ?? { en: bird });
  const rare = bird.rarity === "rare";
  return (
    <div className="card-pop relative w-full overflow-hidden rounded-card border-4 border-card bg-paper p-6 text-center shadow-soft">
      {(rare || isNew) && <Sparkles />}
      {isNew ? (
        <span className="inline-block rounded-full bg-primary px-3 py-1 font-display text-xs text-primary-foreground">{t("newBird")}</span>
      ) : visits ? (
        <span className="inline-block rounded-full bg-muted px-3 py-1 font-display text-xs text-muted-foreground">{t(visits === 1 ? "visitedOne" : "visited", { count: visits })}</span>
      ) : null}
      <div className="mx-auto my-4 h-40 w-40 rounded-full bg-garden-soft p-4">
        <BirdSvg look={bird.look} title={content.name} className="h-full w-full" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <h2 className="font-display text-3xl text-foreground">{content.name}</h2>
        <RarityBadge rarity={bird.rarity} delayed />
      </div>
      <p className="mt-3 font-body text-base text-muted-foreground">{content.fact}</p>
      <div className="mt-1 flex flex-wrap justify-center gap-x-4 text-sm">
        <a className="inline-flex min-h-11 items-center text-secondary-foreground underline underline-offset-4" href={birdSearchUrl(content.name, language)} target="_blank" rel="noopener noreferrer">{t("findOutMore")}</a>
        <a className="inline-flex min-h-11 items-center text-secondary-foreground underline underline-offset-4" href={birdChatUrl(content.name, language)} target="_blank" rel="noopener noreferrer">{t("askChatGPT")}</a>
      </div>
      {learned && <p role="status" className="mt-3 font-display text-sm text-secondary-foreground">{text(MANGO_TEXT[LEARNED_LINE] ?? { en: LEARNED_LINE })}</p>}
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
