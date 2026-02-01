# YouTube site integration

YouTube-specific UI and injection for yt-dlp. Uses the common `YtdlpCommandBuilder` from `src/ytdlp-command.js`.

- **content.js** – Injects the yt-dlp button next to Save on YouTube watch pages.
- **balloon/** – “Copied” snackbar (template, styles, copied.svg icon).
- **button/** – Button template, styles, and SVG icons (duration In/Out).
- **icons.ai** – Source assets (icons). Put **button.ai** / **duration.ai** here too if you have them.

To add another site (e.g. Vimeo): add `src/<site>/` with its own content script and UI that uses `YtdlpCommandBuilder`; no changes needed to `src/ytdlp-command.js`.
