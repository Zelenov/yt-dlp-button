(function (global) {
  'use strict';

  /**
   * Builds yt-dlp command-line strings. No UI; used by content script.
   * Start/end times are set on the class when In/Out buttons are pressed.
   */
  function YtDlpCommandBuilder() {}

  /** @type {{ seconds: number, formatted: string } | null} Set when In button is pressed. */
  YtDlpCommandBuilder.startTime = null;
  /** @type {{ seconds: number, formatted: string } | null} Set when Out button is pressed. */
  YtDlpCommandBuilder.endTime = null;

  /**
   * Builds the yt-dlp command for the given video URL.
   * Uses YtDlpCommandBuilder.startTime and YtDlpCommandBuilder.endTime if set.
   * @param {string} videoUrl - Full YouTube watch URL (e.g. https://www.youtube.com/watch?v=...)
   * @returns {string} Command in form: yt-dlp "URL" --recode-video mp4 [--download-sections "*start-end"]
   */
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

  global.YtDlpCommandBuilder = YtDlpCommandBuilder;
})(typeof window !== 'undefined' ? window : this);
