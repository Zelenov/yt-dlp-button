(function (global) {
  'use strict';

  /**
   * Builds yt-dlp command-line strings. No UI; shared by all sites (YouTube, etc.).
   * Start/end times are set on the class when In/Out buttons are pressed.
   */
  function YtdlpCommandBuilder() {}

  /** @type {{ seconds: number, formatted: string } | null} Set when In button is pressed. */
  YtdlpCommandBuilder.startTime = null;
  /** @type {{ seconds: number, formatted: string } | null} Set when Out button is pressed. */
  YtdlpCommandBuilder.endTime = null;

  /**
   * Builds the full yt-dlp command for the given video URL and optional additional arguments.
   * Uses YtdlpCommandBuilder.startTime and YtdlpCommandBuilder.endTime if set.
   * Does not fetch anything; caller (e.g. site-specific code) provides additionalArgs.
   * @param {string} videoUrl - Full video watch URL (e.g. https://www.youtube.com/watch?v=...)
   * @param {string} [additionalArgs] - Optional extra CLI args (e.g. from settings); appended as-is (trimmed).
   * @returns {string} Full command string, or '' if invalid URL.
   */
  YtdlpCommandBuilder.prototype.build = function (videoUrl, additionalArgs) {
    if (!videoUrl || typeof videoUrl !== 'string') return '';
    var trimmed = videoUrl.trim();
    if (!trimmed) return '';
    var base = 'yt-dlp "' + trimmed + '"';
    var start = YtdlpCommandBuilder.startTime && YtdlpCommandBuilder.startTime.formatted;
    var end = YtdlpCommandBuilder.endTime && YtdlpCommandBuilder.endTime.formatted;
    if (start && end) {
      base += ' --download-sections "*' + start + '-' + end + '"';
    }
    if (additionalArgs != null && typeof additionalArgs === 'string') {
      var extraTrimmed = additionalArgs.trim();
      if (extraTrimmed) base += ' ' + extraTrimmed;
    }
    return base;
  };

  /**
   * Builds the command for the given video URL and additional args, copies it to the clipboard, and shows the balloon.
   * Caller (site-specific code) is responsible for providing videoUrl and additionalArgs.
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
