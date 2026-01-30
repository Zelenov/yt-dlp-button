(function () {
  'use strict';

  function injectStyles() {
    if (document.getElementById('ytytdlp-styles')) return;
    const style = document.createElement('style');
    style.id = 'ytytdlp-styles';
    style.textContent = [
      /* Middle segment: flat left and right so it connects to [ and ] */
      '#ytytdlp-button .ytytdlp-segment-mid {',
      '  border-radius: 0;',
      '  margin-left: -1px;',
      '  margin-right: -1px;',
      '  min-width: 6.5em;',
      '  flex-shrink: 0;',
      '}',
      /* In/out segments: same width */
      '#ytytdlp-button .yt-spec-button-shape-next--segmented-start,',
      '#ytytdlp-button .yt-spec-button-shape-next--segmented-end {',
      '  min-width: 40px;',
      '  width: 40px;',
      '  flex-shrink: 0;',
      '}',
      /* Selected state: show selected icon, hide normal */
      '#ytytdlp-button .ytytdlp-selected .ytytdlp-icon-normal { display: none !important; }',
      '#ytytdlp-button .ytytdlp-selected .ytytdlp-icon-selected { display: block !important; }',
      /* YT-DLP command balloon (Watch Later–style snackbar) */
      '#ytytdlp-balloon {',
      '  position: fixed;',
      '  left: 50%;',
      '  bottom: 24px;',
      '  transform: translateX(-50%) translateY(80px);',
      '  z-index: 9999;',
      '  max-width: min(90vw, 560px);',
      '  padding: 12px 16px 12px 16px;',
      '  background: #212121;',
      '  color: #f1f1f1;',
      '  font-family: "Roboto","Arial",sans-serif;',
      '  font-size: 14px;',
      '  line-height: 1.4;',
      '  border-radius: 8px;',
      '  box-shadow: 0 2px 8px rgba(0,0,0,0.4);',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: transform 0.25s ease-out, opacity 0.2s ease-out;',
      '  display: flex;',
      '  align-items: flex-start;',
      '  gap: 12px;',
      '}',
      '#ytytdlp-balloon.ytytdlp-balloon-visible {',
      '  transform: translateX(-50%) translateY(0);',
      '  opacity: 1;',
      '  pointer-events: auto;',
      '}',
      '#ytytdlp-balloon-text {',
      '  flex: 1;',
      '  word-break: break-all;',
      '  font-family: "Roboto Mono", "Consolas", monospace;',
      '  font-size: 13px;',
      '  user-select: all;',
      '}',
      '#ytytdlp-balloon-close {',
      '  flex-shrink: 0;',
      '  width: 24px;',
      '  height: 24px;',
      '  padding: 0;',
      '  border: none;',
      '  background: transparent;',
      '  color: #909090;',
      '  font-size: 18px;',
      '  line-height: 1;',
      '  cursor: pointer;',
      '  border-radius: 4px;',
      '}',
      '#ytytdlp-balloon-close:hover { color: #f1f1f1; background: rgba(255,255,255,0.1); }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  const FLEXIBLE_BUTTONS_SELECTOR = '#flexible-item-buttons';
  const SAVE_BUTTON_TEXT = 'Save';
  const BALLOON_AUTO_HIDE_MS = 8000;

  function showYtDlpBalloon(message) {
    if (message && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(message).catch(function () {});
    }
    var id = 'ytytdlp-balloon';
    var existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
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
    requestAnimationFrame(function () {
      balloon.classList.add('ytytdlp-balloon-visible');
    });
    function hide() {
      balloon.classList.remove('ytytdlp-balloon-visible');
      setTimeout(function () {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
      }, 250);
    }
    var timeoutId = setTimeout(hide, BALLOON_AUTO_HIDE_MS);
    closeBtn.addEventListener('click', function () {
      clearTimeout(timeoutId);
      hide();
    });
  }

  const BASE_BUTTON_CLASSES = [
    'yt-spec-button-shape-next',
    'yt-spec-button-shape-next--tonal',
    'yt-spec-button-shape-next--mono',
    'yt-spec-button-shape-next--size-m',
    'yt-spec-button-shape-next--enable-backdrop-filter-experiment',
    'yt-spec-button-shape-next--enable-drop-shadow-experiment'
  ].join(' ');

  function makeTouchFeedback() {
    const el = document.createElement('yt-touch-feedback-shape');
    el.setAttribute('aria-hidden', 'true');
    el.className = 'yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response';
    el.innerHTML = '<div class="yt-spec-touch-feedback-shape__stroke"></div><div class="yt-spec-touch-feedback-shape__fill"></div>';
    return el;
  }

  /* Path from src/img/duration_in.svg and duration_out.svg (same path, out is rotated 180) */
  const DURATION_ICON_PATH = 'M1.56,29.11c3.94,0,4.5-2.17,4.5-4.11,0-1.56-.22-3.11-.44-4.67s-.44-3.06-.44-4.61c0-5.11,3.33-7.28,8.06-7.28h1.17v3.06h-1c-3.28,0-4.39,1.78-4.39,4.78,0,1.28.17,2.61.39,3.94.22,1.39.39,2.72.39,4.22.06,3.56-1.5,5.33-4,6v.11c2.5.61,4.06,2.5,4,6.06,0,1.5-.17,2.89-.39,4.22-.22,1.39-.39,2.67-.39,4,0,3.11,1.28,4.83,4.39,4.83h1v3.06h-1.17c-4.61,0-8.06-2-8.06-7.61,0-1.5.22-3.06.44-4.56s.44-3,.44-4.5c0-1.72-.56-4.11-4.5-4.11v-2.83Z';
  const ARROW_POLYGON = '0 14.79 13.74 0 13.74 29.59 0 14.79';

  function createDurationIconSvg(rotate180) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 15.78 60.38');
    svg.setAttribute('height', '24');
    svg.setAttribute('width', '24');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'pointer-events:none;display:block;fill:currentColor');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', DURATION_ICON_PATH);
    if (rotate180) {
      path.setAttribute('transform', 'rotate(180 7.89 30.19)');
    }
    svg.appendChild(path);
    return svg;
  }

  function createDurationIconSvgSelected(rotate180) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 64 64');
    svg.setAttribute('height', '24');
    svg.setAttribute('width', '24');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'pointer-events:none;display:block;fill:currentColor');
    svg.classList.add('ytytdlp-icon-selected');
    if (rotate180) {
      const gBracket = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gBracket.setAttribute('transform', 'translate(59.93 62.19) rotate(-180)');
      const pathB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathB.setAttribute('d', DURATION_ICON_PATH);
      gBracket.appendChild(pathB);
      svg.appendChild(gBracket);
      const gArrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gArrow.setAttribute('transform', 'translate(45.09 46.79) rotate(-180)');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', ARROW_POLYGON);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '8.61');
      rect.setAttribute('y', '9.57');
      rect.setAttribute('width', '22.31');
      rect.setAttribute('height', '10.44');
      gArrow.appendChild(poly);
      gArrow.appendChild(rect);
      svg.appendChild(gArrow);
    } else {
      const gBracket = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gBracket.setAttribute('transform', 'translate(5.9 1.81)');
      const pathB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathB.setAttribute('d', DURATION_ICON_PATH);
      gBracket.appendChild(pathB);
      svg.appendChild(gBracket);
      const gArrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gArrow.setAttribute('transform', 'translate(20.74 17.21)');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', ARROW_POLYGON);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '8.61');
      rect.setAttribute('y', '9.57');
      rect.setAttribute('width', '22.31');
      rect.setAttribute('height', '10.44');
      gArrow.appendChild(poly);
      gArrow.appendChild(rect);
      svg.appendChild(gArrow);
    }
    return svg;
  }

  function createSegmentButton(options) {
    const { label, segmentClass, ariaLabel, alertMessage, iconOnly, iconSvg } = options;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = BASE_BUTTON_CLASSES + ' ' + segmentClass;
    if (iconOnly || iconSvg) {
      button.classList.add('yt-spec-button-shape-next--icon-button');
    } else {
      button.classList.add('yt-spec-button-shape-next--icon-leading');
    }
    button.setAttribute('title', ariaLabel);
    button.setAttribute('aria-label', ariaLabel);

    if (iconSvg === 'duration_in' || iconSvg === 'duration_out') {
      const isOut = iconSvg === 'duration_out';
      const iconDiv = document.createElement('div');
      iconDiv.setAttribute('aria-hidden', 'true');
      iconDiv.className = 'yt-spec-button-shape-next__icon';
      const span = document.createElement('span');
      span.className = 'ytIconWrapperHost';
      span.style.cssText = 'width:24px;height:24px;position:relative';
      const iconShape = document.createElement('span');
      iconShape.className = 'yt-icon-shape ytSpecIconShapeHost';
      iconShape.style.cssText = 'width:100%;height:100%;display:block';
      const iconInner = document.createElement('div');
      iconInner.style.cssText = 'width:100%;height:100%;display:block;fill:currentcolor;position:relative';
      const svgNormal = createDurationIconSvg(isOut);
      svgNormal.classList.add('ytytdlp-icon-normal');
      const svgSelected = createDurationIconSvgSelected(isOut);
      svgSelected.style.display = 'none';
      iconInner.appendChild(svgNormal);
      iconInner.appendChild(svgSelected);
      iconShape.appendChild(iconInner);
      span.appendChild(iconShape);
      iconDiv.appendChild(span);
      button.appendChild(iconDiv);
    } else {
      const textContent = document.createElement('div');
      textContent.className = 'yt-spec-button-shape-next__button-text-content';
      const span = document.createElement('span');
      span.className = 'yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap';
      span.setAttribute('role', 'text');
      span.textContent = label;
      textContent.appendChild(span);
      button.appendChild(textContent);
    }
    button.appendChild(makeTouchFeedback());

    button.addEventListener('click', function () {
      if (iconSvg === 'duration_in' || iconSvg === 'duration_out') {
        button.classList.toggle('ytytdlp-selected');
        const normal = button.querySelector('.ytytdlp-icon-normal');
        const selected = button.querySelector('.ytytdlp-icon-selected');
        if (normal && selected) {
          const isSelected = button.classList.contains('ytytdlp-selected');
          normal.style.display = isSelected ? 'none' : 'block';
          selected.style.display = isSelected ? 'block' : 'none';
        }
      } else {
        var message = typeof alertMessage === 'function' ? alertMessage() : alertMessage;
        showYtDlpBalloon(message);
      }
    });

    return button;
  }

  function createYtDlpSegmentedButton() {
    const wrapper = document.createElement('yt-button-view-model');
    wrapper.className = 'ytd-menu-renderer';

    const segmentedWrapper = document.createElement('div');
    segmentedWrapper.className = 'ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper style-scope ytd-menu-renderer';
    segmentedWrapper.style.display = 'flex';

    const startButton = createSegmentButton({
      segmentClass: 'yt-spec-button-shape-next--segmented-start',
      ariaLabel: 'Start',
      alertMessage: 'Start',
      iconSvg: 'duration_in'
    });

    const midButton = createSegmentButton({
      label: 'YT-DLP',
      segmentClass: 'ytytdlp-segment-mid',
      ariaLabel: 'YT-DLP',
      alertMessage: function () {
        var builder = new window.YtDlpCommandBuilder();
        return builder.build(window.location.href);
      },
      iconOnly: false
    });

    const endButton = createSegmentButton({
      segmentClass: 'yt-spec-button-shape-next--segmented-end',
      ariaLabel: 'End',
      alertMessage: 'End',
      iconSvg: 'duration_out'
    });

    segmentedWrapper.appendChild(startButton);
    segmentedWrapper.appendChild(midButton);
    segmentedWrapper.appendChild(endButton);
    wrapper.appendChild(segmentedWrapper);
    return wrapper;
  }

  function injectButton() {
    const container = document.querySelector(FLEXIBLE_BUTTONS_SELECTOR);
    if (!container) return false;

    const saveWrapper = Array.from(container.querySelectorAll('yt-button-view-model')).find(function (el) {
      const textEl = el.querySelector('.yt-spec-button-shape-next__button-text-content');
      return textEl && textEl.textContent.trim() === SAVE_BUTTON_TEXT;
    });

    const ytDlpId = 'ytytdlp-button';
    if (document.getElementById(ytDlpId)) return true;

    injectStyles();
    const ytDlpButton = createYtDlpSegmentedButton();
    ytDlpButton.id = ytDlpId;

    if (saveWrapper && saveWrapper.nextSibling) {
      container.insertBefore(ytDlpButton, saveWrapper.nextSibling);
    } else {
      container.appendChild(ytDlpButton);
    }
    return true;
  }

  function tryInject() {
    if (injectButton()) return;
    setTimeout(tryInject, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInject);
  } else {
    tryInject();
  }

  const observer = new MutationObserver(function () {
    if (!document.getElementById('ytytdlp-button')) {
      injectButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
