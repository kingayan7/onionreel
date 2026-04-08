# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants at 30fps, 15fps, and 6fps using Remotion, along with encoding settings presets. The goal is to provide a streamlined approach for generating multiple video outputs efficiently.

## Inputs
- **Video Source**: Original video file (e.g., .mp4, .mov)
- **Remotion Project**: Pre-configured Remotion setup with necessary components
- **Encoding Settings**: Preset configurations for each frame rate variant
  - 30fps: High quality, standard bitrate
  - 15fps: Medium quality, lower bitrate
  - 6fps: Low quality, minimal bitrate

## Outputs
- **Rendered Videos**: Three output files for each frame rate:
  - `output_30fps.mp4`
  - `output_15fps.mp4`
  - `output_6fps.mp4`
- **Log File**: Summary of the rendering process and any errors encountered

## Steps
1. **Setup Remotion Environment**:
   - Ensure that Remotion is installed and configured correctly.
   - Verify the video source is accessible.

2. **Configure Encoding Settings**:
   - Define encoding presets for each frame rate in the Remotion configuration file.
   - Example presets:
     ```json
     {
       "30fps": { "bitrate": "5000k", "preset": "medium" },
       "15fps": { "bitrate": "2500k", "preset": "low" },
       "6fps": { "bitrate": "1000k", "preset": "veryfast" }
     }
     ```

3. **Render Videos**:
   - Execute Remotion commands to render each video variant:
     ```bash
     npx remotion render MyVideo 30fps output_30fps.mp4
     npx remotion render MyVideo 15fps output_15fps.mp4
     npx remotion render MyVideo 6fps output_6fps.mp4
     ```

4. **Verify Outputs**:
   - Check the output files for successful rendering.
   - Review the log file for any errors or warnings.

5. **Finalize and Document**:
   - Document the process, including any adjustments made during rendering.
   - Store the output files in the designated directory.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure that the encoding settings are compatible with Remotion and the target output format.
- **Performance Issues**: Rendering at lower frame rates may still require significant processing power; monitor system resources.
- **File Path Errors**: Verify that all file paths are correct to avoid issues during rendering.
- **Version Compatibility**: Ensure that the Remotion version used is compatible with the latest features and encoding settings.

By following these steps, the rendering of video variants using Remotion should be efficient and effective, providing high-quality outputs tailored to different use cases.
