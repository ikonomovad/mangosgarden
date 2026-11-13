// Edit freely: the 14 foods the garden can offer.
export type FoodId =
  | "sunflower" | "millet" | "peanuts" | "wheat" | "apple"
  | "berries" | "orange" | "mealworms" | "walnut" | "water"
  | "figs" | "corn" | "pumpkin" | "rosehip";

export interface Food {
  id: FoodId;
  name: string;
  emoji: string;
}

export const FOODS: Food[] = [
  { id: "sunflower", name: "Sunflower seeds", emoji: "🌻" },
  { id: "millet", name: "Millet", emoji: "🟡" },
  { id: "peanuts", name: "Peanuts", emoji: "🥜" },
  { id: "wheat", name: "Wheat", emoji: "🌾" },
  { id: "apple", name: "Apple slices", emoji: "🍎" },
  { id: "berries", name: "Mixed berries", emoji: "🫐" },
  { id: "orange", name: "Orange half", emoji: "🍊" },
  { id: "mealworms", name: "Mealworms", emoji: "🐛" },
  { id: "walnut", name: "Walnuts", emoji: "🌰" },
  { id: "water", name: "Fresh water bath", emoji: "💧" },
  { id: "figs", name: "Figs", emoji: "🟣" },
  { id: "corn", name: "Corn", emoji: "🌽" },
  { id: "pumpkin", name: "Pumpkin seeds", emoji: "🎃" },
  { id: "rosehip", name: "Rosehips", emoji: "🔴" },
];

export const FOOD_IDS: FoodId[] = FOODS.map((f) => f.id);
export const getFood = (id: FoodId) => FOODS.find((f) => f.id === id)!;

const FOODS_MK = {
  "sunflower": "Сончогледови семки",
  "millet": "Просо",
  "peanuts": "Кикирики",
  "wheat": "Пченица",
  "apple": "Парчиња јаболко",
  "berries": "Мешани бобинки",
  "orange": "Половина портокал",
  "mealworms": "Брашнени црви",
  "walnut": "Ореви",
  "water": "Капење во свежа вода",
  "figs": "Смокви",
  "corn": "Пченка",
  "pumpkin": "Семки од тиква",
  "rosehip": "Шипинки"
};
export const FOOD_TEXT: Record<FoodId, import("@/i18n/languages").Localized<string>> = Object.fromEntries(FOODS.map((food) => [food.id, { en: food.name, mk: FOODS_MK[food.id] }])) as Record<FoodId, import("@/i18n/languages").Localized<string>>;
