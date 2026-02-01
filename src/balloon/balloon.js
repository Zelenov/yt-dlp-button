/**
 * yt-dlp command balloon (snackbar) logic. Used by button.js and by content script context.
 * Expects: window.ytytdlp_balloon_html (from balloon-template.js).
 * Exposes: window.ytytdlp_showBalloon(message).
 */
(function () {
  'use strict';

  var BALLOON_AUTO_HIDE_MS = 8000;
  var BALLOON_ID = 'ytytdlp-balloon';
  var ICON_ID = 'ytytdlp-balloon-icon';
  var TEXT_ID = 'ytytdlp-balloon-text';
  var CLOSE_ID = 'ytytdlp-balloon-close';
  var ICON_SVG = 'balloon/copied.svg';

  function showBalloon(message) {
    if (message && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(message).catch(function () {});
    }

    var existing = document.getElementById(BALLOON_ID);
    if (existing) existing.remove();

    var html = typeof window.ytytdlp_balloon_html === 'string' ? window.ytytdlp_balloon_html : '';
    var balloon;

    if (html) {
      var wrap = document.createElement('div');
      wrap.innerHTML = html.trim();
      balloon = wrap.firstElementChild;
    }

    if (!balloon) {
      balloon = document.createElement('div');
      balloon.id = BALLOON_ID;
      var iconEl = document.createElement('img');
      iconEl.id = ICON_ID;
      iconEl.className = 'ytytdlp-balloon-icon';
      iconEl.setAttribute('width', '24');
      iconEl.setAttribute('height', '24');
      iconEl.setAttribute('alt', '');
      iconEl.setAttribute('aria-hidden', 'true');
      balloon.appendChild(iconEl);
      var textEl = document.createElement('div');
      textEl.id = TEXT_ID;
      balloon.appendChild(textEl);
      var closeBtn = document.createElement('button');
      closeBtn.id = CLOSE_ID;
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.textContent = '\u00D7';
      balloon.appendChild(closeBtn);
    }

    var iconEl = balloon.querySelector('#' + ICON_ID) || balloon.querySelector('.ytytdlp-balloon-icon');
    if (iconEl) {
      iconEl.src = (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function')
        ? chrome.runtime.getURL(ICON_SVG)
        : '../src/balloon/copied.svg';
    }

    var closeBtn = balloon.querySelector('#' + CLOSE_ID) || balloon.querySelector('button');

    var textEl = balloon.querySelector('#' + TEXT_ID) || balloon.firstElementChild;
    if (textEl) textEl.textContent = message || '';

    document.body.appendChild(balloon);

    requestAnimationFrame(function () {
      balloon.classList.add('ytytdlp-balloon-visible');
    });

    function hide() {
      balloon.classList.remove('ytytdlp-balloon-visible');
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

  window.ytytdlp_showBalloon = showBalloon;
})();
