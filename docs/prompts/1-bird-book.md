Add a bird book (collection page) to Mango's Garden. Keep all existing behavior working.

BIRD BOOK
- Add a "Bird book" button on the garden/welcome screen that opens a collection page, with a clear way back.
- Show all 12 birds in a mobile-friendly grid (2 to 3 columns).
- Discovered birds show the SVG bird, name, fun fact, favorite foods, first-seen date, and a "Visited X times" count.
- Undiscovered birds show a dark silhouette with "???" for the name.
- At the top show two stats: "X of 12 collected" and "Y total visits".
- Add a small "New!" badge on a bird card the first time it is discovered.

NEW BIRD MOMENT
- When today's visitor is a bird the player has never seen, show a "New bird!" label and a small sparkle on the bird card. Repeat visitors show "Visited X times" instead.

SAVING
- Save the full collection in localStorage: for each bird, the first-seen date and the visit count. Keep the existing saved data for freshness and the daily food offer.
- Handle empty or cleared storage gracefully (an empty book, no errors).

ALGORITHM CHANGE
- In the visitor algorithm, multiply the score of birds the player has not collected yet by 2, so new birds are a bit likelier. Keep the function pure and in its own file.

Do NOT build the streak, once-a-day lock, or sounds yet. Keep animations simple CSS.