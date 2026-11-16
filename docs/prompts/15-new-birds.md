Expand Mango's Garden to 20 birds and 14 foods. Data, tests, and four new food icons only. Do not change the algorithm, weights, pity rule, or visual design. Keep ids stable and en+mk text for everything.

1. FOODS (14 total)
Add figs (id "figs", en "Figs", mk "Смокви", emoji 🟣), corn (id "corn", en "Corn", mk "Пченка", emoji 🌽), pumpkin (id "pumpkin", en "Pumpkin seeds", mk "Семки од тиква", emoji 🎃), rosehip (id "rosehip", en "Rosehips", mk "Шипинки", emoji 🔴). Add four icons to FoodIcon in the same flat storybook style, readable at 40px:
- figs: one whole purple teardrop fig with a short stem next to one fig cut in half showing a pink-red inside with tiny seeds
- corn: one golden corn cob with a few visible kernels and two green husk leaves
- pumpkin: a small pile of flat, pale green teardrop-shaped seeds with pointed tips
- rosehip: three small red-orange oval hips on a short twig with one thorn and one leaf

2. NEW BIRDS (8). Format: id | en name / mk name | rarity | look | en fact | mk fact
- starling | Starling / Сколовранец | common | body #2e3a3a, belly #3a4747, wing #26605a, beak #e9c645, marking spots #f1ead2 | "Starlings can imitate car alarms, phones, and even other birds." | "Сколовранците можат да имитираат автомобилски аларми, телефони, па дури и други птици."
- chaffinch | Chaffinch / Зеба | common | body #d78a72, belly #eeb6a0, wing #6b6b55, beak #9aa3ad, marking cap #7a95ad | "Chaffinches in different valleys sing with different regional accents." | "Зебите од различни долини пеат со различни локални акценти."
- greenfinch | Greenfinch / Зеленушка | common | body #8fae4c, belly #c6d870, wing #6c8a3a, beak #e7c9b0, marking wingbar #f2d33b | "Greenfinches crunch sunflower seeds with a beak like tiny nutcrackers." | "Зеленушките крцкаат сончогледови семки со клун како мала кршачка за ореви."
- treesparrow | Tree Sparrow / Полско врапче | common | body #a8794f, belly #dcd0bd, wing #7d5a3a, beak #3a3a3a, marking cap #8b4a2b | "Unlike house sparrows, male and female tree sparrows look exactly alike." | "За разлика од домашните врапчиња, мажјакот и женката кај полското врапче изгледаат сосема исто."
- songthrush | Song Thrush / Дрозд пејач | common | body #8c6a46, belly #f0e2c8, wing #6f5338, beak #4a3b2e, marking spots #5a4330 | "Song thrushes crack open snail shells by smashing them on a favorite stone." | "Дроздовите пејачи ги кршат полжавите школки удирајќи ги о свој омилен камен."
- jay | Eurasian Jay / Сојка | uncommon | body #d1a99a, belly #ecd4c8, wing #3d7fd1, beak #2b2b2b, marking mask #222222 | "One jay can bury 5,000 acorns in autumn, and accidentally plant forests." | "Една сојка може да закопа 5.000 желади наесен — и случајно да засади шума."
- greenwoodpecker | Green Woodpecker / Зелен клукајдрвец | uncommon | body #7a9a4a, belly #c7d49a, wing #5f7d38, beak #3a3a3a, marking cap #d8362e | "Green woodpeckers hunt ants on the ground with a very long, sticky tongue." | "Зелените клукајдрвци ловат мравки по земја со многу долг леплив јазик."
- bullfinch | Eurasian Bullfinch / Зимовка | rare | body #8d949b, belly #e0707a, wing #2b2f36, beak #2b2b2b, marking cap #1f1f1f | "Bullfinches learn melodies so well that people once taught them to whistle tunes." | "Зимовките толку добро учат мелодии што некогаш луѓето ги учеле да свиркаат песнички."

Also rename the existing goldfinch in Macedonian: name "Билбилче", fact "Јато билбилчиња на англиски се вика „шарм“. Сосема заслужено!" Keep everything else about it unchanged.

3. AFFINITIES (loves 3, likes 1; replace each bird's affinity with exactly this; unlisted foods stay 0.2)
- robin: mealworms 3; berries 1, water 1, apple 1
- bluetit: peanuts 3, sunflower 3; mealworms 1, pumpkin 1
- greattit: sunflower 3; peanuts 1, walnut 1, pumpkin 1
- blackbird: apple 3, mealworms 3; figs 1, berries 1, water 1
- goldfinch: sunflower 3; millet 1
- sparrow: millet 3, water 3; wheat 1, sunflower 1, corn 1
- dove: wheat 3, millet 3, corn 3; sunflower 1, water 1
- magpie: walnut 3; peanuts 1, mealworms 1, corn 1
- jackdaw: wheat 3, corn 3; walnut 1, apple 1
- starling: mealworms 3, figs 3; apple 1, water 1, berries 1
- chaffinch: sunflower 3; wheat 1, millet 1, pumpkin 1
- greenfinch: sunflower 3; peanuts 1, millet 1, pumpkin 1
- treesparrow: millet 3, wheat 3; sunflower 1, water 1, corn 1
- songthrush: figs 3, apple 3; mealworms 1, berries 1, rosehip 1
- woodpecker (uncommon): walnut 3, peanuts 3, pumpkin 3; sunflower 1, mealworms 1
- jay (uncommon): walnut 3, peanuts 3, corn 3; figs 1, apple 1
- greenwoodpecker (uncommon): mealworms 3, apple 3; walnut 1
- hoopoe (rare): mealworms 3, water 3, figs 3, apple 3
- waxwing (rare): berries 3, apple 3, orange 3, rosehip 3; figs 1
- bullfinch (rare): rosehip 3, berries 3, sunflower 3, pumpkin 3

4. COUNTS AND MILESTONES
- Make every "X of 12" counter and the "all 12 collected" milestone depend on the data length (N = number of birds). Replace the 6-bird milestone with "halfway" (floor(N/2) collected). Milestone texts with numbers must use a placeholder filled from the data, in en and mk. Update any other text that hardcodes 12 birds or 10 foods, and the README tables.

5. TESTS AND SIMULATION
- Update tests: 20 birds (14 common, 3 uncommon, 3 rare), 14 foods, every rare bird loves at least 4 foods, every uncommon bird loves at least 2, every bird and food has en and mk text and an icon.
- Run npm run simulate and report: median and 90th-percentile days to finish the book, median days to first rare bird, the share of common/uncommon/rare visits, and how many of 5,000 players never finish in a year.
- In your summary, list only the files you changed.