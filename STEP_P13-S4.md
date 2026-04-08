# OnionReel v1 Artifact: P13-S4 - Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, along with encoding settings presets. The goal is to ensure efficient rendering and consistent quality across different video lengths.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV).
- **Remotion Project**: Pre-configured Remotion project files.
- **Encoding Settings**: Preset configurations for different resolutions and bitrates.
- **Variant Specifications**:
  - 30 seconds
  - 15 seconds
  - 6 seconds

## Outputs
- **Rendered Videos**: 
  - `output_30s.mp4`
  - `output_15s.mp4`
  - `output_6s.mp4`
- **Log Files**: Render logs for each variant.
- **Error Reports**: Any issues encountered during rendering.

## Steps
1. **Setup Environment**:
   - Ensure Node.js and Remotion are installed.
   - Clone the OnionReel repository and navigate to the Remotion project directory.

2. **Configure Encoding Settings**:
   - Create or update encoding presets in the Remotion configuration file.
   - Define output formats and resolutions for each variant.

3. **Render Variants**:
   - Execute the Remotion CLI command for each variant:
     ```bash
     npx remotion render <video-component> output_30s.mp4 --props '{ "duration": 30 }'
     npx remotion render <video-component> output_15s.mp4 --props '{ "duration": 15 }'
     npx remotion render <video-component> output_6s.mp4 --props '{ "duration": 6 }'
     ```

4. **Log Outputs**:
   - Capture logs during rendering for debugging and verification.
   - Save logs in a designated logs directory.

5. **Verify Outputs**:
   - Check rendered video files for quality and completeness.
   - Ensure logs and error reports are generated and reviewed.

## Pitfalls
- **Rendering Failures**: Ensure all dependencies are up-to-date and the environment is correctly configured to avoid runtime errors.
- **Quality Control**: Validate that each variant meets quality standards; consider implementing automated checks.
- **Performance Issues**: Rendering may be resource-intensive; monitor system performance and adjust settings as necessary.
- **Encoding Settings**: Incorrect presets can lead to subpar video quality; double-check configurations before rendering.

By following this roadmap, OnionReel will effectively render video variants using Remotion, ensuring a streamlined workflow and high-quality outputs.
