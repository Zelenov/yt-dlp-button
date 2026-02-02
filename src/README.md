# yt-dlp-button – Build instructions (Firefox Add-on source)

This directory is the add-on. **No build step.** The source is plain JavaScript, CSS, and HTML; nothing is transpiled or minified.

To create an exact copy of the add-on: zip this directory. The contents of the zip must be the files in this folder at the root of the archive (so `manifest.json` is at the root of the zip). Use forward slashes in zip entry names (required by Firefox Add-ons).

**Requirements:** None. Any OS; use your system’s zip tool or PowerShell’s Compress-Archive (ensure paths use forward slashes if required by the store).
