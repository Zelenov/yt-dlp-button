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
   */
  var SUBSCRIBE_BUTTON_ID = 'subscribe-button';

  /**
   * Returns injection target: the owner row, right after the Subscribe button.
   * @returns {{ container: Element, insertBefore?: Element, context: { getVideoUrl: function, getVideoElement: function } }[]}
   */
  function getInjectionTargets() {
    var subscribeEl = document.getElementById(SUBSCRIBE_BUTTON_ID);
    if (!subscribeEl || !subscribeEl.parentNode) return [];

    var container = subscribeEl.parentNode;
    var insertBefore = subscribeEl.nextSibling;

    var context = {
      getVideoUrl: function () { return window.location.href; },
      getVideoElement: function () { return document.querySelector('video'); }
    };
    return [{ container: container, insertBefore: insertBefore, context: context }];
  }

  function tryInject() {
    var targets = getInjectionTargets();
    if (targets.length === 0) return;

    var inject = typeof window.ytdlpbutton_injectButton === 'function' ? window.ytdlpbutton_injectButton : null;
    if (!inject) return;

    for (var i = 0; i < targets.length; i++) {
      if (inject(targets[i])) return;
    }
  }

  function scheduleTry() {
    if (tryInject()) return;
    setTimeout(scheduleTry, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleTry);
  } else {
    scheduleTry();
  }

  var observer = new MutationObserver(function () {
    if (!document.querySelector('[id^="' + BUTTON_ID + '"]')) {
      tryInject();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
