/**
 * yt-dlp button HTML template. Edit this string to change the injected markup.
 */
(function () {
  'use strict';
  window.ytytdlp_button_html = `
<yt-button-view-model class="ytd-menu-renderer" id="ytytdlp-button">
  <div class="ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper style-scope ytd-menu-renderer">
    <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-start" title="Start" aria-label="Start">
      <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
        <span class="ytIconWrapperHost">
          <span class="yt-icon-shape ytSpecIconShapeHost">
            <div>
              <img class="ytytdlp-icon-normal" src="../src/button/duration_in.svg" width="6" height="24" alt="" aria-hidden="true">
              <img class="ytytdlp-icon-selected" src="../src/button/duration_in.selected.svg" width="24" height="24" alt="" aria-hidden="true">
            </div>
          </span>
        </span>
      </div>
      <div class="yt-spec-button-shape-next__button-text-content ytytdlp-duration-text">
        <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text"></span>
      </div>
      <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response"></yt-touch-feedback-shape>
    </button>
    <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment yt-spec-button-shape-next--icon-leading ytytdlp-segment-mid" title="yt-dlp" aria-label="yt-dlp">
      <div class="yt-spec-button-shape-next__button-text-content">
        <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">yt-dlp</span>
      </div>
      <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response"></yt-touch-feedback-shape>
    </button>
    <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-end" title="End" aria-label="End">
      <div class="yt-spec-button-shape-next__button-text-content ytytdlp-duration-text">
        <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text"></span>
      </div>
      <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
        <span class="ytIconWrapperHost">
          <span class="yt-icon-shape ytSpecIconShapeHost">
            <div>
              <img class="ytytdlp-icon-normal" src="../src/button/duration_out.svg" width="6" height="24" alt="" aria-hidden="true">
              <img class="ytytdlp-icon-selected" src="../src/button/duration_out.selected.svg" width="24" height="24" alt="" aria-hidden="true">
            </div>
          </span>
        </span>
      </div>
      <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response"></yt-touch-feedback-shape>
    </button>
  </div>
</yt-button-view-model>`;
})();
