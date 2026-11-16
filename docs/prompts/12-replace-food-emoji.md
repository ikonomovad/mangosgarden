Replace the food emojis in Mango's Garden with simple SVG icons. Visual change only. Do not change game logic, data ids, saved data, text, or tests.

- Create one component, FoodIcon, in a single file (src/components/FoodIcon.tsx), that takes a food id and a size and returns a flat storybook SVG. Style: a few simple shapes per icon, soft outlines in warm brown, no gradients, no tiny details, readable at 40px. Use our existing color tokens where possible.
- Draw these 10 icons, each clearly recognizable:
  - sunflower: a small pile of striped seeds
  - millet: a small heap of tiny round yellow seeds
  - wheat: one golden wheat ear on a stem
  - peanuts: two peanut shells
  - walnut: a whole walnut with a visible split line
  - apple: two apple slices with a small seed
  - berries: a small cluster of blue and purple berries with a leaf
  - orange: a half orange showing its segments
  - mealworms: three small curled tan worms
  - water: a small bird bath bowl with water and a droplet
- Use FoodIcon everywhere a food emoji is shown now (the daily food buttons, the bird book dialog, "Seen eating" and "Favorite foods", and any other place). Keep the emoji field in the data file as a fallback, shown only if there is no icon for an id.
- Keep button sizes, layout, and spacing unchanged.
- Add a test that every food id has an icon. Do not refactor unrelated code. In your summary, list only the files you changed.