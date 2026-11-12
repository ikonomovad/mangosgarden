import { t as translate } from "@/i18n/languages";
import { useLanguage, usePageMetadata } from "@/i18n/LanguageProvider";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BirdCard } from "@/components/garden/BirdCard";
import { BirdSvg } from "@/components/garden/BirdSvg";
import { FoodIcon } from "@/components/FoodIcon";
import { FoodPicker } from "@/components/garden/FoodPicker";
import { GardenScene } from "@/components/garden/GardenScene";
import { Mango } from "@/components/garden/Mango";
import { MeetMango } from "@/components/garden/MeetMango";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell } from "@/components/layout/PageShell";
import { BIRD_TEXT, LOVES, getAffinity, getBird, type Bird } from "@/data/birds";
import type { FoodId } from "@/data/foods";
import { MANGO_TEXT, GREETINGS, MILESTONE_LINES, type Milestone, type Mood } from "@/data/mango-lines";
import { daysBefore, getDailyOffer, liveStreak, msUntilMidnight, nextDaysSinceRare, nextStreak, pickVisitor, todayKey } from "@/lib/game";
import { pickRandom } from "@/lib/random";
import { claimMilestones, loadCollection, loadDaysSinceRare, saveDaysSinceRare, loadHistory, loadPersonality, loadSound, loadStreak, nextReactionLine, recordVisit, saveDay, saveSound, saveStreak } from "@/lib/storage";
import { pendingMilestones, reactionFor } from "@/lib/personality";
import { playArrival, playPat } from "@/lib/sounds";
import { PatButton, PatHearts } from "@/components/garden/PatMango";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: translate("indexTitle") },
      { name: "description", content: translate("indexDescription") },
      { property: "og:title", content: translate("indexTitle") },
      { property: "og:image", content: "https://mangosgarden.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://mangosgarden.lovable.app/og-image.jpg" },
      { property: "og:description", content: translate("indexOgDescription") },
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
  usePageMetadata("index");
  const { t, text } = useLanguage();
  const mangoLine = (value: string) => text(MANGO_TEXT[value] ?? { en: value });
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
  const [patAnim, setPatAnim] = useState<number | null>(null);
  const [patted, setPatted] = useState(false);

  const pat = () => {
    setPatted(true);
    if (sound) playPat();
    setPatAnim((n) => (n ?? 0) + 1);
  };

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
    setPatted(false);
    setPatAnim(null);
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

  return (
    <PageShell streak={streak} sound={sound} onToggleSound={() => { saveSound(!sound); setSound(!sound); }}>
      {screen === "welcome" && (
        <section className="card-pop flex flex-1 flex-col items-center justify-center gap-[var(--gap)] text-center">
          <Mango className="mango-idle h-40 w-40" />
          <div>
            <p className="font-display text-sm uppercase tracking-widest text-secondary-foreground">{t("appName")}</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-foreground">{t("welcomeTitle")}</h1>
            <p className="mt-3 text-muted-foreground">{t("welcomeText")}</p>
          </div>
          <div className="flex flex-col items-center">
            <Button size="lg" className="rounded-full px-10 font-display text-lg shadow-soft" onClick={() => setScreen("garden")}>
              {t("start")}
            </Button>
            <MeetMango />
          </div>
        </section>
      )}

      {screen === "garden" && (
        <section className="relative z-10 flex flex-1 flex-col justify-end gap-[var(--gap)] pb-4">
          <h1 className="sr-only">{t("appName")}</h1>
          <GardenScene
            full
            line={patted ? t("patLine") : mangoLine(greeting)}
            mangoAnim={patAnim ? `mango-pat pat-${patAnim}` : undefined}
            mangoOverlay={patAnim ? <PatHearts key={patAnim} /> : null}
          />
          <div className="relative z-10 flex justify-end">
            <PatButton today={today} onPat={pat} />
          </div>
          <Button size="lg" className="relative z-10 rounded-full font-display text-lg shadow-soft" onClick={() => setPantryOpen(true)}>
            {t("snack")}
          </Button>
        </section>
      )}

      <Dialog open={pantryOpen && screen === "garden"} onOpenChange={setPantryOpen}>
        <DialogContent className="viewport-dialog overflow-y-auto rounded-card border-0 bg-card sm:max-w-[var(--page-max)]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl text-foreground">{t("pantry")}</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">{t("pantryText")}</DialogDescription>
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
                line={mangoLine(line)}
                feederFood={<FoodIcon id={food} size={24} />}
                visitor={
                  <div className="bird-drop" onAnimationEnd={() => setTimeout(() => setScreen("card"), 1400)}>
                    <BirdSvg look={visitor.look} title={text(BIRD_TEXT[visitor.id] ?? { en: visitor }).name} className="h-24 w-24" />
                  </div>
                }
              />
              <h1 className="relative z-10 self-center rounded-full bg-card px-5 py-2 text-center font-display text-xl font-normal text-foreground shadow-soft">{t("arrival")}</h1>
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
                    <p className="bubble-left relative flex-1 rounded-card bg-muted px-3 py-2.5 text-sm leading-snug text-foreground">{mangoLine(line)}</p>
                  </div>
                }
              />
              {milestones.length > 0 && (
                <div role="status" className="card-pop space-y-1 rounded-card bg-rare px-4 py-3 text-center font-display text-sm text-rare-foreground shadow-soft">
                  {milestones.map((id) => <p key={id}>🎉 {mangoLine(MILESTONE_LINES[id])}</p>)}
                </div>
              )}
              <div className="flex flex-col items-center gap-3 rounded-card bg-card p-4 text-center shadow-soft">
                <p className="flex items-center gap-2 font-display text-base text-secondary-foreground">
                  <Sprout className="h-5 w-5" aria-hidden /> {t("resting")}
                </p>
                <Countdown onMidnight={loadToday} />
              </div>
            </>
          )}
        </section>
      )}

    </PageShell>
  );
}

function Countdown({ onMidnight }: { onMidnight: () => void }) {
  const { t: translate, number } = useLanguage();
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const left = msUntilMidnight();
      setMs(left);
      if (left <= 1000) setTimeout(onMidnight, left + 50);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [onMidnight]);
  if (ms === null) return null;
  const t = Math.ceil(ms / 1000);
  const pad = (n: number) => number(n, { minimumIntegerDigits: 2, useGrouping: false });
  return (
    <p aria-label={translate("countdown")} className="rounded-full bg-primary px-5 py-2 font-display text-2xl tabular-nums text-primary-foreground">
      {pad(Math.floor(t / 3600))}{translate("hours")} {pad(Math.floor((t % 3600) / 60))}{translate("minutes")} {pad(t % 60)}{translate("seconds")}
    </p>
  );
}
