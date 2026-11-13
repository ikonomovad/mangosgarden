import { useLanguage } from "@/i18n/LanguageProvider";
import { BIRD_TEXT } from "@/data/birds";
import { FOOD_TEXT } from "@/data/foods";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Clock, RotateCcw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BIRDS } from "@/data/birds";
import { ENABLE_DEBUG_PANEL, liveStreak } from "@/lib/game";
import { changeClock, clearGameData, completeBook, debugEnabled, readDebugState, resetToday, setDebugPity, setDebugStreak, setDebugVisits } from "./actions";

export function DeveloperPanel({ onApply = () => window.location.reload() }: { onApply?: () => void }) {
  const { t, text, number, locale } = useLanguage();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ReturnType<typeof readDebugState> | null>(null);
  const [streak, setStreak] = useState("0");
  const [pity, setPity] = useState("0");
  const [bird, setBird] = useState(BIRDS[0]?.id ?? "robin");
  const [visits, setVisits] = useState("1");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ENABLE_DEBUG_PANEL || !debugEnabled()) return;
    setEnabled(true);
    const update = () => setState(readDebugState());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!ENABLE_DEBUG_PANEL || !enabled || !state) return null;
  const apply = (action: () => boolean | void) => {
    if (action() === false) { setError(t("debugError")); return; }
    setError("");
    setState(readDebugState());
    onApply();
  };
  const names = (ids: typeof state.offer) => ids.map((id) => text(FOOD_TEXT[id])).join(", ") || t("noneRecorded");
  const time = `${state.today} ${state.now.toLocaleTimeString(locale)}`;

  return (
    <aside aria-label={t("debug")} className="relative z-30 border-t border-border bg-card px-[var(--page-pad)] py-4 text-card-foreground">
      <div className="mx-auto max-w-3xl space-y-3">
        {state.shifted && <p role="status" className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">{t("fakeActive", { time })}</p>}
        <Button variant="ghost" className="min-h-11 w-full justify-between" aria-expanded={open} aria-controls="developer-drawer" onClick={() => setOpen(!open)}>
          <span className="flex items-center gap-2"><Wrench /> {t("debug")}</span>{open ? <ChevronUp /> : <ChevronDown />}
        </Button>
        {open && <div id="developer-drawer" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, -1].map((days) => <Button key={days} variant="secondary" className="min-h-11" onClick={() => apply(() => changeClock(days))}><Clock />{days > 0 ? "+" : ""}{number(days)} {t(Math.abs(days) === 1 ? "day" : "days")}</Button>)}
            <Button variant="secondary" className="min-h-11" onClick={() => apply(() => changeClock("late"))}>{t("jumpLate")}</Button>
            <Button variant="outline" className="min-h-11" onClick={() => apply(() => changeClock("real"))}>{t("realTime")}</Button>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries({ [t("fakeDate")]: time, [t("todayFoods")]: names(state.offer), [t("yesterdayFoods")]: names(state.yesterdayOffer), [t("debugStreak")]: `${number(liveStreak(state.streak, state.today))} (${t("saved")}: ${number(state.streak.current)})`, [t("bestStreak")]: number(state.streak.best), [t("pity")]: number(state.pity), [t("todayBird")]: state.visit?.visitor && BIRD_TEXT[state.visit.visitor] ? text(BIRD_TEXT[state.visit.visitor] ?? { en: { name: t("none"), fact: "" } }).name : t("none"), [t("todayFood")]: state.visit?.food ? text(FOOD_TEXT[state.visit.food]) : t("none"), [t("lock")]: t(state.locked ? "on" : "off") }).map(([label, value]) => <div key={label} className="min-w-0"><dt className="font-semibold">{label}</dt><dd className="break-words text-muted-foreground">{value}</dd></div>)}
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); apply(() => setDebugStreak(Number(streak))); }}>
              <label htmlFor="debug-streak">{t("debugStreak")}</label><div className="flex gap-2"><Input id="debug-streak" type="number" min="0" step="1" required value={streak} onChange={(e) => setStreak(e.target.value)} /><Button type="submit" className="min-h-11">{t("setStreak")}</Button></div>
            </form>
            <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); apply(() => setDebugPity(Number(pity))); }}>
              <label htmlFor="debug-pity">{t("pity")}</label><div className="flex gap-2"><Input id="debug-pity" type="number" min="0" step="1" required value={pity} onChange={(e) => setPity(e.target.value)} /><Button type="submit" className="min-h-11">{t("setCounter")}</Button></div>
            </form>
            <form className="space-y-2 sm:col-span-2" onSubmit={(e) => { e.preventDefault(); apply(() => setDebugVisits(bird, Number(visits))); }}>
              <label htmlFor="debug-bird">{t("birdVisits")}</label>
              <select id="debug-bird" className="min-h-11 w-full rounded-md border border-input bg-card px-3 text-foreground" value={bird} onChange={(e) => setBird(e.target.value)}>{BIRDS.map((b) => <option key={b.id} value={b.id}>{text(BIRD_TEXT[b.id] ?? { en: b }).name}</option>)}</select>
              <div className="flex gap-2"><Input aria-label={t("visitCount")} type="number" min="0" step="1" required value={visits} onChange={(e) => setVisits(e.target.value)} /><Button type="submit" className="min-h-11">{t("setVisits")}</Button></div>
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => apply(resetToday)}><RotateCcw /> {t("reset")}</Button>
            <Button variant="secondary" className="min-h-11" onClick={() => apply(completeBook)}>{t("completeBook")}</Button>
            <Button variant="destructive" className="min-h-11" onClick={() => { if (window.confirm(t("clearConfirm"))) apply(clearGameData); }}>{t("clear")}</Button>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>}
      </div>
    </aside>
  );
}