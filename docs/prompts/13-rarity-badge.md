Add a rarity badge and two "learn more" links to the bird detail dialog in Mango's Garden. Visual and UI only. Do not change game logic, saved data, or the algorithm.

1. RARITY BADGE
- In the detail dialog (collected birds only), show a small pill next to the bird's name from its existing rarity field: common = sage green, uncommon = warm blue, rare = gold, with cream or dark text for good contrast. Use our design tokens.
- Add translated labels in the translation files: en "Common / Uncommon / Rare", mk "Честа / Помалку честа / Ретка".

2. LINKS (at the bottom of the dialog, two small secondary buttons, side by side, wrapping on small screens)
- "Find out more" / mk "Дознај повеќе": opens https://www.google.com/search?q=<encoded query> in a new tab. Query: en "<English bird name> bird", mk "<Macedonian bird name> птица".
- "Ask ChatGPT" / mk "Прашај го ChatGPT": opens https://chatgpt.com/?q=<encoded prompt> in a new tab.
  - en prompt: "Tell me more about the <English bird name>. Include interesting facts, its habits, and what it eats."
  - mk prompt: "Кажи ми повеќе за птицата <Macedonian bird name>. Вклучи интересни факти, нејзините навики и што јаде."
- Choose the language from the currently selected app language. Use encodeURIComponent, and target="_blank" with rel="noopener noreferrer".
- Put the two URL builders in one small helper file with tests (correct encoding, both languages). Put the prompt templates in the translation files so they can be edited or translated later.
- Do not show these links on locked cards.

3. LIMITS
- Do not refactor unrelated code. In your summary, list only the files you changed.