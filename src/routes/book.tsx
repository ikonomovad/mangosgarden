import { t as translate } from "@/i18n/languages";
import { useLanguage, usePageMetadata } from "@/i18n/LanguageProvider";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BirdSvg } from "@/components/garden/BirdSvg";
import { FoodIcon } from "@/components/FoodIcon";
import { BIRD_TEXT, BIRDS, LOVES, type Bird } from "@/data/birds";
import { FOOD_TEXT, getFood, type FoodId } from "@/data/foods";
import { loadCollection, loadSound, loadStreak, markBookSeen, saveSound, type Collection } from "@/lib/storage";
import { liveStreak, todayKey } from "@/lib/game";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RarityBadge, RarityGem } from "@/components/garden/RarityBadge";
import { PageShell } from "@/components/layout/PageShell";
import { favoritesKnown } from "@/lib/personality";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Lock, MessageCircle } from "lucide-react";
import { birdChatUrl, birdSearchUrl } from "@/lib/bird-links";

export const Route = createFileRoute("/book")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: translate("bookTitle") },
      { name: "description", content: translate("bookDescription") },
      { property: "og:title", content: translate("bookOgTitle") },
      { property: "og:description", content: translate("bookOgDescription") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Book,
});

const favorites = (b: Bird) =>
  (Object.entries(b.affinity) as [FoodId, number][]).filter(([, v]) => v >= LOVES).map(([f]) => getFood(f));


const RING = { common: "var(--rarity-common)", uncommon: "var(--rarity-uncommon)", rare: "var(--rare)" } as const;

let snapshot: Collection | null = null;

