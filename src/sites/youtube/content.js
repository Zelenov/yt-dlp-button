/**
 * YouTube page logic. Knows the watch page structure and where the yt-dlp button
 * should go. Does not create or inject the button; it finds targets and calls
 * button.js to inject. For TikTok we’d have multiple targets per page; here,
 * one video → one target.
 */
(function () {
  'use strict';

  var BUTTON_ID = 'ytdlpbutton-button';

  /**
   * We inject after the Subscribe button (in the owner row) so the button stays visible
   * when the viewport shrinks — the action row (Like, Share, More) can hide, but the
   * owner row (channel + Subscribe) stays.
   *
   * YouTube also renders a loading skeleton that has its own `#subscribe-button`
   * placeholder (class "skeleton-bg-color") before the real metadata appears, so we
   * must not rely on document.getElementById: it would return the hidden skeleton and
   * the button would be injected into an invisible element.
   */
  var SUBSCRIBE_SELECTORS = [
    'ytd-watch-metadata #owner #subscribe-button',
    'ytd-watch-metadata #subscribe-button',
    '#owner #subscribe-button'
  ];

  function isSkeleton(el) {
    return el.classList.contains('skeleton-bg-color') || !!el.closest('.skeleton, #skeleton, [id$="-skeleton"]');
  }

  function isRealSubscribeButton(el) {
    if (!el || !el.parentNode || isSkeleton(el)) return false;
    /* The real one has the subscribe renderer inside; the skeleton is an empty div. */
    return !!el.querySelector('ytd-subscribe-button-renderer, yt-subscribe-button-view-model, button');
  }

  function findSubscribeButton() {
    for (var i = 0; i < SUBSCRIBE_SELECTORS.length; i++) {
      var candidates = document.querySelectorAll(SUBSCRIBE_SELECTORS[i]);
      for (var j = 0; j < candidates.length; j++) {
        if (isRealSubscribeButton(candidates[j])) return candidates[j];
      }
    }
    /* Last resort: any non-skeleton #subscribe-button. */
    var all = document.querySelectorAll('#subscribe-button');
    for (var k = 0; k < all.length; k++) {
      if (isRealSubscribeButton(all[k])) return all[k];
    }
    return null;
  }

  /**
   * Returns injection target: the owner row, right after the Subscribe button.
   * @returns {{ container: Element, insertBefore?: Element, context: { getVideoUrl: function, getVideoElement: function } }[]}
   */
  function getInjectionTargets() {
    var subscribeEl = findSubscribeButton();
    if (!subscribeEl) return [];

    var container = subscribeEl.parentNode;
    var insertBefore = subscribeEl.nextSibling;

    var context = {
      getVideoUrl: function () { return window.location.href; },
      getVideoElement: function () { return document.querySelector('video'); }
    };
    return [{ container: container, insertBefore: insertBefore, context: context }];
  }

  function hasButton() {
    return !!document.querySelector('[id^="' + BUTTON_ID + '"]');
  }

  /** @returns {boolean} true if a button is present after this call */
  function tryInject() {
    if (hasButton()) return true;

    var targets = getInjectionTargets();
    if (targets.length === 0) return false;

    var inject = typeof window.ytdlpbutton_injectButton === 'function' ? window.ytdlpbutton_injectButton : null;
    if (!inject) return false;

    for (var i = 0; i < targets.length; i++) {
      if (inject(targets[i])) return true;
    }
    return false;
  }

  var POLL_INTERVAL_MS = 500;
  var pollTimer = null;

  function schedulePoll() {
    if (pollTimer) return;
    pollTimer = setTimeout(function () {
      pollTimer = null;
      if (!tryInject()) schedulePoll();
    }, POLL_INTERVAL_MS);
  }

  function start() {
    if (!tryInject()) schedulePoll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* YouTube is a SPA: the owner row is re-rendered on in-page navigation, which can drop
     our button. Re-inject whenever it disappears. */
  var observer = new MutationObserver(function () {
    if (!hasButton()) start();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('yt-navigate-finish', start);
})();
