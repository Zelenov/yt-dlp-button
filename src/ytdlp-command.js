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
   * Builds the yt-dlp command for the given video URL.
   * Uses YtdlpCommandBuilder.startTime and YtdlpCommandBuilder.endTime if set.
   * @param {string} videoUrl - Full video watch URL (e.g. https://www.youtube.com/watch?v=...)
   * @returns {string} Command in form: yt-dlp "URL" --recode-video mp4 [--download-sections "*start-end"]
   */
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

  global.YtdlpCommandBuilder = YtdlpCommandBuilder;
})(typeof window !== 'undefined' ? window : this);
