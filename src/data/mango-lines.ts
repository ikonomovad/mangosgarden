// Edit freely: what Mango says.
export type Mood = "happy" | "grumpy" | "excited";

export type Reaction = "rare" | "new" | "repeat" | "yesterday";

export const VISIT_LINES: Record<Reaction, readonly string[]> = {
  rare: [
    "A VIP! Very Important Plumage!",
    "Oh my feathers! I'll get the fancy twig!",
    "A rare guest! Act natural. Not THAT natural!",
  ],
  new: [
    "A new friend! I'll scoot over on my twig.",
    "Hello, stranger! Your feathers look very huggable.",
    "Fresh face, fresh snacks! Excellent timing.",
  ],
  repeat: [
    "Welcome back! Your usual twig is ready.",
    "A familiar beak! I saved you a tiny hello.",
    "Our friend is back! The snack club grows stronger.",
  ],
  yesterday: [
    "Two days running! Shall I put your name on a twig?",
    "You again! Yesterday's crumbs got a good review, then.",
    "Back already? I missed you for a whole nap!",
  ],
};

export const MILESTONE_LINES = {
  "first-bird": "Our very first friend! This twig is officially a garden.",
  "streak-3": "Three days of snacks! We're a tiny breakfast club.",
  "streak-7": "A whole week! I'll wear my best feather to celebrate.",
  "streak-14": "Two weeks together! My happy dance needs a bigger branch.",
  "streak-30": "Thirty days! That's a whole month of little hellos.",
  "collection-6": "Six feathered friends! Half a book, a whole lot of joy.",
  "collection-12": "All twelve friends! Our bird book is bursting with beaks!",
} as const;

export type Milestone = keyof typeof MILESTONE_LINES;
export const LEARNED_LINE = "Mango learned something!";

export const MANGO_LINES: Record<Mood, string[]> = {
  happy: [
    "Ooh, a guest! I'll pretend I made the snacks.",
    "Welcome, friend! Mind the bird bath, it's my good one.",
    "Look who's here! Today is officially a nice day.",
  ],
  grumpy: [
    "Hmph. They ate the good bits. I was saving those.",
    "Fine. FINE. They can stay. Five minutes.",
    "Nobody asked me before inviting them. Typical.",
  ],
  excited: [
    "WHAT?! A real celebrity in MY garden?!",
    "Eeeek! Quick, someone draw this moment!",
    "I am not screaming. You're screaming. SQUAWK!",
  ],
};

export const GREETINGS: string[] = [
  "Morning! The garden is ready — shall we put out a snack?",
  "Oh hi! I've been guarding this branch all night. Mostly napping.",
  "Psst. I think someone's hungry out there. Let's find out who!",
];

