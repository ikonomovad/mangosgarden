import { getFood, type FoodId } from "@/data/foods";

export function FoodPicker({ offer, onPick }: { offer: FoodId[]; onPick: (f: FoodId) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {offer.map((id) => {
        const food = getFood(id);
        return (
          <button
            key={id}
            onClick={() => onPick(id)}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card p-4 font-display text-card-foreground shadow-soft transition-transform hover:-translate-y-1 active:scale-95"
          >
            <span className="text-4xl">{food.emoji}</span>
            <span className="text-sm">{food.name}</span>
          </button>
        );
      })}
    </div>
  );
}
