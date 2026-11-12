import { useLanguage } from "@/i18n/LanguageProvider";
import { FOOD_TEXT, getFood, type FoodId } from "@/data/foods";
import { FoodIcon } from "@/components/FoodIcon";

export function FoodPicker({ offer, onPick }: { offer: FoodId[]; onPick: (f: FoodId) => void }) {
  const { text } = useLanguage();
  return (
    <div className="grid grid-cols-2 gap-3">
      {offer.map((id) => {
        const food = getFood(id);
        const { text } = useLanguage();
  return (
          <button
            key={id}
            onClick={() => onPick(id)}
            className="flex flex-col items-center gap-2 rounded-card border-2 border-border bg-card p-4 font-display text-card-foreground shadow-soft transition-transform hover:-translate-y-1 active:scale-95"
          >
            <span className="text-4xl"><FoodIcon id={id} size={40} /></span>
            <span className="text-sm">{text(FOOD_TEXT[food.id])}</span>
          </button>
        );
      })}
    </div>
  );
}
