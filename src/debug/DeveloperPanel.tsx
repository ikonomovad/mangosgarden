import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Clock, RotateCcw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BIRDS } from "@/data/birds";
import { getFood } from "@/data/foods";
import { ENABLE_DEBUG_PANEL, liveStreak } from "@/lib/game";
import { changeClock, clearGameData, debugEnabled, readDebugState, resetToday, setDebugPity, setDebugStreak, setDebugVisits } from "./actions";

export function DeveloperPanel({ onApply = () => window.location.reload() }: { onApply?: () => void }) {
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
    if (action() === false) { setError("Enter a whole number of zero or more, and allow browser storage."); return; }
    setError("");
    setState(readDebugState());
    onApply();
  };
  const names = (ids: typeof state.offer) => ids.map((id) => getFood(id).name).join(", ") || "None recorded";
  const time = `${state.today} ${state.now.toLocaleTimeString()}`;

  return (
    <aside aria-label="Developer test panel" className="relative z-30 border-t border-border bg-card px-[var(--page-pad)] py-4 text-card-foreground">
      <div className="mx-auto max-w-3xl space-y-3">
        {state.shifted && <p role="status" className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">Fake clock active: {time}</p>}
        <Button variant="ghost" className="min-h-11 w-full justify-between" aria-expanded={open} aria-controls="developer-drawer" onClick={() => setOpen(!open)}>
          <span className="flex items-center gap-2"><Wrench /> Developer test panel</span>{open ? <ChevronUp /> : <ChevronDown />}
        </Button>
        {open && <div id="developer-drawer" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, -1].map((days) => <Button key={days} variant="secondary" className="min-h-11" onClick={() => apply(() => changeClock(days))}><Clock />{days > 0 ? "+" : ""}{days} {Math.abs(days) === 1 ? "day" : "days"}</Button>)}
            <Button variant="secondary" className="min-h-11" onClick={() => apply(() => changeClock("late"))}>Jump to 23:59</Button>
            <Button variant="outline" className="min-h-11" onClick={() => apply(() => changeClock("real"))}>Back to real time</Button>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries({ "Fake date": time, "Today's foods": names(state.offer), "Yesterday's foods": names(state.yesterdayOffer), "Streak": `${liveStreak(state.streak, state.today)} (saved: ${state.streak.current})`, "Best streak": state.streak.best, "Days since last rare": state.pity, "Today's bird": BIRDS.find((b) => b.id === state.visit?.visitor)?.name ?? "None", "Today's food": state.visit?.food ? getFood(state.visit.food).name : "None", "Daily lock": state.locked ? "On" : "Off" }).map(([label, value]) => <div key={label} className="min-w-0"><dt className="font-semibold">{label}</dt><dd className="break-words text-muted-foreground">{value}</dd></div>)}
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); apply(() => setDebugStreak(Number(streak))); }}>
              <label htmlFor="debug-streak">Streak</label><div className="flex gap-2"><Input id="debug-streak" type="number" min="0" step="1" required value={streak} onChange={(e) => setStreak(e.target.value)} /><Button type="submit" className="min-h-11">Set streak</Button></div>
            </form>
            <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); apply(() => setDebugPity(Number(pity))); }}>
              <label htmlFor="debug-pity">Days since last rare</label><div className="flex gap-2"><Input id="debug-pity" type="number" min="0" step="1" required value={pity} onChange={(e) => setPity(e.target.value)} /><Button type="submit" className="min-h-11">Set counter</Button></div>
            </form>
            <form className="space-y-2 sm:col-span-2" onSubmit={(e) => { e.preventDefault(); apply(() => setDebugVisits(bird, Number(visits))); }}>
              <label htmlFor="debug-bird">Bird visit count</label>
              <select id="debug-bird" className="min-h-11 w-full rounded-md border border-input bg-card px-3 text-foreground" value={bird} onChange={(e) => setBird(e.target.value)}>{BIRDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
              <div className="flex gap-2"><Input aria-label="Visit count" type="number" min="0" step="1" required value={visits} onChange={(e) => setVisits(e.target.value)} /><Button type="submit" className="min-h-11">Set visits</Button></div>
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => apply(resetToday)}><RotateCcw /> Reset today</Button>
            <Button variant="destructive" className="min-h-11" onClick={() => { if (window.confirm("Clear all Mango's Garden progress? This cannot be undone.")) apply(clearGameData); }}>Clear all game data</Button>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>}
      </div>
    </aside>
  );
}