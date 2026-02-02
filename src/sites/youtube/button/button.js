/**
 * yt-dlp button: builds the button from the template and injects it into a
 * given container. Uses one global window.ytdlpbutton_button_html; each target
 * gets a clone. Refuses to inject if this container is already injected
 * (data-ytdlpbutton-injected). Context (getVideoUrl, getVideoElement) is
 * container-specific so each button knows which video it belongs to.
 * Expects: window.ytdlpbutton_button_html (button-template.js), window.YtdlpCommandBuilder (ytdlp-command.js).
 * Exposes: ytdlpbutton_injectButton(target), ytdlpbutton_attachButton().
 */
(function () {
  'use strict';

  var BUTTON_ID_PREFIX = 'ytdlpbutton-button';
  var CONTAINER_ID = 'ytdlpbutton-button-container';
  var CONTAINER_INJECTED_ATTR = 'data-ytdlpbutton-injected';

  function createButtonNode(instanceId) {
    var html = typeof window.ytdlpbutton_button_html === 'string' ? window.ytdlpbutton_button_html : '';
    if (!html) return null;
    var doc = new DOMParser().parseFromString(html.trim(), 'text/html');
    var button = doc.body.firstElementChild;
    if (!button) return null;
    button.id = instanceId || BUTTON_ID_PREFIX;
    return button;
  }

  /**
   * Injects the button into the given target. Does not inject if this
   * container already has a button (container[data-ytdlpbutton-injected]).
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

  /**
   * Normalizes a YouTube watch URL to the canonical video-only form (only the v= parameter).
   * Handles parameters in any order. E.g. watch?v=ID&list=...&start_radio=1 -> watch?v=ID
   * @param {string} url - Full page URL (e.g. with list=, start_radio=, etc.)
   * @returns {string} Normalized URL, or original if parsing fails.
   */
  function normalizeYouTubeVideoUrl(url) {
    if (!url || typeof url !== 'string') return url || '';
    var trimmed = url.trim();
    if (!trimmed) return trimmed;
    try {
      var parsed = new URL(trimmed);
      var host = parsed.hostname.toLowerCase();
      if ((host === 'www.youtube.com' || host === 'youtube.com') && parsed.pathname === '/watch') {
        var v = parsed.searchParams.get('v');
        if (v) return parsed.origin + parsed.pathname + '?v=' + v;
      }
    } catch (e) {}
    return trimmed;
  }

  /**
   * Builds parameters (videoUrl, additionalArgs) for the command builder. Gets URL from context
   * and additional args from YtdlpSettings (YouTube section) when available.
   * @param {function(): string} getVideoUrl
   * @returns {Promise<{ videoUrl: string, additionalArgs: string }>}
   */
  async function getCommandParams(getVideoUrl) {
    var rawUrl = getVideoUrl();
    var videoUrl = normalizeYouTubeVideoUrl(rawUrl);
    var additionalArgs = '';
    if (typeof window.YtdlpSettings !== 'undefined' && typeof window.YtdlpSettings.getSettings === 'function') {
      var s = await window.YtdlpSettings.getSettings();
      additionalArgs = (s.youtube && s.youtube.additionalArgs != null) ? s.youtube.additionalArgs : '';
    }
    return { videoUrl: videoUrl, additionalArgs: additionalArgs };
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
      var imgs = wrapper.querySelectorAll('img[src^="sites/youtube/button/"]');
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = chrome.runtime.getURL(imgs[i].getAttribute('src'));
      }
    }

    var getVideoUrl = context.getVideoUrl || function () { return window.location.href; };
    var getVideoElement = context.getVideoElement || function () { return document.querySelector('video'); };

    var startBtn = wrapper.querySelector('.yt-spec-button-shape-next--segmented-start');
    var midBtn = wrapper.querySelector('.ytdlpbutton-segment-mid');
    var endBtn = wrapper.querySelector('.yt-spec-button-shape-next--segmented-end');

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var time = getVideoCurrentTime(getVideoElement());
        var labelWithTime = time ? 'Start at ' + time.formatted : 'Start';
        startBtn.setAttribute('aria-label', labelWithTime);
        startBtn.setAttribute('title', labelWithTime);
        var textSpan = startBtn.querySelector('.ytdlpbutton-duration-text [role="text"]');
        if (textSpan) textSpan.textContent = time ? time.formatted : '';
        if (time && window.YtdlpCommandBuilder) {
          window.YtdlpCommandBuilder.startTime = time.seconds;
        }
        startBtn.classList.add('ytdlpbutton-selected');
        var normal = startBtn.querySelector('.ytdlpbutton-icon-normal');
        var selected = startBtn.querySelector('.ytdlpbutton-icon-selected');
        if (normal && selected) { normal.style.display = 'none'; selected.style.display = 'block'; }
      });
    }

    if (midBtn) {
      midBtn.addEventListener('click', async function () {
        if (!window.YtdlpCommandBuilder || typeof window.YtdlpCommandBuilder.run !== 'function') return;
        var params = await getCommandParams(getVideoUrl);
        window.YtdlpCommandBuilder.run(params.videoUrl, params.additionalArgs);
      });
    }

    if (endBtn) {
      endBtn.addEventListener('click', function () {
        var time = getVideoCurrentTime(getVideoElement());
        var labelWithTime = time ? 'End at ' + time.formatted : 'End';
        endBtn.setAttribute('aria-label', labelWithTime);
        endBtn.setAttribute('title', labelWithTime);
        var textSpan = endBtn.querySelector('.ytdlpbutton-duration-text [role="text"]');
        if (textSpan) textSpan.textContent = time ? time.formatted : '';
        if (time && window.YtdlpCommandBuilder) {
          window.YtdlpCommandBuilder.endTime = time.seconds;
        }
        endBtn.classList.add('ytdlpbutton-selected');
        var normal = endBtn.querySelector('.ytdlpbutton-icon-normal');
        var selected = endBtn.querySelector('.ytdlpbutton-icon-selected');
        if (normal && selected) { normal.style.display = 'none'; selected.style.display = 'block'; }
      });
    }
  }

  window.ytdlpbutton_injectButton = injectInto;
  window.ytdlpbutton_attachButton = attachButton;

  /** Test page: inject into #ytdlpbutton-button-container (replace that div with the button). */
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
