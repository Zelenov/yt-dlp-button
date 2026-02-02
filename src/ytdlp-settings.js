/**
 * Single place for reading and writing extension settings (chrome.storage.local).
 * Settings are a single object (class shape) that can be extended per site.
 * Currently: { youtube: { additionalArgs: string } }. Other sites (e.g. vimeo) can add their own properties later.
 * Exposes: window.YtdlpSettings.getSettings(), window.YtdlpSettings.saveSettings(settings).
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'ytdlpbutton_settings';

  /**
   * Default settings shape. Add more site keys here when expanding.
   * @returns {{ youtube: { additionalArgs: string } }}
   */
  function defaultSettings() {
    return {
      youtube: { additionalArgs: '' }
    };
  }

  /**
   * Get the stored settings object. Resolves with the full class shape; missing keys are filled from defaults.
   * @returns {Promise<{ youtube: { additionalArgs: string } }>}
   */
  function getSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise(function (resolve) {
        chrome.storage.local.get([STORAGE_KEY], function (data) {
          var stored = data[STORAGE_KEY];
          var defaults = defaultSettings();
          if (stored && typeof stored === 'object' && stored.youtube && typeof stored.youtube === 'object') {
            defaults.youtube.additionalArgs = stored.youtube.additionalArgs != null ? String(stored.youtube.additionalArgs) : '';
          }
          resolve(defaults);
        });
      });
    }
    return Promise.resolve(defaultSettings());
  }

  /**
   * Save the settings object. Merges with existing so partial updates are safe.
   * @param {{ youtube?: { additionalArgs?: string } }} settings - At least the keys you want to update.
   * @returns {Promise<void>}
   */
  function saveSettings(settings) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise(function (resolve) {
        chrome.storage.local.get([STORAGE_KEY], function (data) {
          var current = data[STORAGE_KEY] && typeof data[STORAGE_KEY] === 'object' ? data[STORAGE_KEY] : defaultSettings();
          if (settings && settings.youtube && typeof settings.youtube === 'object') {
            if (settings.youtube.additionalArgs != null) {
              current.youtube = current.youtube || { additionalArgs: '' };
              current.youtube.additionalArgs = String(settings.youtube.additionalArgs).trim();
            }
          }
          var toSet = {};
          toSet[STORAGE_KEY] = current;
          chrome.storage.local.set(toSet, resolve);
        });
      });
    }
    return Promise.resolve();
  }

  global.YtdlpSettings = {
    getSettings: getSettings,
    saveSettings: saveSettings,
    defaultSettings: defaultSettings
  };
})(typeof window !== 'undefined' ? window : this);
