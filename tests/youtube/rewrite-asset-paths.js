/**
 * Test-only: rewrites asset paths in shared templates so they load from the repo
 * when opening the test HTML (file:// or local server). Source templates use
 * extension-relative paths (sites/youtube/button/, balloon/); the extension resolves
 * those via chrome.runtime.getURL. Tests have no extension, so we rewrite to
 * relative paths: sites/youtube/button/ -> src/sites/youtube/button/, balloon/ -> src/balloon/.
 */
(function () {
  'use strict';

  var youtubeBase = '../../src/sites/youtube/';
  var balloonBase = '../../src/balloon/';

  if (typeof window.ytdlpbutton_button_html === 'string') {
    window.ytdlpbutton_button_html = window.ytdlpbutton_button_html.replace(/sites\/youtube\/button\//g, youtubeBase + 'button/');
  }

  if (typeof window.ytdlpbutton_balloon_html === 'string') {
    window.ytdlpbutton_balloon_html = window.ytdlpbutton_balloon_html.replace(/balloon\//g, balloonBase);
  }
})();
