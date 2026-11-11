import type { ReactNode } from "react";
import type { Mood } from "@/data/mango-lines";
import { Mango } from "./Mango";
import { SpeechBubble } from "./SpeechBubble";

interface GardenSceneProps {
  mood?: Mood | "neutral";
  line?: string;
  feederFood?: string;
  visitor?: ReactNode;
}

/** Garden backdrop with a feeder, a branch, and Mango on his perch. */
export function GardenScene({ mood = "neutral", line, feederFood, visitor }: GardenSceneProps) {
  return (
    <div className="garden-sky relative h-80 w-full overflow-hidden rounded-card shadow-soft">
      <div className="absolute left-6 top-6 h-12 w-12 rounded-full bg-sun" />
      <div className="absolute -left-10 top-14 h-10 w-32 rounded-full bg-cloud" />
      <div className="absolute right-4 top-10 h-8 w-24 rounded-full bg-cloud" />
      <div className="absolute inset-x-0 bottom-0 h-20 rounded-t-[50%] bg-grass" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-grass-deep" />

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
        <Mango mood={mood} className={mood === "neutral" ? "mango-idle h-full w-full" : "mango-react h-full w-full"} />
      </div>
      {line && (
        <div className="absolute bottom-24 right-4 z-10">
          <SpeechBubble>{line}</SpeechBubble>
        </div>
      )}
    </div>
  );
}
