import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BirdCard } from "@/components/garden/BirdCard";
import { BirdSvg } from "@/components/garden/BirdSvg";
import { FoodPicker } from "@/components/garden/FoodPicker";
import { GardenScene } from "@/components/garden/GardenScene";
import { Mango } from "@/components/garden/Mango";
import { Button } from "@/components/ui/button";
import { LOVES, getAffinity, type Bird } from "@/data/birds";
import { getFood, type FoodId } from "@/data/foods";
import { GREETINGS, MANGO_LINES, type Mood } from "@/data/mango-lines";
import { daysBefore, getDailyOffer, pickVisitor, toDateKey } from "@/lib/game";
import { pickRandom } from "@/lib/random";
import { loadHistory, resetDay, saveDay } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mango's Garden — a cozy daily bird game" },
      { name: "description", content: "Put out a snack, see which wild bird visits, and let Mango the lovebird react." },
      { property: "og:title", content: "Mango's Garden" },
      { property: "og:description", content: "A calm one-minute daily bird game hosted by Mango the lovebird." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Screen = "welcome" | "garden" | "choose" | "landing" | "card";

function moodFor(bird: Bird, food: FoodId): Mood {
  if (bird.rarity === "rare") return "excited";
  return getAffinity(bird, food) >= LOVES ? "happy" : "grumpy";
}

function Index() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [today, setToday] = useState("");
  const [offer, setOffer] = useState<FoodId[]>([]);
  const [greeting, setGreeting] = useState("");
  const [food, setFood] = useState<FoodId | null>(null);
  const [visitor, setVisitor] = useState<Bird | null>(null);
  const [mood, setMood] = useState<Mood>("happy");
  const [line, setLine] = useState("");

  const loadToday = () => {
    const key = toDateKey(new Date());
    const history = loadHistory();
    const todayOffer = history[key]?.offer ?? getDailyOffer(key, history[daysBefore(key, 1)]?.offer);
    saveDay(key, { offer: todayOffer });
    setToday(key);
    setOffer(todayOffer);
    setGreeting(pickRandom(GREETINGS, Math.random));
  };

  useEffect(loadToday, []);

  const choose = (f: FoodId) => {
    const history = loadHistory();
    const bird = pickVisitor(today, f, {
      yesterday: history[daysBefore(today, 1)]?.visitor,
      twoDaysAgo: history[daysBefore(today, 2)]?.visitor,
    });
    const m = moodFor(bird, f);
    saveDay(today, { food: f, visitor: bird.id });
    setFood(f);
    setVisitor(bird);
    setMood(m);
    setLine(pickRandom(MANGO_LINES[m], Math.random));
    setScreen("landing");
  };

  const reset = () => {
    resetDay(today);
    setFood(null);
    setVisitor(null);
    loadToday();
    setScreen("welcome");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      {screen === "welcome" && (
        <section className="card-pop flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <Mango className="mango-idle h-40 w-40" />
          <div>
            <p className="font-display text-sm uppercase tracking-widest text-secondary-foreground">Mango's Garden</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-foreground">Who's coming for breakfast?</h1>
            <p className="mt-3 text-muted-foreground">Put out one snack a day and see which wild bird drops by.</p>
          </div>
          <Button size="lg" className="rounded-full px-10 font-display text-lg shadow-soft" onClick={() => setScreen("garden")}>
            Start
          </Button>
        </section>
      )}

      {screen === "garden" && (
        <section className="card-pop flex flex-col gap-6">
          <GardenScene line={greeting} />
          <Button size="lg" className="rounded-full font-display text-lg shadow-soft" onClick={() => setScreen("choose")}>
            Put out a snack
          </Button>
        </section>
      )}

      {screen === "choose" && (
        <section className="card-pop flex flex-col gap-5">
          <h2 className="text-center font-display text-3xl text-foreground">Today's pantry</h2>
          <p className="-mt-3 text-center text-muted-foreground">Pick one to put on the feeder.</p>
          <FoodPicker offer={offer} onPick={choose} />
        </section>
      )}

      {(screen === "landing" || screen === "card") && visitor && food && (
        <section className="flex flex-col gap-6">
          {screen === "landing" ? (
            <>
              <GardenScene
                mood={mood}
                line={line}
                feederFood={getFood(food).emoji}
                visitor={
                  <div className="bird-drop" onAnimationEnd={() => setTimeout(() => setScreen("card"), 1400)}>
                    <BirdSvg look={visitor.look} title={visitor.name} className="h-24 w-24" />
                  </div>
                }
              />
              <p className="text-center font-display text-xl text-foreground">Someone's here…</p>
            </>
          ) : (
            <>
              <BirdCard bird={visitor} />
              <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <Mango mood={mood} className="h-14 w-14 shrink-0" />
                <p className="text-sm text-card-foreground">{line}</p>
              </div>
              <p className="text-center font-display text-lg text-secondary-foreground">Come back tomorrow for a new visitor 🌱</p>
            </>
          )}
        </section>
      )}

      {/* Testing only — remove later */}
      <button onClick={reset} className="mt-auto self-center text-xs text-muted-foreground opacity-30 hover:opacity-100">
        reset today
      </button>
    </main>
  );
}
