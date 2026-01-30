(function (global) {
  'use strict';

  /**
   * Builds yt-dlp command-line strings. No UI; used by content script.
   */
  function YtDlpCommandBuilder() {}

  /**
   * Builds the yt-dlp command for the given video URL.
   * @param {string} videoUrl - Full YouTube watch URL (e.g. https://www.youtube.com/watch?v=...)
   * @returns {string} Command in form: yt-dlp "URL" --recode-video mp4
   */
  YtDlpCommandBuilder.prototype.build = function (videoUrl) {
    if (!videoUrl || typeof videoUrl !== 'string') return '';
    var trimmed = videoUrl.trim();
    if (!trimmed) return '';
    return 'yt-dlp "' + trimmed + '" --recode-video mp4';
  };

  global.YtDlpCommandBuilder = YtDlpCommandBuilder;
})(typeof window !== 'undefined' ? window : this);
