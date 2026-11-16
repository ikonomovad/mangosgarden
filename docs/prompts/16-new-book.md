Add a "Start a new book" feature to Mango's Garden. Do not change the visitor algorithm, weights, daily lock, the daily food offer, or visuals outside the Bird Book.

1. WHEN IT APPEARS
- In the Bird Book only, when the player has collected all birds (collected count equals the number of birds in the data), show a "Book complete" panel under the progress bar, with a "Start a new book" button.
- Do not show the panel or button before the book is complete, and not on the daily screens.
- Texts (translation files, en + mk, with numbers filled in from the data):
  - Panel title: en "Book {n} complete! 🎉", mk "Книга {n} е комплетна! 🎉" (n = the current book number)
  - Panel text: en "We've met all {count} birds! Ready to start a new book?", mk "Сите {count} птици веќе ги запознавме! Да започнеме нова книга?"
  - Button: en "Start a new book", mk "Започни нова книга"

2. CONFIRMATION DIALOG
- The button opens a confirmation dialog (use the existing dialog component):
  - Title: en "Start a new book?", mk "Да започнеме нова книга?"
  - Text: en "Your collection will start over, but your streak and your trophy stay.", mk "Колекцијата ќе почне од почеток, но серијата и трофејот остануваат." (use the app's existing Macedonian word for streak)
  - Buttons: en "Start new book" / "Cancel", mk "Започни нова книга" / "Откажи". Cancel, X, Escape, or tapping outside close it without changes.

3. WHAT RESETS AND WHAT STAYS
- Reset: the collection (mangos-garden:collection) to empty; the pity counter to 0; and the collection milestones "first-bird", "collection-half", and "collection-all" removed from the shown list, so they can be celebrated again. Clear collectionBefore on today's record so "reset today" cannot restore the old completed collection.
- Keep: current streak, best streak, last visit, streak milestones, today's lock and visit, freshness history, the daily pat, sound, and language.

4. BOOK NUMBER AND TROPHY
- Save a small separate record under its own key (for example mangos-garden:books): the number of completed books and the date the first book was completed. Increase the count by 1 when a new book is started.
- The current book number is completed books + 1.
- In the Bird Book, always show a small laurel or star badge "Book {n}" (mk "Книга {n}") next to the "X of N collected" stat, starting with "Book 1".
- Once at least one book has been completed, also show the line en "Books completed: {n}", mk "Завршени книги: {n}".
- Add the separate key to the saved-data version and migration, with safe defaults if it is missing or corrupted.

5. DEBUG PANEL
- Add a button "Complete the book" to the existing debug panel that fills the collection with all birds (visit count 1, today's date as first seen), so the feature can be tested without waiting. Keep all debug code in src/debug/ behind the existing flag.

6. TESTS AND LIMITS
- Add tests: the panel shows only when complete and shows the right book number in its title; cancel changes nothing; confirming resets the collection, pity, and the three collection milestones; the streak, best streak, and today's lock stay the same; the completed-books counter increases; corrupted books data falls back safely; the badge shows "Book 1" at the start and "Book 2" after one completed book; "Books completed" shows only after the first completed book.
- Update the README (saved-data keys and the new feature). Do not refactor unrelated code. In your summary, list only the files you changed.