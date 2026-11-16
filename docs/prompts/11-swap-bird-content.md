Swap the foods and birds in Mango's Garden. Data changes only. Do not change game logic, the algorithm, weights, pity rule, or visual design, except the one small marking noted below. Keep ids stable and en+mk text for everything.

FOODS (10 total)
- Remove nyjer and fatball.
- Add wheat (en "Wheat", mk "Пченица", emoji 🌾) and walnut (en "Walnuts", mk "Ореви", emoji 🌰). Change millet's emoji to 🟡.
- Keep the other 8 foods unchanged.

BIRDS (12 total: 9 common, 1 uncommon, 2 rare)
- Remove: chaffinch, starling, greenfinch, jay.
- Add common: collared dove (id "dove"), magpie ("magpie"), jackdaw ("jackdaw"). Add uncommon: great spotted woodpecker ("woodpecker"). Keep robin, bluetit, greattit, blackbird, goldfinch, sparrow, hoopoe, waxwing.
- New birds:
  - dove: "Collared Dove" / "Гугутка", look body #c9b79c, belly #e6dccb, wing #a69882, beak #3a3a3a, new marking "collar" (a thin dark ring at the neck, color #2b2b2b). Fact en: "Doves drink by sucking water up like a straw instead of tipping their heads back." mk: "Гугутките пијат вода како со сламка, без да ја накривуваат главата назад."
  - magpie: "Magpie" / "Страчка", look body #2a2a2e, belly #f4f1ea, wing #2f7f86, beak #1f1f1f, marking wingbar #f4f1ea. Fact en: "Magpies can recognize themselves in a mirror, which very few animals can do." mk: "Страчките можат да се препознаат себеси во огледало, што го можат многу малку животни."
  - jackdaw: "Jackdaw" / "Чавка", look body #3a3d42, belly #4a4d52, wing #2b2d31, beak #232323, marking cap #9aa0a8. Fact en: "Jackdaws often pair up for life and love to nest in chimneys and old walls." mk: "Чавките честопати остануваат во пар цел живот и сакаат да гнездат во оџаци и стари ѕидови."
  - woodpecker: "Great Spotted Woodpecker" / "Голем клукајдрвец", rarity uncommon, look body #2b2b2b, belly #efe7da, wing #1f1f1f, beak #3a3a3a, marking cap #d8362e. Fact en: "Woodpeckers drum on hollow branches to announce their territory." mk: "Клукајдрвците чукаат по шупливи гранки за да го објават својот територија." (use correct Macedonian grammar: "својата територија")
- Affinities (loves 3 / likes 1; everything else stays 0.2):
  - dove: wheat 3, millet 3, sunflower 1, water 1
  - magpie: walnut 3, peanuts 1, mealworms 1
  - jackdaw: wheat 3, walnut 1, apple 1
  - woodpecker: walnut 3, peanuts 3, sunflower 1, mealworms 1
  - robin: mealworms 3, berries 1, water 1, apple 1
  - bluetit: peanuts 3, sunflower 3, mealworms 1
  - greattit: sunflower 3, peanuts 1, walnut 1
  - goldfinch: sunflower 3, millet 1
  - sparrow: millet 3, water 3, wheat 1, sunflower 1
  - blackbird, waxwing: unchanged
  - hoopoe: mealworms 3, water 3, apple 1
- Add the "collar" marking to the shared SVG bird component as a simple thin ring, nothing else in the drawing changes.

CLEANUP
- Update any Mango lines, hints, or text that mention nyjer, fat balls, or removed birds.
- If saved data contains removed bird or food ids, ignore them: don't crash, don't show them, and don't count them toward "X of 12".
- Update tests (12 birds: 9/1/2, 10 foods, both rare birds love at least 2 foods, every bird and food has en and mk text). Update the README bird and food tables.
- Run npm run simulate and report: median and 90th-percentile days to finish the book, median days to first rare bird, the share of common/uncommon/rare visits, and how many of 5,000 players never finish in a year.
- In your summary, list only the files you changed.