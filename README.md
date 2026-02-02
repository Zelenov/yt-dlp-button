<div align="center">

![yt-dlp-button on YouTube](docs/yt-dlp-button-cover.jpg)

</div>
The button generates a **yt-dlp** command straight on a YouTube page. 

This extension **does not download files**. You run that generated command yourself to download.

## How to actually download

1. **Download** yt-dlp ([yt-dlp](https://github.com/yt-dlp/yt-dlp)).
2. Open **Command Prompt** (Windows) or **Terminal** (macOS/Linux).
3. Paste the command copied by the extension and press Enter.


## Installation

- **Chrome:** [Chrome Web Store](https://chromewebstore.google.com/) or `chrome://extensions/` → Developer mode → Load unpacked → select the **`src`** folder.
- **Edge:** [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/) or `edge://extensions/` → Developer mode → Load unpacked → select the **`src`** folder.
- **Firefox:** [Firefox Add-ons](https://addons.mozilla.org/) or `about:debugging` → This Firefox → Load Temporary Add-on → select **`src/manifest.json`** (or load the **`src`** folder via a signed build). Firefox 109 or newer is required.

## On YouTube

A new button appears below the video, next to the action row (Like, Share, etc.).

Click the **yt-dlp** button to copy the command for the current video. Use the optional **In** and **Out** buttons to set start and end times from the current playback position.
