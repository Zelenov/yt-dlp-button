/**
 * yt-dlp button: builds the button from the template and injects it into a
 * given container. Uses one global window.ytytdlp_button_html; each target
 * gets a clone. Refuses to inject if this container is already injected
 * (data-ytytdlp-injected). Context (getVideoUrl, getVideoElement) is
 * container-specific so each button knows which video it belongs to.
 * Expects: window.ytytdlp_button_html (button-template.js), window.YtdlpCommandBuilder (ytdlp-command.js).
 * Exposes: ytytdlp_injectButton(target), ytytdlp_attachButton().
 */
(function () {
  'use strict';

  var BUTTON_ID_PREFIX = 'ytytdlp-button';
  var CONTAINER_ID = 'ytytdlp-button-container';
  var CONTAINER_INJECTED_ATTR = 'data-ytytdlp-injected';

  function createButtonNode(instanceId) {
    var html = typeof window.ytytdlp_button_html === 'string' ? window.ytytdlp_button_html : '';
    if (!html) return null;
    var wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    var button = wrap.firstElementChild;
    if (!button) return null;
    button.id = instanceId || BUTTON_ID_PREFIX;
    return button;
  }

  /**
   * Injects the button into the given target. Does not inject if this
   * container already has a button (container[data-ytytdlp-injected]).
   * @param {{ container: Element, insertBefore?: Element, replace?: boolean, context?: { getVideoUrl, getVideoElement }, id?: string }} target
   *   - container: element to insert into (or to replace)
   *   - insertBefore: optional sibling to insert before; if omitted, appends
   *   - replace: if true, replace container with the button node (test page)
   *   - context: optional; getVideoUrl(), getVideoElement() for this slot (multi-target)
   *   - id: optional unique id for this instance (multi-target)
   * @returns {boolean} true if injection happened
   */
  function injectInto(target) {
    var container = target.container;
    if (!container || !container.parentNode) return false;
    if (container.getAttribute(CONTAINER_INJECTED_ATTR)) return false;

    var instanceId = target.id || BUTTON_ID_PREFIX;
    var node = createButtonNode(instanceId);
    if (!node) return false;

    if (target.replace) {
      container.parentNode.replaceChild(node, container);
    } else if (target.insertBefore) {
      container.insertBefore(node, target.insertBefore);
    } else {
      container.appendChild(node);
    }

    container.setAttribute(CONTAINER_INJECTED_ATTR, 'true');
    attachButton(node, target.context);
    return true;
  }

  function getVideoCurrentTime(videoEl) {
    var video = videoEl || document.querySelector('video');
    if (!video || typeof video.currentTime !== 'number' || Number.isNaN(video.currentTime)) return null;
    var seconds = video.currentTime;
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var formatted = h > 0
      ? h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
      : m + ':' + String(s).padStart(2, '0');
    return { seconds: seconds, formatted: formatted };
  }

  function attachButton(wrapper, context) {
    if (!wrapper) return;
    context = context || {};

    if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getURL === 'function') {
      var imgs = wrapper.querySelectorAll('img[src^="youtube/button/"]');
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = chrome.runtime.getURL(imgs[i].getAttribute('src'));
      }
    }

    var getVideoUrl = context.getVideoUrl || function () { return window.location.href; };
    var getVideoElement = context.getVideoElement || function () { return document.querySelector('video'); };

    var startBtn = wrapper.querySelector('.yt-spec-button-shape-next--segmented-start');
    var midBtn = wrapper.querySelector('.ytytdlp-segment-mid');
    var endBtn = wrapper.querySelector('.yt-spec-button-shape-next--segmented-end');

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var time = getVideoCurrentTime(getVideoElement());
        var labelWithTime = time ? 'Start at ' + time.formatted : 'Start';
        startBtn.setAttribute('aria-label', labelWithTime);
        startBtn.setAttribute('title', labelWithTime);
        var textSpan = startBtn.querySelector('.ytytdlp-duration-text [role="text"]');
        if (textSpan) textSpan.textContent = time ? time.formatted : '';
        if (time && window.YtdlpCommandBuilder) {
          window.YtdlpCommandBuilder.startTime = { seconds: time.seconds, formatted: time.formatted };
        }
        startBtn.classList.add('ytytdlp-selected');
        var normal = startBtn.querySelector('.ytytdlp-icon-normal');
        var selected = startBtn.querySelector('.ytytdlp-icon-selected');
        if (normal && selected) { normal.style.display = 'none'; selected.style.display = 'block'; }
      });
    }

    if (midBtn) {
      midBtn.addEventListener('click', function () {
        var builder = new window.YtdlpCommandBuilder();
        var message = builder.build(getVideoUrl());
        if (typeof window.ytytdlp_showBalloon === 'function') {
          window.ytytdlp_showBalloon(message);
        }
      });
    }

    if (endBtn) {
      endBtn.addEventListener('click', function () {
        var time = getVideoCurrentTime(getVideoElement());
        var labelWithTime = time ? 'End at ' + time.formatted : 'End';
        endBtn.setAttribute('aria-label', labelWithTime);
        endBtn.setAttribute('title', labelWithTime);
        var textSpan = endBtn.querySelector('.ytytdlp-duration-text [role="text"]');
        if (textSpan) textSpan.textContent = time ? time.formatted : '';
        if (time && window.YtdlpCommandBuilder) {
          window.YtdlpCommandBuilder.endTime = { seconds: time.seconds, formatted: time.formatted };
        }
        endBtn.classList.add('ytytdlp-selected');
        var normal = endBtn.querySelector('.ytytdlp-icon-normal');
        var selected = endBtn.querySelector('.ytytdlp-icon-selected');
        if (normal && selected) { normal.style.display = 'none'; selected.style.display = 'block'; }
      });
    }
  }

  window.ytytdlp_injectButton = injectInto;
  window.ytytdlp_attachButton = attachButton;

  /** Test page: inject into #ytytdlp-button-container (replace that div with the button). */
  function run() {
    var container = document.getElementById(CONTAINER_ID);
    if (container) {
      injectInto({ container: container, replace: true }); /* no context: uses window.location.href and document.querySelector('video') */
    } else {
      var existing = document.getElementById(BUTTON_ID_PREFIX);
      if (existing) attachButton(existing, null);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
