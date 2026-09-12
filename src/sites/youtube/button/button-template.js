/**
 * yt-dlp button HTML template. Edit this string to change the injected markup.
 *
 * Class names: YouTube renamed its button-shape classes from kebab-case
 * (yt-spec-button-shape-next--tonal) to camelCase (ytSpecButtonShapeNextTonal) in 2026-09.
 * We keep BOTH spellings so the button is styled on either build; unknown classes are inert.
 * Our own hooks (ytdlpbutton-*) are what button.js / button.css rely on.
 */
(function () {
  'use strict';
  window.ytdlpbutton_button_html = `
<yt-button-view-model class="ytd-menu-renderer" id="ytdlpbutton-button">
  <div class="ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper style-scope ytd-menu-renderer">
    <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-start ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextEnableBackdropFilterExperiment ytSpecButtonShapeNextIconLeading ytSpecButtonShapeNextSegmentedStart ytdlpbutton-segment-start" title="Start" aria-label="Start">
      <div aria-hidden="true" class="yt-spec-button-shape-next__icon ytSpecButtonShapeNextIcon ytdlpbutton-icon">
        <span class="ytIconWrapperHost">
          <span class="yt-icon-shape ytSpecIconShapeHost ytdlpbutton-icon-shape">
            <div>
              <img class="ytdlpbutton-icon-normal" src="sites/youtube/button/duration_in.svg" width="6" height="24" alt="" aria-hidden="true">
              <img class="ytdlpbutton-icon-selected" src="sites/youtube/button/duration_in.selected.svg" width="24" height="24" alt="" aria-hidden="true">
            </div>
          </span>
        </span>
      </div>
      <div class="yt-spec-button-shape-next__button-text-content ytSpecButtonShapeNextButtonTextContent ytdlpbutton-duration-text">
        <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text"></span>
      </div>
      <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response ytSpecTouchFeedbackShapeHost ytSpecTouchFeedbackShapeTouchResponse"></yt-touch-feedback-shape>
    </button>
    <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment yt-spec-button-shape-next--icon-leading ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextEnableBackdropFilterExperiment ytSpecButtonShapeNextIconLeading ytdlpbutton-segment-mid" title="yt-dlp" aria-label="yt-dlp">
      <div class="yt-spec-button-shape-next__button-text-content ytSpecButtonShapeNextButtonTextContent">
        <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">yt-dlp</span>
      </div>
      <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response ytSpecTouchFeedbackShapeHost ytSpecTouchFeedbackShapeTouchResponse"></yt-touch-feedback-shape>
    </button>
    <button type="button" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment yt-spec-button-shape-next--enable-drop-shadow-experiment yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-end ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextEnableBackdropFilterExperiment ytSpecButtonShapeNextIconLeading ytSpecButtonShapeNextSegmentedEnd ytdlpbutton-segment-end" title="End" aria-label="End">
      <div class="yt-spec-button-shape-next__button-text-content ytSpecButtonShapeNextButtonTextContent ytdlpbutton-duration-text">
        <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text"></span>
      </div>
      <div aria-hidden="true" class="yt-spec-button-shape-next__icon ytSpecButtonShapeNextIcon ytdlpbutton-icon">
        <span class="ytIconWrapperHost">
          <span class="yt-icon-shape ytSpecIconShapeHost ytdlpbutton-icon-shape">
            <div>
              <img class="ytdlpbutton-icon-normal" src="sites/youtube/button/duration_out.svg" width="6" height="24" alt="" aria-hidden="true">
              <img class="ytdlpbutton-icon-selected" src="sites/youtube/button/duration_out.selected.svg" width="24" height="24" alt="" aria-hidden="true">
            </div>
          </span>
        </span>
      </div>
      <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response ytSpecTouchFeedbackShapeHost ytSpecTouchFeedbackShapeTouchResponse"></yt-touch-feedback-shape>
    </button>
  </div>
</yt-button-view-model>`;
})();