function Book() {
  usePageMetadata("book");
  const { t, text, number, date, language } = useLanguage();
  const birdText = (bird: Bird) => text(BIRD_TEXT[bird.id] ?? { en: bird });
  const [book, setBook] = useState<Collection>({});
  const [best, setBest] = useState(0);
  const [open, setOpen] = useState<Bird | null>(null);
  const [streak, setStreak] = useState(0);
  const [sound, setSound] = useState(false);
  useEffect(() => {
    // Snapshot before clearing "New!" flags; survives dev double-mounting.
    if (!snapshot) {
      snapshot = loadCollection();
      markBookSeen();
    }
    setBook(snapshot);
    setBest(loadStreak().best);
    setStreak(liveStreak(loadStreak(), todayKey()));
    setSound(loadSound());
    return () => {
      setTimeout(() => (snapshot = null), 0);
    };
  }, []);

  const openEntry = open ? book[open.id] : undefined;
  const collected = BIRDS.filter((b) => book[b.id]).length;
  const total = Object.values(book).reduce((a, e) => a + (e?.visits || 0), 0);

  return (
    <PageShell streak={streak} sound={sound} onToggleSound={() => { saveSound(!sound); setSound(!sound); }}>
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border-2 border-border bg-card px-4 font-display text-sm text-card-foreground shadow-soft transition-transform hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"><ArrowLeft aria-hidden="true" className="size-4" />{t("back")}</Link>
      <h1 className="text-center font-display text-4xl text-foreground">{t("book")}</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-card bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">{t("of", { count: collected, total: BIRDS.length })}</p>
          <p className="text-xs text-muted-foreground">{t("collected")}</p>
          <div role="progressbar" aria-label={t("collectionProgress")} aria-valuemin={0} aria-valuemax={BIRDS.length} aria-valuenow={collected} className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${(collected / BIRDS.length) * 100}%` }} />
          </div>
        </div>
        <div className="rounded-card bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">{number(total)}</p>
          <p className="text-xs text-muted-foreground">{t("totalVisits")}</p>
        </div>
        <div className="rounded-card bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">🔥 {number(best)}</p>
          <p className="text-xs text-muted-foreground">{t("bestStreak")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {BIRDS.map((b) => {
          const e = book[b.id];
          if (!e)
            return (
              <div key={b.id} role="img" aria-label={t("undiscovered")} className="relative flex flex-col items-center overflow-hidden rounded-card bg-card p-3 text-center shadow-soft">
                <div aria-hidden className="flex flex-col items-center opacity-60 saturate-50">
                  <div className="h-20 w-20 rounded-full bg-garden-soft p-2 blur-[3px]">
                    <BirdSvg look={b.look} className="h-full w-full" />
                  </div>
                  <p className="mt-2 font-display text-base leading-tight text-foreground blur-[6px]">{birdText(b).name}</p>
                </div>
                <div aria-hidden className="absolute inset-0 bg-card/20" />
              </div>
            );
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setOpen(b)}
              className="card-pop relative flex cursor-pointer flex-col items-center rounded-card bg-paper p-3 text-center shadow-soft transition-transform hover:-translate-y-1 active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span aria-hidden className="absolute left-2 top-2"><RarityGem rarity={b.rarity} className="scale-75" /></span>
              {e.unseenInBook && (
                <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 font-display text-[10px] text-primary-foreground">{t("new")}</span>
              )}
              <div className="h-20 w-20 rounded-full bg-garden-soft p-2">
                <BirdSvg look={b.look} title={birdText(b).name} className="h-full w-full" />
              </div>
              <p className="mt-2 font-display text-base leading-tight text-foreground">{birdText(b).name}</p>
            </button>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        {open && openEntry && (
          <DialogContent className="viewport-dialog max-w-sm overflow-y-auto rounded-card border-0 bg-card text-card-foreground shadow-soft">
            <DialogHeader className="items-center text-center">
              <div className={`h-36 w-36 rounded-full bg-garden-soft p-4 ${open.rarity === "rare" ? "rare-glow" : ""}`} style={{ boxShadow: `0 0 0 3px var(--card), 0 0 0 6px ${RING[open.rarity]}, 0 0 0 9px var(--card), 0 0 0 10px ${RING[open.rarity]}, 0 0 22px 8px color-mix(in oklab, ${RING[open.rarity]} ${open.rarity === "rare" ? 55 : 30}%, transparent)` }}>
                <BirdSvg look={open.look} className="h-full w-full" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <DialogTitle className="font-display text-2xl text-foreground">{birdText(open).name}</DialogTitle>
                <RarityBadge rarity={open.rarity} />
              </div>
              <DialogDescription className="text-muted-foreground">{birdText(open).fact}</DialogDescription>
            </DialogHeader>
            <dl className="space-y-2 text-sm">
              <Row label={t("firstSeen")}>{date(openEntry.firstSeen)}</Row>
              <Row label={t("visits")}>{t(openEntry.visits === 1 ? "visitedOne" : "visited", { count: openEntry.visits })}</Row>
              {(openEntry.seenFoods ?? []).length > 0 && (
                <Row label={t("seenEating")}><Chips>{openEntry.seenFoods?.map((id) => <FoodChip key={id} id={id} label={text(FOOD_TEXT[id])} />)}</Chips></Row>
              )}
              {favoritesKnown(openEntry.visits) ? (
                <Row label={t("favorites")}><Chips>{favorites(open).map((f) => <FoodChip key={f.id} id={f.id} label={text(FOOD_TEXT[f.id])} />)}</Chips></Row>
              ) : (
                <Row label={t("favorites")}>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Lock aria-hidden="true" className="size-4 shrink-0" />
                    {3 - openEntry.visits === 1 ? t("favoritesHintOne") : t("favoritesHint", { count: 3 - openEntry.visits })}
                    <span className="ml-auto font-display text-xs">{openEntry.visits}/3</span>
                  </span>
                </Row>
              )}
            </dl>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="secondary" size="sm">
                <a href={birdSearchUrl(birdText(open).name, language)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden="true" />{t("findOutMore")}
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <a href={birdChatUrl(birdText(open).name, language)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" />{t("askChatGPT")}
                </a>
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageShell>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-2">
      <dt className="font-display text-xs text-secondary-foreground">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}

function Chips({ children }: { children: ReactNode }) {
  return <span className="mt-1 flex flex-wrap gap-1.5">{children}</span>;
}

function FoodChip({ id, label }: { id: FoodId; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1.5 pr-3 text-xs text-card-foreground">
      <FoodIcon id={id} size={20} />{label}
    </span>
  );
}
