Add a few decorative elements to the garden scene in Mango's Garden. This is a visual pass only. Do not change game logic, state, saved data, tests, or other screens.

ADD (keep the style flat, storybook, and consistent with the existing scene)
1. Wildflowers: one small reusable SVG flower component, placed in 8 to 12 spots along the foreground grass at different sizes and in 3 colors (poppy red, lavender purple, daisy white). Reuse the same component.
2. One grapevine branch hanging from the top-left corner: a short trailing vine with a few leaves and 2 small purple grape clusters, as a single SVG.
3. One or two small butterflies with a gentle plain-CSS float animation. No animation libraries.

RULES
- Decorations sit behind the feeder, Mango, bird card, floating controls, and streak pill. They must never cover or block them, and must have pointer-events: none.
- Keep the area around the feeder and Mango clear. On mobile (360px wide), hide or shrink the vine and show fewer flowers.
- Respect prefers-reduced-motion by turning the butterfly animation off.
- Keep existing colors, bird illustrations, and layout. Do not add trees, fences, pots, or a birdbath.
- Do not refactor unrelated code. In your summary, list only the files you changed.