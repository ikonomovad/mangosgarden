import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BirdCard } from "@/components/garden/BirdCard";
import { BirdSvg } from "@/components/garden/BirdSvg";
import { FoodPicker } from "@/components/garden/FoodPicker";
import { GardenScene } from "@/components/garden/GardenScene";
import { Mango } from "@/components/garden/Mango";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell } from "@/components/layout/PageShell";
import { LOVES, getAffinity, getBird, type Bird } from "@/data/birds";
import { getFood, type FoodId } from "@/data/foods";
import { GREETINGS, MILESTONE_LINES, type Milestone, type Mood } from "@/data/mango-lines";
import { daysBefore, getDailyOffer, liveStreak, msUntilMidnight, nextDaysSinceRare, nextStreak, pickVisitor, todayKey } from "@/lib/game";
import { pickRandom } from "@/lib/random";
import { claimMilestones, loadCollection, loadDaysSinceRare, saveDaysSinceRare, loadHistory, loadPersonality, loadSound, loadStreak, nextReactionLine, recordVisit, resetDay, saveDay, saveSound, saveStreak } from "@/lib/storage";
import { pendingMilestones, reactionFor } from "@/lib/personality";
import { playArrival } from "@/lib/sounds";

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
  const [isNew, setIsNew] = useState(false);
  const [visits, setVisits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [learned, setLearned] = useState(false);
  const [sound, setSound] = useState(false);
  const [pantryOpen, setPantryOpen] = useState(false);

  const loadToday = () => {
    const key = todayKey();
    const history = loadHistory();
    const todayOffer = history[key]?.offer ?? getDailyOffer(key, history[daysBefore(key, 1)]?.offer);
    saveDay(key, { offer: todayOffer });
    setToday(key);
    setOffer(todayOffer);
    setGreeting(pickRandom(GREETINGS, Math.random));
    setStreak(liveStreak(loadStreak(), key));
    setSound(loadSound());
    setMilestones([]);
    setLearned(false);
    // Already fed today? Show today's card, locked.
    const rec = history[key];
    const bird = rec?.visitor ? getBird(rec.visitor) : undefined;
    if (rec?.food && bird) {
      const entry = loadCollection()[bird.id];
      const m = moodFor(bird, rec.food);
      setFood(rec.food);
      setVisitor(bird);
      setMood(m);
      const reactionLine = rec.reactionLine ?? nextReactionLine(reactionFor(bird, entry?.firstSeen === key && entry.visits === 1, history[daysBefore(key, 1)]?.visitor));
      if (!rec.reactionLine) saveDay(key, { reactionLine });
      setLine(reactionLine);
      setLearned(rec.learned ?? false);
      setVisits(entry?.visits ?? 1);
      setIsNew(entry?.firstSeen === key && entry.visits === 1);
      setScreen("card");
    } else {
      setFood(null);
      setVisitor(null);
      setScreen("welcome");
    }
  };

  useEffect(loadToday, []);

  useEffect(() => {
    if (screen !== "card") return;
    const eligible = pendingMilestones(Object.keys(loadCollection()).length, streak, loadPersonality().shown);
    const fresh = claimMilestones(eligible);
    if (fresh.length) setMilestones(fresh);
  }, [screen, streak, today]);

  // Also refresh a garden/pantry left open across local midnight.
  useEffect(() => {
    const checkDay = () => {
      if (today && todayKey() !== today) loadToday();
    };
    const id = setInterval(checkDay, 1000);
    window.addEventListener("focus", checkDay);
    return () => { clearInterval(id); window.removeEventListener("focus", checkDay); };
  }, [today]);

  const choose = (f: FoodId) => {
    if (!today || todayKey() !== today) return loadToday();
    const history = loadHistory();
    if (history[today]?.visitor) return loadToday(); // once a day
    const collection = loadCollection();
    const pityBefore = loadDaysSinceRare();
    const bird = pickVisitor(today, f, {
      yesterday: history[daysBefore(today, 1)]?.visitor,
      twoDaysAgo: history[daysBefore(today, 2)]?.visitor,
    }, Object.keys(collection), pityBefore);
    saveDaysSinceRare(nextDaysSinceRare(pityBefore, bird, Object.keys(collection)));
    const m = moodFor(bird, f);
    const before = loadStreak();
    const after = nextStreak(before, today);
    saveStreak(after);
    setStreak(after.current);
    const reactionLine = nextReactionLine(reactionFor(bird, !collection[bird.id], history[daysBefore(today, 1)]?.visitor));
    const entry = recordVisit(bird.id, today, f);
    const justLearned = entry.visits === 3;
    saveDay(today, { food: f, visitor: bird.id, streakBefore: before, pityBefore, collectionBefore: collection[bird.id] ?? null, reactionLine, learned: justLearned });
    setLearned(justLearned);
    setMilestones([]);
    setIsNew(entry.visits === 1);
    setVisits(entry.visits);
    setFood(f);
    setVisitor(bird);
    setMood(m);
    setLine(reactionLine);
    if (sound) playArrival(bird.rarity === "rare");
    setScreen("landing");
  };

  const reset = () => {
    resetDay(today);
    loadToday();
  };

  return (
    <PageShell streak={streak} sound={sound} onToggleSound={() => { saveSound(!sound); setSound(!sound); }}>
      {screen === "welcome" && (
        <section className="card-pop flex flex-1 flex-col items-center justify-center gap-[var(--gap)] text-center">
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
        <section className="relative z-10 flex flex-1 flex-col justify-end gap-[var(--gap)] pb-4">
          <GardenScene full line={greeting} />
          <Button size="lg" className="relative z-10 rounded-full font-display text-lg shadow-soft" onClick={() => setPantryOpen(true)}>
            Put out a snack
          </Button>
        </section>
      )}

      <Dialog open={pantryOpen && screen === "garden"} onOpenChange={setPantryOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-card border-0 bg-card sm:max-w-[var(--page-max)]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl text-foreground">Today's pantry</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">Pick one to put on the feeder.</DialogDescription>
          </DialogHeader>
          <FoodPicker offer={offer} onPick={(f) => { setPantryOpen(false); choose(f); }} />
        </DialogContent>
      </Dialog>

      {(screen === "landing" || screen === "card") && visitor && food && (
        <section className={screen === "card" ? "flex flex-col gap-4" : "relative z-10 flex flex-1 flex-col justify-end gap-[var(--gap)] pb-4"}>
          {screen === "landing" ? (
            <>
              <GardenScene
                full
                mood={mood}
                line={line}
                feederFood={getFood(food).emoji}
                visitor={
                  <div className="bird-drop" onAnimationEnd={() => setTimeout(() => setScreen("card"), 1400)}>
                    <BirdSvg look={visitor.look} title={visitor.name} className="h-24 w-24" />
                  </div>
                }
              />
              <p className="relative z-10 self-center rounded-full bg-card px-5 py-2 text-center font-display text-xl text-foreground shadow-soft">Someone's here…</p>
            </>
          ) : (
            <>
              <BirdCard
                bird={visitor}
                isNew={isNew}
                visits={visits}
                learned={learned}
                footer={
                  <div className="flex items-center gap-3">
                    <Mango mood={mood} className="h-14 w-14 shrink-0" />
                    <p className="bubble-left relative flex-1 rounded-card bg-muted px-3 py-2.5 text-sm leading-snug text-foreground">{line}</p>
                  </div>
                }
              />
              {milestones.length > 0 && (
                <div role="status" className="card-pop space-y-1 rounded-card bg-rare px-4 py-3 text-center font-display text-sm text-rare-foreground shadow-soft">
                  {milestones.map((id) => <p key={id}>🎉 {MILESTONE_LINES[id]}</p>)}
                </div>
              )}
              <div className="flex flex-col items-center gap-3 rounded-card bg-card p-4 text-center shadow-soft">
                <p className="flex items-center gap-2 font-display text-base text-secondary-foreground">
                  <Sprout className="h-5 w-5" aria-hidden /> The feeder is resting until tomorrow
                </p>
                <Countdown onMidnight={loadToday} />
              </div>
            </>
          )}
        </section>
      )}

      {/* Testing only — remove later */}
      <Button variant="ghost" size="sm" onClick={reset} className="relative z-10 mt-auto self-center text-xs text-muted-foreground opacity-30 hover:opacity-100">
        reset today
      </Button>
    </PageShell>
  );
}

function Countdown({ onMidnight }: { onMidnight: () => void }) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const left = msUntilMidnight(new Date());
      setMs(left);
      if (left <= 1000) setTimeout(onMidnight, left + 50);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [onMidnight]);
  if (ms === null) return null;
  const t = Math.ceil(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <p aria-label="Time until next visitor" className="rounded-full bg-primary px-5 py-2 font-display text-2xl tabular-nums text-primary-foreground">
      {pad(Math.floor(t / 3600))}h {pad(Math.floor((t % 3600) / 60))}m {pad(t % 60)}s
    </p>
  );
}
