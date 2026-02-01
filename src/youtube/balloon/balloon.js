/**
 * yt-dlp balloon (snackbar) logic for YouTube.
 * Uses the HTML from balloon-template.js (window.ytdlpbutton_balloon_html) only.
 * Exposes: window.ytdlpbutton_showBalloon(message).
 */
(function () {
  'use strict';

  var BALLOON_AUTO_HIDE_MS = 8000;
  var BALLOON_ID = 'ytdlpbutton-balloon';
  var ICON_ID = 'ytdlpbutton-balloon-icon';
  var TEXT_ID = 'ytdlpbutton-balloon-text';
  var CLOSE_ID = 'ytdlpbutton-balloon-close';
  var ICON_SVG = 'youtube/balloon/copied.svg';

  function showBalloon(message) {
    if (message && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(message).catch(function () {});
    }

    var existing = document.getElementById(BALLOON_ID);
    if (existing) existing.remove();

    var html = typeof window.ytdlpbutton_balloon_html === 'string' ? window.ytdlpbutton_balloon_html : '';
    if (!html) return;

    var wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    var balloon = wrap.firstElementChild;
    if (!balloon) return;

    var iconEl = balloon.querySelector('#' + ICON_ID) || balloon.querySelector('.ytdlpbutton-balloon-icon');
    if (iconEl && typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function') {
      iconEl.src = chrome.runtime.getURL(ICON_SVG);
    }

    var textEl = balloon.querySelector('#' + TEXT_ID);
    if (textEl) textEl.textContent = message || '';

    var closeBtn = balloon.querySelector('#' + CLOSE_ID) || balloon.querySelector('button');

    document.body.appendChild(balloon);

    requestAnimationFrame(function () {
      balloon.classList.add('ytdlpbutton-balloon-visible');
    });

    function hide() {
      balloon.classList.remove('ytdlpbutton-balloon-visible');
      setTimeout(function () {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
      }, 250);
    }

    var timeoutId = setTimeout(hide, BALLOON_AUTO_HIDE_MS);
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        clearTimeout(timeoutId);
        hide();
      });
    }
  }

  window.ytdlpbutton_showBalloon = showBalloon;
})();
