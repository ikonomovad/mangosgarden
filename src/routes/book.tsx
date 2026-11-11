import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BirdSvg } from "@/components/garden/BirdSvg";
import { BIRDS, LOVES, type Bird } from "@/data/birds";
import { getFood, type FoodId } from "@/data/foods";
import { loadCollection, markBookSeen, type Collection } from "@/lib/storage";

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
  useEffect(() => {
    // Snapshot before clearing "New!" flags; survives dev double-mounting.
    if (!snapshot) {
      snapshot = loadCollection();
      markBookSeen();
    }
    setBook(snapshot);
    return () => {
      setTimeout(() => (snapshot = null), 0);
    };
  }, []);

  const collected = BIRDS.filter((b) => book[b.id]).length;
  const total = Object.values(book).reduce((a, e) => a + (e?.visits || 0), 0);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 py-6">
      <Link to="/" className="self-start font-display text-secondary-foreground">← Back to the garden</Link>
      <h1 className="text-center font-display text-4xl text-foreground">Bird book</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">{collected} of {BIRDS.length}</p>
          <p className="text-xs text-muted-foreground">collected</p>
        </div>
        <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
          <p className="font-display text-2xl text-card-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">total visits</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BIRDS.map((b) => {
          const e = book[b.id];
          if (!e)
            return (
              <div key={b.id} className="flex flex-col items-center rounded-2xl bg-muted p-3 text-center">
                <div className="h-20 w-20 rounded-full bg-background/50 p-2">
                  <BirdSvg look={b.look} className="h-full w-full opacity-70 brightness-0" />
                </div>
                <p className="mt-2 font-display text-lg text-muted-foreground">???</p>
              </div>
            );
          return (
            <div key={b.id} className="card-pop relative flex flex-col items-center rounded-2xl bg-paper p-3 text-center shadow-soft">
              {e.unseenInBook && (
                <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 font-display text-[10px] text-primary-foreground">New!</span>
              )}
              <div className="h-20 w-20 rounded-full bg-garden-soft p-2">
                <BirdSvg look={b.look} title={b.name} className="h-full w-full" />
              </div>
              <p className="mt-2 font-display text-base leading-tight text-foreground">{b.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{b.fact}</p>
              <p className="mt-2 text-xs text-foreground">Loves: {favorites(b).map((f) => f.emoji).join(" ")}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">First seen {formatDate(e.firstSeen)}</p>
              <p className="text-[11px] font-semibold text-secondary-foreground">Visited {e.visits} {e.visits === 1 ? "time" : "times"}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
