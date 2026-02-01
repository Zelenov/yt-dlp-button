# yt-dlp-button

The button that generates yt-dlp command. Chrome extension that adds a **yt-dlp** button to video pages (e.g. YouTube). Click it to get a ready-made yt-dlp command and copy it to the clipboard.

## Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `src` subfolder (this project's `src` folder)
5. Open [YouTube](https://www.youtube.com) and open any video
6. You should see a **yt-dlp** button (next to Like/Dislike or top-right). Click it to get the command.

## Project structure

- `src/` — Chrome extension (load this folder in Chrome)
  - `manifest.json` — extension config (Manifest V3)
  - `content.js` — runs on supported sites, injects the button and builds yt-dlp command on click
