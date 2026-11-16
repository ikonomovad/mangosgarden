Add an app icon to Mango's Garden. No changes to game logic, UI, saved data, or tests.

- Create a square icon with rounded corners (about 22% radius) filled with our sage green (use the existing background token), showing the Mango bird illustration as it is now, centered with some padding. Save it as an SVG in public/ and use it as the browser favicon.
- Keep the old Lovable favicon file in public/ renamed to favicon-lovable.ico, no longer referenced.
- Add an apple-touch-icon (180x180 PNG) and PNG icons at 192x192 and 512x512 in public/, using the same artwork, with no transparent corners (full-bleed square for the touch icon, since phones round it themselves).
- Add a web app manifest (name "Mango's Garden", short_name "Mango", theme_color and background_color from our green, display "standalone", the icons above) and link it in index.html, with the theme-color meta tag.
- If you cannot generate PNG files, tell me exactly which files you could not create, and still do everything else.
- In your summary, list only the files you changed.