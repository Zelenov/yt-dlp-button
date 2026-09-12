# YouTube site integration

YouTube-specific UI and injection for yt-dlp. Uses the shared core (`YtdlpCommandBuilder` from `src/ytdlp-command.js`) and shared balloon (`src/balloon/`).

## Contents

- **content.js** – Finds injection targets on YouTube watch pages (owner row, after the Subscribe button so the button stays visible when the viewport shrinks). Does not create the button; calls `ytdlpbutton_injectButton(target)` with context (`getVideoUrl`, `getVideoElement`). One video → one target. Uses MutationObserver and polling until injection succeeds.
- **button/** – yt-dlp button UI: template, CSS, and SVG icons (duration In/Out). `button.js` builds the node, injects it, and wires click handlers; it calls `YtdlpCommandBuilder.run(getVideoUrl())` for the main action.
  - **YouTube class names:** the template carries both the legacy kebab-case classes (`yt-spec-button-shape-next--tonal`) and the camelCase ones YouTube switched to in September 2026 (`ytSpecButtonShapeNextTonal`), so it is styled on either build. `button.js` and `button.css` only rely on our own `ytdlpbutton-*` hooks (`ytdlpbutton-segment-start/-mid/-end`, `ytdlpbutton-icon`, `ytdlpbutton-icon-shape`), never on YouTube's names.

The “Copied” snackbar (balloon) is shared across all sites and lives in **`src/balloon/`**; it is not duplicated here.

## Adding another site

Add `src/sites/<sitename>/` with its own content script and optional button; use `YtdlpCommandBuilder.run(getVideoUrl())` and the shared balloon. No changes needed to `src/ytdlp-command.js`. See AGENTS.md for the full guide.
