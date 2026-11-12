import { useLanguage } from "@/i18n/LanguageProvider";
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
  const { t } = useLanguage();
  return (
    <div className={className}>
      <BirdSvg look={MANGO_LOOK} mood={mood} title={t("mango")} className="h-full w-full" />
    </div>
  );
}
