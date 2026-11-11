// Edit freely: what Mango says.
export type Mood = "happy" | "grumpy" | "excited";

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
