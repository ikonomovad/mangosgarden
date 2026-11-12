<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Game content (birds, foods, Mango lines) lives in `src/data/*`; game rules are pure functions in `src/lib/game.ts` with tests in `src/lib/game.test.ts` — keeps tuning separate from UI.
- All birds (including Mango) render through one `BirdSvg` component driven by data look fields — no per-species images.
- Saved data is browser-only localStorage via `src/lib/storage.ts`: daily history trimmed to today + 2 previous days; the bird book collection is a separate key kept forever — no backend by design.
- Visitor scoring lives in pure `src/lib/visitor.ts` (re-exported from game.ts) so the algorithm can be tuned alone.
- Streak and countdown math are pure functions in `src/lib/game.ts`; each day record stores the streak before that visit so the testing reset can undo it exactly.
- Reaction precedence, non-repeating variants, milestone eligibility, and food-hint thresholds are pure rules in `src/lib/personality.ts`; all Mango wording stays in the existing data file for easy tuning.
- Day records snapshot the previous collection entry so reset reverses food discoveries exactly; permanent milestone and reaction memory is never reset so celebrations do not repeat.
- Optional Web Audio lives in `src/lib/sounds.ts` and is called only from a feeding tap when sound is enabled, keeping SSR safe and mobile playback user-initiated.
- Every screen renders inside `src/components/layout/PageShell.tsx` (fixed streak pill + floating book/sound controls); theme tokens live only in `src/styles.css` — one place to retheme.
- Shared viewport utilities use the dynamic-height token with a legacy fallback; PageShell owns content scrolling and safe-area offsets so browser toolbars cannot create document overflow.
- Gameplay reads current time through getNow in game.ts; optional developer UI and setup actions stay in src/debug and reload after mutations so normal game loading remains authoritative.
- Home-screen support is manifest-only, with head links in the root route and static icons derived from the existing Mango SVG; no service worker or offline caching is introduced.
- Localization is presentation-only: language dictionaries and registry live in src/i18n, data translations stay beside existing English content, and saved reaction strings/IDs remain unchanged; the provider owns the separate language preference and locale formatting.
- Retired content is filtered against the current data registries on saved-data reads; a visit with a retired food also loses its visitor lock so it cannot trap the game on an unrenderable card.
- Food artwork lives in the single FoodIcon registry, using global theme tokens; food displays reuse it and fall back to the data emoji only when artwork is missing.
