# yt-dlp-button

The button that generates yt-dlp command. Chrome extension that adds a **yt-dlp** button to video pages (e.g. YouTube). Click it to get a ready-made yt-dlp command and copy it to the clipboard.

## Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `src` subfolder (this project's `src` folder)
5. Open [YouTube](https://www.youtube.com) and open any video
6. You should see a **yt-dlp** button (next to Like/Dislike or top-right). Click it to get the command.

## Releases (GitHub)

Releases are built from **`release.md`** in the repo root. First line is the version as `# 0.1.0`; below that use `## Added`, `## Changed`, etc. with short list items. The GitHub Action (`.github/workflows/release.yml`) runs on push when `release.md` changes, or manually via **Actions → Release extension → Run workflow**.

- **From the main branch:** Creates a normal release and uploads the zip only if that version does not exist yet; otherwise the run is a no-op.
- **From any other branch:** Creates a **draft** release with tag and title suffixed by the branch name (e.g. `v0.1.0-feature-xyz`). Draft releases do not appear as “Latest release”; they are listed under Releases (marked as Draft) and in the Actions run. Each run from that branch replaces the previous draft.

**Running on a branch:** The workflow runs on any branch when `release.md` changes, but the workflow file must exist on that branch. Merge `main` (or the branch that has `.github/workflows/release.yml`) into your branch first. For a manual run, use **Actions → Release extension → Run workflow** and choose the branch in the dropdown.

## Project structure

- `src/` — Chrome extension (load this folder in Chrome)
  - `manifest.json` — extension config (Manifest V3)
  - `content.js` — runs on supported sites, injects the button and builds yt-dlp command on click
