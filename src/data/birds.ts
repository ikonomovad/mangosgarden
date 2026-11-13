// Edit freely: every bird that can visit Mango's garden.
import type { FoodId } from "./foods";

export type Rarity = "common" | "uncommon" | "rare";
export const RARITY_WEIGHT: Record<Rarity, number> = { common: 10, uncommon: 6, rare: 0.5 };

// Affinity values: loves = 3, likes = 1, doesn't care = 0.2 (default for unlisted foods)
export const LOVES = 3;
export const LIKES = 1;
export const MEH = 0.2;

export type Marking = "red-breast" | "crest" | "cap" | "mask" | "wingbar" | "spots" | "crest-tipped" | "face" | "collar";

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
    affinity: { mealworms: LOVES, berries: LIKES, water: LIKES, apple: LIKES },
    look: { body: "#8a6a4a", belly: "#f3e6d4", wing: "#6f5338", beak: "#3a2a1e", marking: "red-breast", markingColor: "#e8743b" },
  },
  {
    id: "bluetit", name: "Blue Tit", rarity: "common",
    fact: "A blue tit can visit over 1,000 trees a day hunting tiny caterpillars.",
    affinity: { peanuts: LOVES, sunflower: LOVES, mealworms: LIKES, pumpkin: LIKES },
    look: { body: "#7fa36a", belly: "#f4d75a", wing: "#5b8fcf", beak: "#2f2f2f", marking: "cap", markingColor: "#4a86d1" },
  },
  {
    id: "greattit", name: "Great Tit", rarity: "common",
    fact: "Great tits have been seen cracking open bees' nests... politely, of course.",
    affinity: { sunflower: LOVES, peanuts: LIKES, walnut: LIKES, pumpkin: LIKES },
    look: { body: "#8aa86a", belly: "#f2d24e", wing: "#6c8aa0", beak: "#222222", marking: "cap", markingColor: "#232323" },
  },
  {
    id: "blackbird", name: "Blackbird", rarity: "common",
    fact: "Blackbirds tilt their heads to listen for worms wriggling underground.",
    affinity: { apple: LOVES, mealworms: LOVES, figs: LIKES, berries: LIKES, water: LIKES },
    look: { body: "#2f2c2b", belly: "#3c3836", wing: "#25221f", beak: "#f2a93b", marking: "mask", markingColor: "#f2a93b" },
  },
  {
    id: "goldfinch", name: "Goldfinch", rarity: "common",
    fact: "A group of goldfinches is called a 'charm'. Fitting, really.",
    affinity: { sunflower: LOVES, millet: LIKES },
    look: { body: "#c9a57a", belly: "#f6ece0", wing: "#f3cf3a", beak: "#e9d8c4", marking: "face", markingColor: "#d8362e" },
  },
  {
    id: "sparrow", name: "House Sparrow", rarity: "common",
    fact: "Sparrows take dust baths to keep their feathers tidy. Spa day!",
    affinity: { millet: LOVES, water: LOVES, wheat: LIKES, sunflower: LIKES, corn: LIKES },
    look: { body: "#a07a52", belly: "#d9cdbb", wing: "#7d5a3a", beak: "#4a3b2e", marking: "wingbar", markingColor: "#f4efe6" },
  },
  {
    id: "dove", name: "Collared Dove", rarity: "common",
    fact: "Doves drink by sucking water up like a straw instead of tipping their heads back.",
    affinity: { wheat: LOVES, millet: LOVES, corn: LOVES, sunflower: LIKES, water: LIKES },
    look: { body: "#c9b79c", belly: "#e6dccb", wing: "#a69882", beak: "#3a3a3a", marking: "collar", markingColor: "#2b2b2b" },
  },
  {
    id: "magpie", name: "Magpie", rarity: "common",
    fact: "Magpies can recognize themselves in a mirror, which very few animals can do.",
    affinity: { walnut: LOVES, peanuts: LIKES, mealworms: LIKES, corn: LIKES },
    look: { body: "#2a2a2e", belly: "#f4f1ea", wing: "#2f7f86", beak: "#1f1f1f", marking: "wingbar", markingColor: "#f4f1ea" },
  },
  {
    id: "jackdaw", name: "Jackdaw", rarity: "common",
    fact: "Jackdaws often pair up for life and love to nest in chimneys and old walls.",
    affinity: { wheat: LOVES, corn: LOVES, walnut: LIKES, apple: LIKES },
    look: { body: "#3a3d42", belly: "#4a4d52", wing: "#2b2d31", beak: "#232323", marking: "cap", markingColor: "#9aa0a8" },
  },
  {
    id: "starling", name: "Starling", rarity: "common",
    fact: "Starlings can imitate car alarms, phones, and even other birds.",
    affinity: { mealworms: LOVES, figs: LOVES, apple: LIKES, water: LIKES, berries: LIKES },
    look: { body: "#2e3a3a", belly: "#3a4747", wing: "#26605a", beak: "#e9c645", marking: "spots", markingColor: "#f1ead2" },
  },
  {
    id: "chaffinch", name: "Chaffinch", rarity: "common",
    fact: "Chaffinches in different valleys sing with different regional accents.",
    affinity: { sunflower: LOVES, wheat: LIKES, millet: LIKES, pumpkin: LIKES },
    look: { body: "#d78a72", belly: "#eeb6a0", wing: "#6b6b55", beak: "#9aa3ad", marking: "cap", markingColor: "#7a95ad" },
  },
  {
    id: "greenfinch", name: "Greenfinch", rarity: "common",
    fact: "Greenfinches crunch sunflower seeds with a beak like tiny nutcrackers.",
    affinity: { sunflower: LOVES, peanuts: LIKES, millet: LIKES, pumpkin: LIKES },
    look: { body: "#8fae4c", belly: "#c6d870", wing: "#6c8a3a", beak: "#e7c9b0", marking: "wingbar", markingColor: "#f2d33b" },
  },
  {
    id: "treesparrow", name: "Tree Sparrow", rarity: "common",
    fact: "Unlike house sparrows, male and female tree sparrows look exactly alike.",
    affinity: { millet: LOVES, wheat: LOVES, sunflower: LIKES, water: LIKES, corn: LIKES },
    look: { body: "#a8794f", belly: "#dcd0bd", wing: "#7d5a3a", beak: "#3a3a3a", marking: "cap", markingColor: "#8b4a2b" },
  },
  {
    id: "songthrush", name: "Song Thrush", rarity: "common",
    fact: "Song thrushes crack open snail shells by smashing them on a favorite stone.",
    affinity: { figs: LOVES, apple: LOVES, mealworms: LIKES, berries: LIKES, rosehip: LIKES },
    look: { body: "#8c6a46", belly: "#f0e2c8", wing: "#6f5338", beak: "#4a3b2e", marking: "spots", markingColor: "#5a4330" },
  },
  {
    id: "woodpecker", name: "Great Spotted Woodpecker", rarity: "uncommon",
    fact: "Woodpeckers drum on hollow branches to announce their territory.",
    affinity: { walnut: LOVES, peanuts: LOVES, pumpkin: LOVES, sunflower: LIKES, mealworms: LIKES },
    look: { body: "#2b2b2b", belly: "#efe7da", wing: "#1f1f1f", beak: "#3a3a3a", marking: "cap", markingColor: "#d8362e" },
  },
  {
    id: "jay", name: "Eurasian Jay", rarity: "uncommon",
    fact: "One jay can bury 5,000 acorns in autumn, and accidentally plant forests.",
    affinity: { walnut: LOVES, peanuts: LOVES, corn: LOVES, figs: LIKES, apple: LIKES },
    look: { body: "#d1a99a", belly: "#ecd4c8", wing: "#3d7fd1", beak: "#2b2b2b", marking: "mask", markingColor: "#222222" },
  },
  {
    id: "greenwoodpecker", name: "Green Woodpecker", rarity: "uncommon",
    fact: "Green woodpeckers hunt ants on the ground with a very long, sticky tongue.",
    affinity: { mealworms: LOVES, apple: LOVES, walnut: LIKES },
    look: { body: "#7a9a4a", belly: "#c7d49a", wing: "#5f7d38", beak: "#3a3a3a", marking: "cap", markingColor: "#d8362e" },
  },
  {
    id: "hoopoe", name: "Hoopoe", rarity: "rare",
    fact: "Hoopoes fan their crown like a punk mohawk when they get excited.",
    affinity: { mealworms: LOVES, water: LOVES, figs: LOVES, apple: LOVES },
    look: { body: "#e3a46a", belly: "#f2cfa6", wing: "#3a3330", beak: "#3a3330", marking: "crest-tipped", markingColor: "#e3a46a" },
  },
  {
    id: "waxwing", name: "Waxwing", rarity: "rare",
    fact: "Waxwings sometimes get tipsy on fermented berries. Very rock'n'roll.",
    affinity: { berries: LOVES, apple: LOVES, orange: LOVES, rosehip: LOVES, figs: LIKES },
    look: { body: "#c9a48a", belly: "#e4cdb8", wing: "#8a7a6e", beak: "#2b2b2b", marking: "crest", markingColor: "#b8866a" },
  },
  {
    id: "bullfinch", name: "Eurasian Bullfinch", rarity: "rare",
    fact: "Bullfinches learn melodies so well that people once taught them to whistle tunes.",
    affinity: { rosehip: LOVES, berries: LOVES, sunflower: LOVES, pumpkin: LOVES },
    look: { body: "#8d949b", belly: "#e0707a", wing: "#2b2f36", beak: "#2b2b2b", marking: "cap", markingColor: "#1f1f1f" },
  },
];

