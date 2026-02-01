# Repository guide for AI (Claude)

This document describes the **yt-dlp-button** repository: what it does, how it is structured, where logic lives, and where to put new or changed code.

---

## What this project is

**yt-dlp-button** is a **Chrome extension** (Manifest V3) for **multiple sites** — any site that [yt-dlp](https://github.com/yt-dlp/yt-dlp) supports. On a supported video page, the extension adds a control that produces a ready-made **yt-dlp** command; the user can copy it to the clipboard. Optional **In/Out** segment buttons use the current video time to build a command with `--download-sections "*start-end"`.

- **Currently supported site:** only **YouTube** is implemented. Other sites (Vimeo, etc.) are intended to be added following the same architecture.
- **Load in Chrome:** `chrome://extensions/` → Developer mode → Load unpacked → select the **`src`** folder.
- **Entry point for YouTube:** Content scripts run on `https://www.youtube.com/watch*` (see `src/manifest.json`).

---

## Architecture: core vs site-specific

**Rule:** The extension has **one shared core** and **site-specific integrations**. When adding or changing code, keep this separation strict.

| Layer | What it is | Where it lives | Rule |
|-------|------------|----------------|------|
| **Core** | **yt-dlp command building** — builds the command line and triggers copy+balloon. No site-specific DOM. | **`src/ytdlp-command.js`** | Do **not** put site-specific logic or selectors here. Single entry point: `YtdlpCommandBuilder.run(videoUrl)`. |
| **Shared UI** | **Balloon (snackbar)** — “Copied” pop-up only; clipboard is handled by the core. Site-agnostic. | **`src/balloon/`** | Used by all sites. Load balloon scripts from here; do not duplicate per site. |
| **Site-specific** | Where to put the button, page structure, button UI, assets, selectors. | **`src/sites/<sitename>/`** (e.g. `src/sites/youtube/`, `src/sites/vimeo/`) | Each site has its own folder under `sites/`. New site = new folder; do **not** add site logic to `ytdlp-command.js`. |

When you are asked to **add support for another site**, you must:

1. **Leave `src/ytdlp-command.js` unchanged** — it already builds the command from a URL; all sites use it.
2. **Create `src/sites/<sitename>/`** with that site’s content script, and optionally its own button (or reuse YouTube’s). The balloon is shared (`src/balloon/`); do not duplicate it per site.
3. **Register** the new site in `manifest.json` (URL pattern + scripts/CSS). Do not mix site-specific code into the core.

---

## Repository structure (high level)

```
ytytdlp/
├── src/                    # Chrome extension root (load this in Chrome)
│   ├── manifest.json       # Extension config; content_scripts order matters
│   ├── ytdlp-command.js    # Shared: builds command + run(videoUrl)
│   ├── balloon/            # Shared: “Copied” snackbar (template, CSS, icon)
│   └── sites/
│       └── youtube/        # YouTube-specific integration
│           ├── content.js  # Page logic: finds where to put the button, calls inject
│           ├── button/     # yt-dlp button (template, CSS, SVG icons)
│           ├── icons.ai    # Source assets for icons
│           └── README.md   # Short YouTube integration notes
├── tests/
│   └── youtube/            # Local test of button/balloon without the extension
│       ├── v1.html         # Saved YouTube watch page; includes #ytdlpbutton-button-container
│       ├── v1-*.css        # Dumped page styles
│       ├── rewrite-asset-paths.js  # Rewrites extension paths → repo paths for file://
│       └── img/            # Test images
├── README.md               # User-facing: how to load the extension
└── AGENTS.md               # This file
```

---

## Where things live and what they do

### 1. `src/manifest.json`

- Declares **content_scripts** for `https://www.youtube.com/watch*`.
- **Script order is important.** Current order:
  1. `ytdlp-command.js` — defines `YtdlpCommandBuilder` and `run`
  2. `balloon/balloon-template.js` — sets `window.ytdlpbutton_balloon_html`
  3. `balloon/balloon.js` — sets `window.ytdlpbutton_showBalloon`
  4. `sites/youtube/button/button-template.js` — sets `window.ytdlpbutton_button_html`
  5. `sites/youtube/button/button.js` — sets `ytdlpbutton_injectButton`, `ytdlpbutton_attachButton`
  6. `sites/youtube/content.js` — finds injection targets and calls `ytdlpbutton_injectButton`
- **CSS:** `balloon/balloon.css`, `sites/youtube/button/button.css`.
- **web_accessible_resources:** `sites/youtube/button/*.svg`, `balloon/copied.svg` (for extension URLs).

When adding or reordering scripts, keep this dependency order.

---

### 2. `src/ytdlp-command.js` — command building and “generate and copy” (shared)

- **Role:** Builds the yt-dlp command string and provides the single entry point for “generate and copy” (build → copy → show balloon). **Site-agnostic;** no DOM, no site selectors.
- **API:**
  - **Class:** `YtdlpCommandBuilder` (attached to `window` in browser).
  - **Static:** `YtdlpCommandBuilder.startTime` and `YtdlpCommandBuilder.endTime` — `{ seconds, formatted } | null`, set by the In/Out buttons.
  - **Instance:** `builder.build(videoUrl)` → string like `yt-dlp "URL" --recode-video mp4` and optionally `--download-sections "*start-end"`.
  - **Static:** `YtdlpCommandBuilder.run(videoUrl)` — builds the command for `videoUrl`, copies it to the clipboard, then calls `window.ytdlpbutton_showBalloon(command)`. **Sites call this** when the user clicks the yt-dlp button; the core handles everything.
- **Where to put:** Any change to the **command format** or **options** (e.g. recode, sections) goes here. Do not put site-specific logic here.

---

### 3. `src/sites/youtube/content.js` — where to inject the button (YouTube only)

- **Role:** Knows the **YouTube watch page** structure. Finds **injection targets** (where the button should go). Does **not** create the button; it calls `window.ytdlpbutton_injectButton(target)`.
- **Main functions:**
  - **`getInjectionTargets()`** — returns an array of targets. Each target: `{ container, insertBefore?, context }`. `context` has `getVideoUrl()` and `getVideoElement()` so the button can get the current video URL and `<video>` element.
  - **`tryInject()`** — gets targets, calls `ytdlpbutton_injectButton` for each until one succeeds.
  - Uses **MutationObserver** and **polling** (e.g. every 500 ms) until the target area exists and injection succeeds.
- **Constants:** `FLEXIBLE_BUTTONS_SELECTOR` = `#flexible-item-buttons`, button is placed next to the “Save” button.
- **Where to put:** Any change to **where** on the YouTube page the button appears, or how many targets (e.g. one video → one target) goes here. Selectors and DOM assumptions for YouTube belong here.

---

### 4. `src/sites/youtube/button/` — the yt-dlp button UI

- **button-template.js**  
  - Sets **`window.ytdlpbutton_button_html`** (one HTML string).  
  - **Where to put:** Any change to the **markup** of the button (structure, classes, segments, icons) goes here. Asset paths in the template use extension-relative paths like `sites/youtube/button/...`; the extension resolves them via `chrome.runtime.getURL` in `button.js`.

- **button.js**  
  - **Role:** Builds the button node from the template, injects it, wires click handlers. Uses **one** global HTML template; each target gets a **clone**.
  - **API it expects:** `window.ytdlpbutton_button_html`, `window.YtdlpCommandBuilder`.  
  - **API it exposes:**  
    - **`ytdlpbutton_injectButton(target)`** — `target`: `{ container, insertBefore?, replace?, context?, id? }`. Injects into `container` (or replaces it if `replace: true`). Skips if container has `data-ytdlpbutton-injected`. Calls `attachButton(node, context)` after inject.  
    - **`ytdlpbutton_attachButton(node, context)`** — attaches listeners to an existing button node (used for test page).
  - **Injection guard:** `data-ytdlpbutton-injected` on the container prevents double injection.
  - **Behavior:**  
    - **Start (In):** reads `getVideoElement()` → `currentTime`, formats it, sets `YtdlpCommandBuilder.startTime`, updates label/text/icon.  
    - **Middle (yt-dlp):** calls **`YtdlpCommandBuilder.run(getVideoUrl())`** — the core builds the command, copies it, and shows the balloon.  
    - **End (Out):** same as Start but sets `YtdlpCommandBuilder.endTime`.
  - **Test page:** If `#ytdlpbutton-button-container` exists, injects with `replace: true` and no site context (uses `window.location.href` and `document.querySelector('video')`).
  - **Where to put:** Button **behavior**, **event handling**, **injection logic**, and **asset URL rewriting** for the extension go here. Do not put YouTube DOM selectors here (those are in `content.js`).

- **button.css**  
  - Styles for the button. **Where to put:** All visual styling of the button.

- **SVGs** (`duration_in.svg`, `duration_in.selected.svg`, `duration_out.svg`, `duration_out.selected.svg`)  
  - Icons for In/Out. Referenced in the template; must be in **web_accessible_resources** in `manifest.json`.

---

### 5. `src/balloon/` — shared “Copied” snackbar

- **Role:** Site-agnostic snackbar used by all sites. Called by **ytdlp-command.js** via `ytdlpbutton_showBalloon(message)` (triggered from `YtdlpCommandBuilder.run(videoUrl)`).
- **balloon-template.js**  
  - Sets **`window.ytdlpbutton_balloon_html`**. Contains placeholders for icon and text; **balloon.js** fills the message and sets the icon `src`.

- **balloon.js**  
  - **Role:** Shows a snackbar with the message (clipboard is handled by the core), auto-hides after a delay.  
  - **API:** **`window.ytdlpbutton_showBalloon(message)`**.  
  - Uses `window.ytdlpbutton_balloon_html` and rewrites the balloon icon to `chrome.runtime.getURL('balloon/copied.svg')` when in the extension.

- **balloon.css**  
  - Styles for the balloon. **Where to put:** Snackbar layout and appearance.

- **copied.svg**  
  - Icon for the balloon. Must be in **web_accessible_resources**.

---

## Data flow (summary)

1. **content.js** (YouTube) finds targets → calls **ytdlpbutton_injectButton(target)**.
2. **button.js** creates node from **ytdlpbutton_button_html**, injects into target’s `container`, sets **data-ytdlpbutton-injected**, then **attachButton(node, context)**.
3. User clicks **In** → **button.js** reads video time → sets **YtdlpCommandBuilder.startTime** and updates UI.
4. User clicks **Out** → same for **YtdlpCommandBuilder.endTime**.
5. User clicks **yt-dlp** → **button.js** calls **`YtdlpCommandBuilder.run(getVideoUrl())`** → **ytdlp-command.js** builds command, copies to clipboard, then calls **ytdlpbutton_showBalloon(command)** → **balloon.js** shows snackbar, then hides it.

---

## Tests (`tests/youtube/`)

- **v1.html** is a **saved YouTube watch page** (e.g. SingleFile). It includes:
  - Links to extension CSS: `../../src/balloon/balloon.css`, `../../src/sites/youtube/button/button.css`.
  - Scripts in order: `ytdlp-command.js` → balloon-template → button-template → **rewrite-asset-paths.js** → balloon.js → button.js.
  - A div **`<div id="ytdlpbutton-button-container"></div>`** that **button.js** **replaces** with the real button (no `content.js`), so you can test the button and balloon without loading the extension.
- **rewrite-asset-paths.js** (test-only) rewrites paths in template strings: `sites/youtube/button/` → `../../src/sites/youtube/button/`, `balloon/` → `../../src/balloon/`, so assets load when opening the HTML as **file://** or from a local server.
- **Where to put:** New test pages or test helpers for the YouTube UI go under `tests/youtube/`. Keep **rewrite-asset-paths.js** in sync with any new template paths that need rewriting.

---

## Adding another site (e.g. Vimeo, Twitch)

**Remember:** The extension is for **multiple sites** that yt-dlp supports. Only YouTube exists today. When adding a new site, follow these rules so the core stays shared and everything site-specific stays isolated.

### Rules when adding a new site

1. **Do not modify `src/ytdlp-command.js`.**  
   It is the **core**: it builds the yt-dlp command line from a URL. All sites use it as-is. Command format or options (e.g. recode, sections) are the only reason to change this file — and those are global, not per-site.

2. **Create a new site folder: `src/<sitename>/`**  
   Put **all** code that depends on that site’s DOM, URL pattern, or UI here. For example:
   - **Content script** (e.g. `content.js`) that:
     - Matches that site’s video page URL.
     - Finds **injection targets** (where to put the button).
     - Builds **context** with `getVideoUrl()` and `getVideoElement()` for that page.
     - Calls **`window.ytdlpbutton_injectButton(target)`** (same API as YouTube).
   - Optionally **button/** (templates, CSS, assets) if the site needs its own look; otherwise reuse YouTube’s from `sites/youtube/`. The balloon is shared (`src/balloon/`); load it from the manifest for the new site’s content_scripts.

3. **Register the site in `manifest.json`**  
   Add a new **content_scripts** entry (or extend matches) for that site’s URL pattern. Include in order: `ytdlp-command.js`, then `balloon/balloon-template.js`, `balloon/balloon.js` (shared), then that site’s button scripts, then that site’s content script. List any new assets in **web_accessible_resources**. For “generate and copy,” the site’s button calls **`YtdlpCommandBuilder.run(getVideoUrl())`** — no need to call the balloon directly.

4. **Keep site-specific logic out of the core.**  
   Selectors, DOM assumptions, and “where does the button go” belong only in **`src/<sitename>/`**. The core only knows: “given a video URL, return a yt-dlp command string.”

---

## Conventions and tips for edits

- **Core vs shared vs site:** The **core** is `ytdlp-command.js` (build command + `run`). The **balloon** is shared in `src/balloon/` and used by all sites. Everything that differs per site (selectors, injection, button UI) lives under **`src/sites/<sitename>/`**. When in doubt: if it’s about “this page’s DOM” or “this site’s URL,” it’s site-specific — do not put it in `ytdlp-command.js`.
- **Global names:** The extension uses globals on `window`: `YtdlpCommandBuilder`, `ytdlpbutton_button_html`, `ytdlpbutton_balloon_html`, `ytdlpbutton_injectButton`, `ytdlpbutton_attachButton`, `ytdlpbutton_showBalloon`. Keep these names when changing call sites or templates.
- **IDs/attributes:** Button id prefix `ytdlpbutton-button`, container id `ytdlpbutton-button-container`, injected flag `data-ytdlpbutton-injected`, balloon id `ytdlpbutton-balloon`. Used by content.js and tests; avoid renaming without updating all references.
- **Script order:** Templates and command builder must load before button and balloon logic; button and balloon must load before content.js. When adding scripts, add them in the right place in **manifest.json** and, for tests, in **v1.html**.
- **Assets:** New SVGs or images used in templates should be listed in **web_accessible_resources** in **manifest.json** and, if used in tests, considered in **rewrite-asset-paths.js**.

This should be enough for Claude (or another AI) to understand the repo, find the right file for a change, and add new code in the right place.
