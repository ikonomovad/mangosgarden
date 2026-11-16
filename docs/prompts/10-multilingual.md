Add multilingual support to Mango's Garden with English (en) and Macedonian (mk). Do not change game logic, the algorithm, saved game data, or visual design.

1. UI TEXT
- Move all hardcoded UI text into one translation file per language: src/i18n/en.ts and src/i18n/mk.ts, with matching keys, plus a small t(key, params) helper and a language provider. Include counts such as "Visited X times" and the countdown labels, with correct Macedonian wording. Format dates and numbers using the selected language's locale.
- Write the Macedonian translations in Cyrillic, in a warm, friendly tone.

2. GAME DATA
- Keep ids stable and untranslated. Add en and mk versions of every player-visible text inside the existing data files: bird names, fun facts, food names, and all Mango reaction and milestone lines. Fall back to English if a translation is missing.

3. SWITCHER
- Add a small round "EN / МК" toggle in the existing floating controls stack, next to the sound and Bird Book buttons, same style, 44px tap target. The choice is saved under its own localStorage key, defaulting to English (or Macedonian if the device language is Macedonian), and the page language attribute updates.

4. FONTS AND LAYOUT
- Make sure every font used supports Cyrillic (add the Cyrillic subset if needed). Check that longer Macedonian text doesn't break buttons, cards, or the 360px mobile layout.

5. EXTENSIBILITY AND TESTS
- Adding a language later should only need one new translation file, one entry in a language list, and the data translations. Describe these steps in the README.
- Add a test that en and mk have exactly the same keys and that every bird, food, and Mango line has both languages.
- In your summary, list only the files you changed.