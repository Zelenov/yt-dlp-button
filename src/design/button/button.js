/**
 * YT-DLP button logic for design/v1.html.
 * Expects: window.YTYTDLP_BUTTON_HTML (from button-template.js), #ytytdlp-button-container in DOM.
 */
(function () {
  'use strict';

  var BALLOON_AUTO_HIDE_MS = 8000;
  var CONTAINER_ID = 'ytytdlp-button-container';

  function inject() {
    var container = document.getElementById(CONTAINER_ID);
    var html = window.YTYTDLP_BUTTON_HTML;
    if (!container || !html) return;
    container.innerHTML = html;
    var parent = container.parentNode;
    if (parent) {
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, container);
      }
      parent.removeChild(container);
    }
  }

  if (typeof window.YtDlpCommandBuilder === 'undefined') {
    function YtDlpCommandBuilder() {}
    YtDlpCommandBuilder.startTime = null;
    YtDlpCommandBuilder.endTime = null;
    YtDlpCommandBuilder.prototype.build = function (videoUrl) {
      if (!videoUrl || typeof videoUrl !== 'string') return '';
      var trimmed = videoUrl.trim();
      if (!trimmed) return '';
      var base = 'yt-dlp "' + trimmed + '" --recode-video mp4';
      var start = YtDlpCommandBuilder.startTime && YtDlpCommandBuilder.startTime.formatted;
      var end = YtDlpCommandBuilder.endTime && YtDlpCommandBuilder.endTime.formatted;
      if (start && end) {
        base += ' --download-sections "*' + start + '-' + end + '"';
      }
      return base;
    };
    window.YtDlpCommandBuilder = YtDlpCommandBuilder;
  }

  function getVideoCurrentTime() {
    var video = document.querySelector('video');
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

  function showYtDlpBalloon(message) {
    if (message && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(message).catch(function () {});
    }
    var id = 'ytytdlp-balloon';
    var existing = document.getElementById(id);
    if (existing) existing.remove();
    var balloon = document.createElement('div');
    balloon.id = id;
    var text = document.createElement('div');
    text.id = 'ytytdlp-balloon-text';
    text.textContent = message;
    var closeBtn = document.createElement('button');
    closeBtn.id = 'ytytdlp-balloon-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7';
    balloon.appendChild(text);
    balloon.appendChild(closeBtn);
    document.body.appendChild(balloon);
    requestAnimationFrame(function () { balloon.classList.add('ytytdlp-balloon-visible'); });
    function hide() {
      balloon.classList.remove('ytytdlp-balloon-visible');
      setTimeout(function () {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
      }, 250);
    }
    var timeoutId = setTimeout(hide, BALLOON_AUTO_HIDE_MS);
    closeBtn.addEventListener('click', function () { clearTimeout(timeoutId); hide(); });
  }

  function attachButton() {
    var wrapper = document.getElementById('ytytdlp-button');
    if (!wrapper) return;

    var startBtn = wrapper.querySelector('.yt-spec-button-shape-next--segmented-start');
    var midBtn = wrapper.querySelector('.ytytdlp-segment-mid');
    var endBtn = wrapper.querySelector('.yt-spec-button-shape-next--segmented-end');

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var time = getVideoCurrentTime();
        var labelWithTime = time ? 'Start at ' + time.formatted : 'Start';
        startBtn.setAttribute('aria-label', labelWithTime);
        startBtn.setAttribute('title', labelWithTime);
        var textSpan = startBtn.querySelector('.ytytdlp-duration-text [role="text"]');
        if (textSpan) textSpan.textContent = time ? time.formatted : '';
        if (time && window.YtDlpCommandBuilder) {
          window.YtDlpCommandBuilder.startTime = { seconds: time.seconds, formatted: time.formatted };
        }
        startBtn.classList.add('ytytdlp-selected');
        var normal = startBtn.querySelector('.ytytdlp-icon-normal');
        var selected = startBtn.querySelector('.ytytdlp-icon-selected');
        if (normal && selected) { normal.style.display = 'none'; selected.style.display = 'block'; }
      });
    }

    if (midBtn) {
      midBtn.addEventListener('click', function () {
        var builder = new window.YtDlpCommandBuilder();
        var message = builder.build(window.location.href);
        showYtDlpBalloon(message);
      });
    }

    if (endBtn) {
      endBtn.addEventListener('click', function () {
        var time = getVideoCurrentTime();
        var labelWithTime = time ? 'End at ' + time.formatted : 'End';
        endBtn.setAttribute('aria-label', labelWithTime);
        endBtn.setAttribute('title', labelWithTime);
        var textSpan = endBtn.querySelector('.ytytdlp-duration-text [role="text"]');
        if (textSpan) textSpan.textContent = time ? time.formatted : '';
        if (time && window.YtDlpCommandBuilder) {
          window.YtDlpCommandBuilder.endTime = { seconds: time.seconds, formatted: time.formatted };
        }
        endBtn.classList.add('ytytdlp-selected');
        var normal = endBtn.querySelector('.ytytdlp-icon-normal');
        var selected = endBtn.querySelector('.ytytdlp-icon-selected');
        if (normal && selected) { normal.style.display = 'none'; selected.style.display = 'block'; }
      });
    }
  }

  function run() {
    inject();
    attachButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
