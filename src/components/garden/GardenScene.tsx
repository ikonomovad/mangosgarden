import { useEffect, useState, type ReactNode } from "react";
import { ENABLE_DEBUG_PANEL, getNow } from "@/lib/game";
import { currentSeason, type Season } from "@/lib/season";
import type { Mood } from "@/data/mango-lines";
import { Mango } from "./Mango";
import { SpeechBubble } from "./SpeechBubble";
import { GardenDecor } from "./GardenDecor";

interface GardenSceneProps {
  mood?: Mood | "neutral";
  line?: string;
  feederFood?: ReactNode;
  visitor?: ReactNode;
  /** Fill the whole screen behind the page content. */
  full?: boolean;
  /** Extra animation class for Mango (e.g. pat reactions). */
  mangoAnim?: string | undefined;
  /** Overlay drawn around Mango (e.g. floating hearts). */
  mangoOverlay?: ReactNode | undefined;
}

/** Garden backdrop with a feeder, a branch, and Mango on his perch. */
export function GardenScene({ mood = "neutral", line, feederFood, visitor, full = false, mangoAnim, mangoOverlay }: GardenSceneProps) {
  // Season is read after hydration so server and browser markup match.
  const [season, setSeason] = useState<Season>("summer");
  useEffect(() => setSeason(currentSeason(getNow(), ENABLE_DEBUG_PANEL)), []);
  return (
    <div data-season={season} className={full ? "garden-sky viewport-height fixed inset-x-0 top-0 z-0 overflow-hidden" : "garden-sky relative h-80 w-full overflow-hidden rounded-card shadow-soft"}>
      <div className={`absolute h-12 w-12 rounded-full bg-sun ${full ? "left-1/4 top-28" : "left-6 top-6"}`} />
      <div className="absolute -left-10 top-14 h-10 w-32 rounded-full bg-cloud" />
      <div className="absolute right-4 top-10 h-8 w-24 rounded-full bg-cloud" />
      <div className={`absolute inset-x-0 bottom-0 rounded-t-[50%] bg-grass ${full ? "h-56" : "h-20"}`} />
      <div className={`absolute inset-x-0 bottom-0 bg-grass-deep ${full ? "h-44" : "h-10"}`} />
      {full && <GardenDecor season={season} />}

      <div className={full ? "absolute bottom-36 left-1/2 h-80 w-full max-w-[var(--page-max)] -translate-x-1/2" : "absolute inset-0"}>

      {/* feeder */}
      <div className="absolute bottom-10 left-8 flex flex-col items-center">
        <div className="h-3 w-24 rounded-full bg-wood" />
        <div className="flex h-10 w-20 items-center justify-center rounded-b-xl bg-wood-light text-2xl">
          {feederFood}
        </div>
        <div className="h-16 w-2 bg-wood" />
      </div>

      {/* visitor lands on the feeder */}
      {visitor && <div className="absolute bottom-[8.5rem] left-8 w-24">{visitor}</div>}

      {/* branch + Mango */}
      <div className="absolute right-0 top-32 h-3 w-40 rounded-l-full bg-wood" />
      <div className="absolute right-6 top-14 h-20 w-20">
        <div key={mangoAnim} className={`h-full w-full ${mangoAnim ?? ""}`}>
          <Mango mood={mood} className={mood === "neutral" ? "mango-idle h-full w-full" : "mango-react h-full w-full"} />
        </div>
        {mangoOverlay}
      </div>
      {line && (
        <div className="absolute bottom-24 right-4 z-10">
          <SpeechBubble>{line}</SpeechBubble>
        </div>
      )}
      </div>
    </div>
  );
}
