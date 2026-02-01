/**
 * yt-dlp balloon HTML template. Edit this string to change the snackbar markup.
 * The text node is filled by balloon.js; use empty element for message container.
 */
(function () {
  'use strict';
  window.ytdlpbutton_balloon_html = `
<div id="ytdlpbutton-balloon">
  <img id="ytdlpbutton-balloon-icon" class="ytdlpbutton-balloon-icon" src="balloon/copied.svg" width="24" height="24" alt="" aria-hidden="true">
  <div id="ytdlpbutton-balloon-text"></div>
  <button type="button" id="ytdlpbutton-balloon-close" aria-label="Close">\u00D7</button>
</div>`;
})();
