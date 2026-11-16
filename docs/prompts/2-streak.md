Add the once-a-day rule and a streak to Mango's Garden. Keep all existing behavior working, including the hidden "reset today" button.

ONCE-A-DAY LOCK
- After the player feeds the birds, they cannot choose again that day.
- If they reopen the game later the same day, skip the food screen and show today's bird card with a "Come back tomorrow" message and a countdown to the next local midnight.
- The day changes at local midnight, based on the device's date.
- On a new day, show the welcome screen and today's new set of 4 foods.

STREAK
- The streak counts consecutive days with a visit. Visiting today after visiting yesterday adds 1.
- If a day is missed, the streak restarts at 1 on the next visit.
- Show the current streak on the garden screen, with a small flame or feather icon, and on the bird card after feeding.
- Show a "Best streak" value on the bird book page.

SAVING
- Save in localStorage: today's visit (food chosen, bird that came, date), current streak, best streak, last visit date. Keep the existing collection and history data.
- Handle empty or cleared storage gracefully.

RESET TODAY BUTTON (testing only, keep it hidden)
- It should remove today's visit, undo today's collection count and streak change, and unlock the food screen again.

Do NOT build sounds, hints, or extra Mango reactions yet. Keep animations simple CSS.