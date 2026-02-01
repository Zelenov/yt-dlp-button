/**
 * Test-only: rewrites asset paths in shared templates so they load from the repo
 * when opening the test HTML (file:// or local server). Source templates use
 * extension-relative paths (youtube/button/, youtube/balloon/); the extension
 * resolves those via chrome.runtime.getURL. Tests have no extension, so we
 * rewrite to relative paths that point at src/youtube/ from tests/youtube/.
 */
(function () {
  'use strict';

  var srcBase = '../../src/youtube/';

  if (typeof window.ytdlpbutton_button_html === 'string') {
    window.ytdlpbutton_button_html = window.ytdlpbutton_button_html.replace(/youtube\/button\//g, srcBase + 'button/');
  }

  if (typeof window.ytdlpbutton_balloon_html === 'string') {
    window.ytdlpbutton_balloon_html = window.ytdlpbutton_balloon_html.replace(/youtube\/balloon\//g, srcBase + 'balloon/');
  }
})();
