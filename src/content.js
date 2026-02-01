(function () {
  'use strict';

  const FLEXIBLE_BUTTONS_SELECTOR = '#flexible-item-buttons';
  const SAVE_BUTTON_TEXT = 'Save';
  const ytytdlp_button_id = 'ytytdlp-button';

  /**
   * Returns the button HTML with extension image URLs resolved.
   * Uses window.ytytdlp_button_html from button-template.js and chrome.runtime.getURL for button/.
   */
  function getButtonHtml() {
    var html = typeof window.ytytdlp_button_html === 'string' ? window.ytytdlp_button_html : '';
    if (!html || typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.getURL) return html;
    var base = chrome.runtime.getURL('button/');
    return html.replace(/\.\.\/src\/button\//g, base);
  }

  function createButtonNode() {
    var html = getButtonHtml();
    if (!html) return null;
    var wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    var button = wrap.firstElementChild;
    if (!button) return null;
    button.id = ytytdlp_button_id;
    return button;
  }

  function injectButton() {
    var container = document.querySelector(FLEXIBLE_BUTTONS_SELECTOR);
    if (!container) return false;

    var saveWrapper = Array.from(container.querySelectorAll('yt-button-view-model')).find(function (el) {
      var textEl = el.querySelector('.yt-spec-button-shape-next__button-text-content');
      return textEl && textEl.textContent.trim() === SAVE_BUTTON_TEXT;
    });

    if (document.getElementById(ytytdlp_button_id)) return true;

    var ytDlpButton = createButtonNode();
    if (!ytDlpButton) return false;

    if (saveWrapper && saveWrapper.nextSibling) {
      container.insertBefore(ytDlpButton, saveWrapper.nextSibling);
    } else {
      container.appendChild(ytDlpButton);
    }

    if (typeof window.ytytdlp_attachButton === 'function') {
      window.ytytdlp_attachButton();
    }
    return true;
  }

  function tryInject() {
    if (injectButton()) return;
    setTimeout(tryInject, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInject);
  } else {
    tryInject();
  }

  var observer = new MutationObserver(function () {
    if (!document.getElementById(ytytdlp_button_id)) {
      injectButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
