# OnionReel v1 Artifact: QC for Rendered Video

## Overview
This document outlines the quality control (QC) process for rendered video in OnionReel, focusing on verifying duration, resolution, black frames, and basic loudness. Additionally, it includes the export pack configurations for 30, 15, and 6-second clips.

## Inputs
- Rendered video files (various formats)
- Specifications for duration and resolution
- Loudness standards (e.g., -23 LUFS for broadcast)
- QC tools (e.g., FFmpeg, Loudness Penalty Calculator)

## Outputs
- QC report detailing:
  - Duration compliance
  - Resolution compliance
  - Number and duration of black frames
  - Loudness levels
- Export packs for:
  - 30-second clips
  - 15-second clips
  - 6-second clips

## Steps
1. **Duration Check**: 
   - Use a video analysis tool to verify the video duration matches specifications.
  
2. **Resolution Check**: 
   - Confirm the video resolution (e.g., 1920x1080) against project requirements.

3. **Black Frame Detection**: 
   - Analyze the video for black frames using a script or tool (e.g., FFmpeg) to identify any frames that are completely black.
   - Document the number and duration of detected black frames.

4. **Loudness Measurement**: 
   - Measure the loudness of the audio track using a loudness meter.
   - Ensure levels are within specified standards (e.g., -23 LUFS).

5. **Generate QC Report**: 
   - Compile findings into a structured QC report.

6. **Export Clips**: 
   - Use the video editing tool to create export packs for 30s, 15s, and 6s clips, ensuring they adhere to the same QC standards.

## Pitfalls
- **Inconsistent Formats**: Ensure all rendered videos are in compatible formats for analysis.
- **Incorrect Tool Usage**: Familiarize yourself with the QC tools to avoid misinterpretation of results.
- **Overlooking Black Frames**: Automated detection may miss subtle black frames; manual review is recommended.
- **Loudness Miscalculations**: Double-check loudness settings to avoid compliance issues.
- **Export Settings**: Verify export settings to ensure clips maintain quality and specifications.

By following this roadmap step, we can ensure that the rendered videos meet quality standards and are ready for distribution.
