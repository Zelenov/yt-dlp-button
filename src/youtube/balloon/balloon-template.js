/**
 * yt-dlp balloon HTML template. Edit this string to change the snackbar markup.
 * The text node is filled by balloon.js; use empty element for message container.
 */
(function () {
  'use strict';
  window.ytytdlp_balloon_html = `
<div id="ytytdlp-balloon">
  <img id="ytytdlp-balloon-icon" class="ytytdlp-balloon-icon" src="youtube/balloon/copied.svg" width="24" height="24" alt="" aria-hidden="true">
  <div id="ytytdlp-balloon-text"></div>
  <button type="button" id="ytytdlp-balloon-close" aria-label="Close">\u00D7</button>
</div>`;
})();
