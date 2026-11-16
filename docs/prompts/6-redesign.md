Restyle Mango's Garden for visual consistency. This is a visual and layout pass only. Do not change game logic, state, localStorage, algorithms, tests, or existing features, and do not remove anything.

1. DESIGN TOKENS
Define colors, radius, shadows, and spacing as CSS variables (or Tailwind theme tokens) in ONE place, and use them everywhere, so I can retheme the app later by changing only that file.
- Background: muted sage green, about #9CB38F, with a subtle soft gradient or gentle vignette for depth (not flat).
- Cards: warm cream, about #FFF6E6, with radius 20px and a soft shadow.
- Keep the existing orange primary buttons and warm brown text.
- Keep all bird and Mango illustrations exactly as they are.

2. GLOBAL LAYOUT
One shared layout wrapper for all screens: content centered, max width about 480px on desktop, consistent page padding, and consistent spacing between elements. Reuse existing components. Do not duplicate styles.

3. FLOATING CONTROLS
Replace the separate Bird Book and sound buttons with round icon buttons (44px, cream background, soft shadow) in one stack along the right edge on desktop, visible on every screen. Use clear icons (book for Bird Book, speaker or muted speaker for sound) with accessible labels. On desktop, add a hover tooltip.
On mobile, move the stack to a compact row fixed to the bottom or top corner so it never covers the main content, with tap targets of at least 44px.

4. STREAK
Show the streak as a clear pill (flame icon + number) in the same fixed position on every screen, using the global layout. Make it easy to notice, in the orange accent on a cream background.

5. LIMITS
- Do not implement new modal behavior or add new screens or features.
- Do not refactor unrelated code or rename files.
- Make only the changes needed for the points above, in a single pass.
- In your summary, list the files you changed and the token values you used. Keep the summary short.