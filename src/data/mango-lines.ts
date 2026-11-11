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
