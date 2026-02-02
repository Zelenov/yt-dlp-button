(function (global) {
  'use strict';

  /**
   * Builds yt-dlp command-line strings. No UI; shared by all sites (YouTube, etc.).
   * Start/end times are set on the class when In/Out buttons are pressed.
   */
  function YtdlpCommandBuilder() {}

  /** @type {number | null} Start time in seconds. Set when In button is pressed. */
  YtdlpCommandBuilder.startTime = null;
  /** @type {number | null} End time in seconds. Set when Out button is pressed. */
  YtdlpCommandBuilder.endTime = null;

  /** Formats seconds as M:SS or H:MM:SS for yt-dlp --download-sections. */
  function formatSectionTime(seconds) {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return null;
    var s = Math.floor(seconds % 60);
    var m = Math.floor((seconds % 3600) / 60);
    var h = Math.floor(seconds / 3600);
    return h > 0
      ? h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
      : m + ':' + String(s).padStart(2, '0');
  }

  /**
   * Builds the full yt-dlp command for the given video URL and optional additional arguments.
   * Uses YtdlpCommandBuilder.startTime and YtdlpCommandBuilder.endTime (seconds) if set.
   * @param {string} videoUrl - Full video watch URL (e.g. https://www.youtube.com/watch?v=...)
   * @param {string} [additionalArgs] - Optional extra CLI args (e.g. from settings); appended as-is (trimmed).
   * @returns {string} Full command string, or '' if invalid URL.
   */
  YtdlpCommandBuilder.prototype.build = function (videoUrl, additionalArgs) {
    if (!videoUrl || typeof videoUrl !== 'string') return '';
    var trimmed = videoUrl.trim();
    if (!trimmed) return '';
    var base = 'yt-dlp "' + trimmed + '"';
    var start = formatSectionTime(YtdlpCommandBuilder.startTime);
    var end = formatSectionTime(YtdlpCommandBuilder.endTime);
    if (start || end) {
      var section = start && end ? start + '-' + end : start ? start + '-inf' : '00:00-' + end;
      base += ' --download-sections "*' + section + '"';
    }
    if (additionalArgs != null && typeof additionalArgs === 'string') {
      var extraTrimmed = additionalArgs.trim();
      if (extraTrimmed) base += ' ' + extraTrimmed;
    }
    return base;
  };

  /**
   * Builds the command for the given video URL and additional args, copies it to the clipboard, and shows the balloon.
   * Uses YtdlpCommandBuilder.startTime and YtdlpCommandBuilder.endTime (set when In/Out are pressed).
   * @param {string} videoUrl - Full video watch URL (e.g. https://www.youtube.com/watch?v=...)
   * @param {string} [additionalArgs] - Optional extra CLI args (e.g. from YouTube settings).
   */
  YtdlpCommandBuilder.run = function (videoUrl, additionalArgs) {
    var builder = new YtdlpCommandBuilder();
    var command = builder.build(videoUrl, additionalArgs);
    if (!command) return;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(command).catch(function () {});
    }
    if (typeof global.ytdlpbutton_showBalloon === 'function') {
      global.ytdlpbutton_showBalloon(command);
    }
  };

  global.YtdlpCommandBuilder = YtdlpCommandBuilder;
})(typeof window !== 'undefined' ? window : this);
