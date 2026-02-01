/**
 * yt-dlp button logic. Used by design/v1.html and by content.js (extension).
 * Expects: window.ytytdlp_button_html (from button-template.js).
 * In HTML: #ytytdlp-button-container in DOM for inject(). In extension: content.js injects the node and calls ytytdlp_attachButton().
 */
(function () {
  'use strict';

  var CONTAINER_ID = 'ytytdlp-button-container';

  function inject() {
    var container = document.getElementById(CONTAINER_ID);
    var html = window.ytytdlp_button_html;
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

  if (typeof window.YtdlpCommandBuilder === 'undefined') {
    function YtdlpCommandBuilder() {}
    YtdlpCommandBuilder.startTime = null;
    YtdlpCommandBuilder.endTime = null;
    YtdlpCommandBuilder.prototype.build = function (videoUrl) {
      if (!videoUrl || typeof videoUrl !== 'string') return '';
      var trimmed = videoUrl.trim();
      if (!trimmed) return '';
      var base = 'yt-dlp "' + trimmed + '" --recode-video mp4';
      var start = YtdlpCommandBuilder.startTime && YtdlpCommandBuilder.startTime.formatted;
      var end = YtdlpCommandBuilder.endTime && YtdlpCommandBuilder.endTime.formatted;
      if (start && end) {
        base += ' --download-sections "*' + start + '-' + end + '"';
      }
      return base;
    };
    window.YtdlpCommandBuilder = YtdlpCommandBuilder;
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
        var message = builder.build(window.location.href);
        if (typeof window.ytytdlp_showBalloon === 'function') {
          window.ytytdlp_showBalloon(message);
        }
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

  function run() {
    var container = document.getElementById(CONTAINER_ID);
    if (container) inject();
    if (document.getElementById('ytytdlp-button')) attachButton();
  }

  window.ytytdlp_attachButton = attachButton;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
