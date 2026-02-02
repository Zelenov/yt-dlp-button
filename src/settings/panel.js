/**
 * Settings panel for yt-dlp-button.
 * Uses window.YtdlpSettings (ytdlp-settings.js) for get/save; only wires the form and public loadSettings.
 */

(function () {
	'use strict';

	var input = null;

	function getInput() {
		if (!input) {
			input = document.getElementById('additionalArgsInput');
		}
		return input;
	}

	/**
	 * Load settings into the form from storage (via YtdlpSettings).
	 * Public API: call window.loadSettings() (returns Promise).
	 */
	async function loadSettings() {
		var el = getInput();
		if (!el) return;
		if (typeof window.YtdlpSettings !== 'undefined' && typeof window.YtdlpSettings.getSettings === 'function') {
			var s = await window.YtdlpSettings.getSettings();
			el.value = (s.youtube && s.youtube.additionalArgs != null) ? s.youtube.additionalArgs : '';
		} else {
			el.value = '';
		}
	}

	async function saveSettings() {
		var el = getInput();
		if (!el || typeof window.YtdlpSettings === 'undefined' || typeof window.YtdlpSettings.saveSettings !== 'function') return;
		var s = await window.YtdlpSettings.getSettings();
		s.youtube = s.youtube || {};
		s.youtube.additionalArgs = (el.value || '').trim();
		await window.YtdlpSettings.saveSettings(s);
		var status = document.getElementById('saveStatus');
		if (status) {
			status.textContent = 'Options saved.';
			window.setTimeout(function () { status.textContent = ''; }, 1500);
		}
	}

	window.loadSettings = loadSettings;

	function init() {
		loadSettings();
		var saveBtn = document.getElementById('saveButton');
		if (saveBtn) saveBtn.addEventListener('click', saveSettings);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