// English strings remain the save-compatible identity; translate only when rendering.
export const MANGO_TEXT: Record<string, import("@/i18n/languages").Localized<string>> = {
  "A VIP! Very Important Plumage!": {
    en: "A VIP! Very Important Plumage!",
    mk: "Важен гостин! Какви пердуви!",
  },
  "Oh my feathers! I'll get the fancy twig!": {
    en: "Oh my feathers! I'll get the fancy twig!",
    mk: "Леле, пердувчиња мои! Ќе го донесам свеченото гранче!",
  },
  "A rare guest! Act natural. Not THAT natural!": {
    en: "A rare guest! Act natural. Not THAT natural!",
    mk: "Редок гостин! Однесувај се природно. Не ТОЛКУ природно!",
  },
  "A new friend! I'll scoot over on my twig.": {
    en: "A new friend! I'll scoot over on my twig.",
    mk: "Нов пријател! Ќе се поместам на гранчето.",
  },
  "Hello, stranger! Your feathers look very huggable.": {
    en: "Hello, stranger! Your feathers look very huggable.",
    mk: "Здраво, нов пријателе! Колку ти се меки пердувчињата.",
  },
  "Fresh face, fresh snacks! Excellent timing.": {
    en: "Fresh face, fresh snacks! Excellent timing.",
    mk: "Ново лице, свежи ужинки! Совршен момент.",
  },
  "Welcome back! Your usual twig is ready.": {
    en: "Welcome back! Your usual twig is ready.",
    mk: "Добредојде пак! Твоето гранче е подготвено.",
  },
  "A familiar beak! I saved you a tiny hello.": {
    en: "A familiar beak! I saved you a tiny hello.",
    mk: "Пак си тука! Ти зачував едно мало поздравче.",
  },
  "Our friend is back! The snack club grows stronger.": {
    en: "Our friend is back! The snack club grows stronger.",
    mk: "Пријателот ни се врати! Клубот на ужинките е сè повесел.",
  },
  "Two days running! Shall I put your name on a twig?": {
    en: "Two days running! Shall I put your name on a twig?",
    mk: "Два дена по ред! Да ти го напишам името на гранче?",
  },
  "You again! Yesterday's crumbs got a good review, then.": {
    en: "You again! Yesterday's crumbs got a good review, then.",
    mk: "Пак ти! Значи вчерашните трошки добиле добра оценка.",
  },
  "Back already? I missed you for a whole nap!": {
    en: "Back already? I missed you for a whole nap!",
    mk: "Веќе се врати? Цела дремка те чекав!",
  },
  "Our very first friend! This twig is officially a garden.": {
    en: "Our very first friend! This twig is officially a garden.",
    mk: "Нашиот прв пријател! Ова гранче сега е вистинска градина.",
  },
  "Three days of snacks! We're a tiny breakfast club.": {
    en: "Three days of snacks! We're a tiny breakfast club.",
    mk: "Три дена ужинки! Ние сме мал клуб за појадок.",
  },
  "A whole week! I'll wear my best feather to celebrate.": {
    en: "A whole week! I'll wear my best feather to celebrate.",
    mk: "Цела недела! Ќе го ставам најубавиот пердув за прослава.",
  },
  "Two weeks together! My happy dance needs a bigger branch.": {
    en: "Two weeks together! My happy dance needs a bigger branch.",
    mk: "Две недели заедно! За мојот среќен танц ми треба поголема гранка.",
  },
  "Thirty days! That's a whole month of little hellos.": {
    en: "Thirty days! That's a whole month of little hellos.",
    mk: "Триесет дена! Цел месец мали поздрави.",
  },
  "Six feathered friends! Half a book, a whole lot of joy.": {
    en: "Six feathered friends! Half a book, a whole lot of joy.",
    mk: "Шест пердувести пријатели! Половина книга, а толку многу радост.",
  },
  "All twelve friends! Our bird book is bursting with beaks!": {
    en: "All twelve friends! Our bird book is bursting with beaks!",
    mk: "Сите дванаесет пријатели! Книгата ни е полна со клунчиња!",
  },
  "Mango learned something!": {
    en: "Mango learned something!",
    mk: "Манго научи нешто ново!",
  },
  "Ooh, a guest! I'll pretend I made the snacks.": {
    en: "Ooh, a guest! I'll pretend I made the snacks.",
    mk: "Ооо, гостин! Ќе се правам дека јас ги подготвив ужинките.",
  },
  "Welcome, friend! Mind the bird bath, it's my good one.": {
    en: "Welcome, friend! Mind the bird bath, it's my good one.",
    mk: "Добредојде, пријателе! Внимавај на кадичката, таа ми е омилена.",
  },
  "Look who's here! Today is officially a nice day.": {
    en: "Look who's here! Today is officially a nice day.",
    mk: "Види кој ни дојде! Денес и официјално е убав ден.",
  },
  "Hmph. They ate the good bits. I was saving those.": {
    en: "Hmph. They ate the good bits. I was saving those.",
    mk: "Уф. Ги изедоа најубавите парчиња. Ги чував за себе.",
  },
  "Fine. FINE. They can stay. Five minutes.": {
    en: "Fine. FINE. They can stay. Five minutes.",
    mk: "Добро. ДОБРО. Нека останат. Пет минути.",
  },
  "Nobody asked me before inviting them. Typical.": {
    en: "Nobody asked me before inviting them. Typical.",
    mk: "Никој не ме праша пред да ги покани. Како и секогаш.",
  },
  "WHAT?! A real celebrity in MY garden?!": {
    en: "WHAT?! A real celebrity in MY garden?!",
    mk: "ШТО?! Вистинска ѕвезда во МОЈАТА градина?!",
  },
  "Eeeek! Quick, someone draw this moment!": {
    en: "Eeeek! Quick, someone draw this moment!",
    mk: "Иии! Брзо, некој нека го овековечи овој момент!",
  },
  "I am not screaming. You're screaming. SQUAWK!": {
    en: "I am not screaming. You're screaming. SQUAWK!",
    mk: "Јас не врескам. Ти врескаш. КРАА!",
  },
  "Morning! The garden is ready — shall we put out a snack?": {
    en: "Morning! The garden is ready — shall we put out a snack?",
    mk: "Добро утро! Градината е подготвена — да оставиме ужинка?",
  },
  "Oh hi! I've been guarding this branch all night. Mostly napping.": {
    en: "Oh hi! I've been guarding this branch all night. Mostly napping.",
    mk: "О, здраво! Цела ноќ ја чувам гранкава. Главно со дремење.",
  },
  "Psst. I think someone's hungry out there. Let's find out who!": {
    en: "Psst. I think someone's hungry out there. Let's find out who!",
    mk: "Псст. Мислам дека некој надвор е гладен. Да откриеме кој!",
  },
};
