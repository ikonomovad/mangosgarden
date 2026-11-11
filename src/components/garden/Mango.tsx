import type { Mood } from "@/data/mango-lines";
import { BirdSvg } from "./BirdSvg";

const MANGO_LOOK = {
  body: "#f7d23a",
  belly: "#fbe68a",
  wing: "#e9c22c",
  beak: "#f4ead8",
  tail: "#5fae5a",
  marking: "face" as const,
  markingColor: "#f0682f",
};

export function Mango({ mood = "neutral", className }: { mood?: Mood | "neutral"; className?: string }) {
  return (
    <div className={className}>
      <BirdSvg look={MANGO_LOOK} mood={mood} title="Mango the lovebird" className="h-full w-full" />
    </div>
  );
}