export const getAffinity = (bird: Bird, food: FoodId) => bird.affinity[food] ?? MEH;
export const getBird = (id: string) => BIRDS.find((b) => b.id === id);

// Localized presentation only; ids, affinities and English fields remain stable.
const BIRDS_MK = {
  "robin": {
    "name": "Црвеногушка",
    "fact": "Црвеногушките пеат ноќе покрај уличните светилки, убедени дека сè уште е ден."
  },
  "bluetit": {
    "name": "Сина сипка",
    "fact": "Сината сипка може да посети над 1.000 дрвја дневно во потрага по ситни гасеници."
  },
  "greattit": {
    "name": "Голема сипка",
    "fact": "Големите сипки знаат да отворат пчелни гнезда... учтиво, се разбира."
  },
  "blackbird": {
    "name": "Кос",
    "fact": "Косовите ја накривуваат главата за да ги слушнат црвите под земјата."
  },
  "goldfinch": {
    "name": "Билбилче",
    "fact": "Јато билбилчиња на англиски се вика „шарм“. Сосема заслужено!"
  },
  "sparrow": {
    "name": "Домашно врапче",
    "fact": "Врапчињата се капат во прашина за да си ги исчистат пердувите. Ден за разгалување!"
  },
  "dove": {
    "name": "Гугутка",
    "fact": "Гугутките пијат вода како со сламка, без да ја накривуваат главата назад."
  },
  "magpie": {
    "name": "Страчка",
    "fact": "Страчките можат да се препознаат себеси во огледало, што го можат многу малку животни."
  },
  "jackdaw": {
    "name": "Чавка",
    "fact": "Чавките честопати остануваат во пар цел живот и сакаат да гнездат во оџаци и стари ѕидови."
  },
  "woodpecker": {
    "name": "Голем клукајдрвец",
    "fact": "Клукајдрвците чукаат по шупливи гранки за да ја објават својата територија."
  },
  "hoopoe": {
    "name": "Пупунец",
    "fact": "Кога ќе се возбудат, пупунците ја шират својата круна како панкерска фризура."
  },
  "waxwing": {
    "name": "Свилокрилка",
    "fact": "Свилокрилките понекогаш се поднапиваат од ферментирани бобинки. Вистински рокенрол!"
  },
  "starling": {
    "name": "Сколовранец",
    "fact": "Сколовранците можат да имитираат автомобилски аларми, телефони, па дури и други птици."
  },
  "chaffinch": {
    "name": "Зеба",
    "fact": "Зебите од различни долини пеат со различни локални акценти."
  },
  "greenfinch": {
    "name": "Зеленушка",
    "fact": "Зеленушките крцкаат сончогледови семки со клун како мала кршачка за ореви."
  },
  "treesparrow": {
    "name": "Полско врапче",
    "fact": "За разлика од домашните врапчиња, мажјакот и женката кај полското врапче изгледаат сосема исто."
  },
  "songthrush": {
    "name": "Дрозд пејач",
    "fact": "Дроздовите пејачи ги кршат полжавите школки удирајќи ги о свој омилен камен."
  },
  "jay": {
    "name": "Сојка",
    "fact": "Една сојка може да закопа 5.000 желади наесен — и случајно да засади шума."
  },
  "greenwoodpecker": {
    "name": "Зелен клукајдрвец",
    "fact": "Зелените клукајдрвци ловат мравки по земја со многу долг леплив јазик."
  },
  "bullfinch": {
    "name": "Зимовка",
    "fact": "Зимовките толку добро учат мелодии што некогаш луѓето ги учеле да свиркаат песнички."
  }
};
export const BIRD_TEXT: Record<string, import("@/i18n/languages").Localized<{ name: string; fact: string }>> = Object.fromEntries(BIRDS.map((bird) => [bird.id, { en: { name: bird.name, fact: bird.fact }, mk: BIRDS_MK[bird.id as keyof typeof BIRDS_MK] }]));
