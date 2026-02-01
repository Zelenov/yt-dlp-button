# yt-yt-dlp

Chrome extension that adds a **yt-yt-dlp** button to YouTube. When you click it, an alert pops up (step 1).

## Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `src` subfolder (this project’s `src` folder)
5. Open [YouTube](https://www.youtube.com) and open any video
6. You should see a **yt-yt-dlp** button (next to Like/Dislike or top-right). Click it to see the alert.

## Project structure

- `src/` — Chrome extension (load this folder in Chrome)
  - `manifest.json` — extension config (Manifest V3)
  - `content.js` — runs on YouTube, injects the button and shows alert on click
