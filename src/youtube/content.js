/**
 * YouTube page logic. Knows the watch page structure and where the yt-dlp button
 * should go. Does not create or inject the button; it finds targets and calls
 * button.js to inject. For TikTok we’d have multiple targets per page; here,
 * one video → one target.
 */
(function () {
  'use strict';

  var BUTTON_ID = 'ytdlpbutton-button';

  /** YouTube watch page: selector for the row that contains Save / clip buttons. */
  var FLEXIBLE_BUTTONS_SELECTOR = '#flexible-item-buttons';
  /** Text of the button we insert next to (YouTube "Save"). */
  var SAVE_BUTTON_TEXT = 'Save';

  /**
   * Analyzes the page and returns injection targets. One target = one place to
   * inject the button (e.g. one video → one target; TikTok could return many).
   * Each target includes a context specific to that container (video URL, video
   * element) so the button knows which video it belongs to.
   * @returns {{ container: Element, insertBefore?: Element, context: { getVideoUrl: function, getVideoElement: function } }[]}
   */
  function getInjectionTargets() {
    var container = document.querySelector(FLEXIBLE_BUTTONS_SELECTOR);
    if (!container) return [];

    var saveWrapper = Array.from(container.querySelectorAll('yt-button-view-model')).find(function (el) {
      var textEl = el.querySelector('.yt-spec-button-shape-next__button-text-content');
      return textEl && textEl.textContent.trim() === SAVE_BUTTON_TEXT;
    });

    var insertBefore = saveWrapper && saveWrapper.nextSibling || null;
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
