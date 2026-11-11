// Edit freely: every bird that can visit Mango's garden.
import type { FoodId } from "./foods";

export type Rarity = "common" | "uncommon" | "rare";
export const RARITY_WEIGHT: Record<Rarity, number> = { common: 10, uncommon: 4, rare: 1 };

// Affinity values: loves = 3, likes = 1, doesn't care = 0.2 (default for unlisted foods)
export const LOVES = 3;
export const LIKES = 1;
export const MEH = 0.2;

export type Marking = "red-breast" | "crest" | "cap" | "mask" | "wingbar" | "spots" | "crest-tipped" | "face";

export interface BirdLook {
  body: string;
  belly: string;
  wing: string;
  beak: string;
  marking: Marking;
  markingColor: string;
}

export interface Bird {
  id: string;
  name: string;
  rarity: Rarity;
  fact: string;
  affinity: Partial<Record<FoodId, number>>;
  look: BirdLook;
}

export const BIRDS: Bird[] = [
  {
    id: "robin", name: "European Robin", rarity: "common",
    fact: "Robins sing at night near streetlights, convinced it's still daytime.",
    affinity: { mealworms: LOVES, fatball: LIKES, berries: LIKES, water: LIKES },
    look: { body: "#8a6a4a", belly: "#f3e6d4", wing: "#6f5338", beak: "#3a2a1e", marking: "red-breast", markingColor: "#e8743b" },
  },
  {
    id: "bluetit", name: "Blue Tit", rarity: "common",
    fact: "A blue tit can visit over 1,000 trees a day hunting tiny caterpillars.",
    affinity: { peanuts: LOVES, sunflower: LOVES, fatball: LIKES },
    look: { body: "#7fa36a", belly: "#f4d75a", wing: "#5b8fcf", beak: "#2f2f2f", marking: "cap", markingColor: "#4a86d1" },
  },
  {
    id: "greattit", name: "Great Tit", rarity: "common",
    fact: "Great tits have been seen cracking open bees' nests... politely, of course.",
    affinity: { sunflower: LOVES, peanuts: LIKES, fatball: LOVES },
    look: { body: "#8aa86a", belly: "#f2d24e", wing: "#6c8aa0", beak: "#222222", marking: "cap", markingColor: "#232323" },
  },
  {
    id: "blackbird", name: "Blackbird", rarity: "common",
    fact: "Blackbirds tilt their heads to listen for worms wriggling underground.",
    affinity: { apple: LOVES, mealworms: LOVES, berries: LIKES, water: LIKES },
    look: { body: "#2f2c2b", belly: "#3c3836", wing: "#25221f", beak: "#f2a93b", marking: "mask", markingColor: "#f2a93b" },
  },
  {
    id: "goldfinch", name: "Goldfinch", rarity: "common",
    fact: "A group of goldfinches is called a 'charm'. Fitting, really.",
    affinity: { nyjer: LOVES, sunflower: LIKES },
    look: { body: "#c9a57a", belly: "#f6ece0", wing: "#f3cf3a", beak: "#e9d8c4", marking: "face", markingColor: "#d8362e" },
  },
  {
    id: "sparrow", name: "House Sparrow", rarity: "common",
    fact: "Sparrows take dust baths to keep their feathers tidy. Spa day!",
    affinity: { millet: LOVES, sunflower: LIKES, water: LOVES },
    look: { body: "#a07a52", belly: "#d9cdbb", wing: "#7d5a3a", beak: "#4a3b2e", marking: "wingbar", markingColor: "#f4efe6" },
  },
  {
    id: "chaffinch", name: "Chaffinch", rarity: "common",
    fact: "Chaffinches in different valleys sing with different regional accents.",
    affinity: { millet: LIKES, sunflower: LOVES, nyjer: LIKES },
    look: { body: "#d78a72", belly: "#eeb6a0", wing: "#6b6b55", beak: "#9aa3ad", marking: "cap", markingColor: "#7a95ad" },
  },
  {
    id: "starling", name: "Starling", rarity: "common",
    fact: "Starlings can imitate car alarms, phones, and even other birds.",
    affinity: { mealworms: LOVES, fatball: LOVES, apple: LIKES, water: LIKES },
    look: { body: "#2e3a3a", belly: "#3a4747", wing: "#26605a", beak: "#e9c645", marking: "spots", markingColor: "#f1ead2" },
  },
  {
    id: "greenfinch", name: "Greenfinch", rarity: "common",
    fact: "Greenfinches crunch sunflower seeds with a beak like tiny nutcrackers.",
    affinity: { sunflower: LOVES, peanuts: LIKES, millet: LIKES },
    look: { body: "#8fae4c", belly: "#c6d870", wing: "#6c8a3a", beak: "#e7c9b0", marking: "wingbar", markingColor: "#f2d33b" },
  },
  {
    id: "jay", name: "Eurasian Jay", rarity: "uncommon",
    fact: "One jay can bury 5,000 acorns in autumn — and accidentally plant forests.",
    affinity: { peanuts: LOVES, apple: LIKES, orange: LIKES },
    look: { body: "#d1a99a", belly: "#ecd4c8", wing: "#3d7fd1", beak: "#2b2b2b", marking: "mask", markingColor: "#222222" },
  },
  {
    id: "hoopoe", name: "Hoopoe", rarity: "rare",
    fact: "Hoopoes fan their crown like a punk mohawk when they get excited.",
    affinity: { mealworms: LOVES, water: LIKES },
    look: { body: "#e3a46a", belly: "#f2cfa6", wing: "#3a3330", beak: "#3a3330", marking: "crest-tipped", markingColor: "#e3a46a" },
  },
  {
    id: "waxwing", name: "Waxwing", rarity: "rare",
    fact: "Waxwings sometimes get tipsy on fermented berries. Very rock'n'roll.",
    affinity: { berries: LOVES, apple: LOVES, orange: LOVES },
    look: { body: "#c9a48a", belly: "#e4cdb8", wing: "#8a7a6e", beak: "#2b2b2b", marking: "crest", markingColor: "#b8866a" },
  },
];

export const getAffinity = (bird: Bird, food: FoodId) => bird.affinity[food] ?? MEH;
export const getBird = (id: string) => BIRDS.find((b) => b.id === id);
