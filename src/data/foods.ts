// Edit freely: the 10 foods the garden can offer.
export type FoodId =
  | "sunflower" | "millet" | "peanuts" | "nyjer" | "apple"
  | "berries" | "orange" | "mealworms" | "fatball" | "water";

export interface Food {
  id: FoodId;
  name: string;
  emoji: string;
}

export const FOODS: Food[] = [
  { id: "sunflower", name: "Sunflower seeds", emoji: "🌻" },
  { id: "millet", name: "Millet", emoji: "🌾" },
  { id: "peanuts", name: "Peanuts", emoji: "🥜" },
  { id: "nyjer", name: "Nyjer seeds", emoji: "🖤" },
  { id: "apple", name: "Apple slices", emoji: "🍎" },
  { id: "berries", name: "Mixed berries", emoji: "🫐" },
  { id: "orange", name: "Orange half", emoji: "🍊" },
  { id: "mealworms", name: "Mealworms", emoji: "🐛" },
  { id: "fatball", name: "Fat ball", emoji: "🟤" },
  { id: "water", name: "Fresh water bath", emoji: "💧" },
];

export const FOOD_IDS: FoodId[] = FOODS.map((f) => f.id);
export const getFood = (id: FoodId) => FOODS.find((f) => f.id === id)!;
