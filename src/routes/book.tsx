import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BirdSvg } from "@/components/garden/BirdSvg";
import { BIRDS, LOVES, type Bird } from "@/data/birds";
import { getFood, type FoodId } from "@/data/foods";
import { loadCollection, loadSound, loadStreak, markBookSeen, saveSound, type Collection } from "@/lib/storage";
import { liveStreak, todayKey } from "@/lib/game";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell } from "@/components/layout/PageShell";
import { favoritesKnown } from "@/lib/personality";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Bird book — Mango's Garden" },
      { name: "description", content: "Every wild bird that has visited Mango's garden, with facts and visit counts." },
      { property: "og:title", content: "Mango's Bird Book" },
      { property: "og:description", content: "Collect all 12 garden birds in Mango's Garden." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Book,
});

const favorites = (b: Bird) =>
  (Object.entries(b.affinity) as [FoodId, number][]).filter(([, v]) => v >= LOVES).map(([f]) => getFood(f));

function formatDate(key: string) {
  const [y = 0, m = 1, d = 1] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

let snapshot: Collection | null = null;

function Book() {
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
      <Link to="/" className="self-start font-display text-secondary-foreground">← Back to the garden</Link>
      <h1 className="text-center font-display text-4xl text-foreground">Bird book</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-card bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">{collected} of {BIRDS.length}</p>
          <p className="text-xs text-muted-foreground">collected</p>
        </div>
        <div className="rounded-card bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">total visits</p>
        </div>
        <div className="rounded-card bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">🔥 {best}</p>
          <p className="text-xs text-muted-foreground">best streak</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {BIRDS.map((b) => {
          const e = book[b.id];
          if (!e)
            return (
              <div key={b.id} role="img" aria-label="Undiscovered bird" className="relative flex flex-col items-center overflow-hidden rounded-card bg-card p-3 text-center shadow-soft">
                <div aria-hidden className="flex flex-col items-center opacity-50 blur-[9px] saturate-50">
                  <div className="h-20 w-20 rounded-full bg-garden-soft p-2">
                    <BirdSvg look={b.look} className="h-full w-full" />
                  </div>
                  <p className="mt-2 font-display text-base leading-tight text-foreground">{b.name}</p>
                </div>
                <div aria-hidden className="absolute inset-0 bg-card/40 backdrop-blur-sm" />
              </div>
            );
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setOpen(b)}
              className="card-pop relative flex flex-col items-center rounded-card bg-paper p-3 text-center shadow-soft transition-transform hover:-translate-y-1 active:scale-95 focus-visible:outline-2 focus-visible:outline-ring"
            >
              {e.unseenInBook && (
                <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 font-display text-[10px] text-primary-foreground">New!</span>
              )}
              <div className="h-20 w-20 rounded-full bg-garden-soft p-2">
                <BirdSvg look={b.look} title={b.name} className="h-full w-full" />
              </div>
              <p className="mt-2 font-display text-base leading-tight text-foreground">{b.name}</p>
            </button>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        {open && openEntry && (
          <DialogContent className="max-w-sm rounded-card border-0 bg-card text-card-foreground shadow-soft">
            <DialogHeader className="items-center text-center">
              <div className="h-36 w-36 rounded-full bg-garden-soft p-4">
                <BirdSvg look={open.look} className="h-full w-full" />
              </div>
              <DialogTitle className="font-display text-2xl text-foreground">{open.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">{open.fact}</DialogDescription>
            </DialogHeader>
            <dl className="space-y-2 text-sm">
              <Row label="First seen">{formatDate(openEntry.firstSeen)}</Row>
              <Row label="Visits">Visited {openEntry.visits} {openEntry.visits === 1 ? "time" : "times"}</Row>
              {(openEntry.seenFoods ?? []).length > 0 && (
                <Row label="Seen eating:">{openEntry.seenFoods?.map((id) => { const f = getFood(id); return `${f.emoji} ${f.name}`; }).join(", ")}</Row>
              )}
              {favoritesKnown(openEntry.visits) && (
                <Row label="Favorite foods:">{favorites(open).map((f) => `${f.emoji} ${f.name}`).join(", ")}</Row>
              )}
            </dl>
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
