# OnionReel Automated QC Spec v1

## Purpose
The purpose of the OnionReel Automated QC is to implement automated checks that prevent bad exports and enforce repeatability in the content production workflow. This ensures that all media outputs meet predefined quality standards before distribution.

## Inputs
- Exports (video files)
- Metadata (title, description, tags)
- Captions (SRT files)
- Audio stems (individual audio tracks)
- Timeline markers (edit points, cues)

## QC Checks
1. **File Sanity**
   - Check codec/container compatibility.
   - Validate duration against expected length.
   - Verify resolution and aspect ratio.
   - Confirm frames per second (fps) consistency.

2. **Audio Sanity**
   - Measure peak and RMS loudness against defined bounds.
   - Detect any clipping in audio tracks.
   - Identify silence gaps exceeding acceptable duration.

3. **Visual Sanity**
   - Scan for black frames exceeding a defined threshold.
   - Detect frozen frames and abrupt cuts.
   - Ensure presence of end-card and validate its visibility.

4. **Captions Sanity**
   - Check for SRT file presence.
   - Validate that timecodes are monotonic.
   - Enforce maximum character limits per line.

5. **Branding Sanity**
   - Verify logo placement within safe area.
   - Confirm end-card presence and adherence to branding guidelines.

6. **Platform Rules**
   - Ensure TikTok safe margins are respected.
   - Validate Meta length constraints for video duration.

## Scoring + Thresholds
- **Pass**: All checks meet defined criteria.
- **Warn**: Minor issues detected; does not impede functionality.
- **Fail**: Major issues detected; requires immediate attention.

## Output Artifact
- **QCResult Schema**: Structured data containing results of all checks.
- **Human-readable Report**: Summary of findings, including detailed notes on any warnings or failures.

## QC Integration
- QC checks are integrated into the Job Runner, triggering automatically upon export completion.
- Results are stored in the Artifact Store for easy retrieval and review.

## Failure Modes + Actions
- **File Sanity Fail**: Notify user to re-export with corrected settings.
- **Audio Sanity Fail**: Alert user to adjust audio levels or reprocess audio stems.
- **Visual Sanity Fail**: Prompt user to review and edit the visual content.
- **Captions Sanity Fail**: Request user to correct SRT file issues.
- **Branding Sanity Fail**: Notify user to adjust branding elements.
- **Platform Rules Fail**: Advise user to modify content to comply with platform requirements.

## Acceptance Criteria for “Automated QC v1 Complete”
- All specified QC checks are implemented and functional.
- Output artifacts are generated correctly and stored in the Artifact Store.
- Integration with Job Runner is seamless and triggers appropriately.
- Clear documentation is provided for users regarding QC results and actions.
- System is tested with various media types to ensure robustness and reliability.
