# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, along with the necessary encoding settings presets. This will streamline video production and ensure consistent quality across different formats.

## Inputs
- **Video Source Files**: Original video files to be rendered.
- **Remotion Project**: Pre-configured Remotion project with templates for 30s, 15s, and 6s variants.
- **Encoding Settings**: Preset configurations for video encoding (resolution, bitrate, codec, etc.).

## Outputs
- **Rendered Video Variants**:
  - `video_30s.mp4`
  - `video_15s.mp4`
  - `video_6s.mp4`
- **Log Files**: Render logs for debugging and verification.

## Steps
1. **Setup Remotion Environment**:
   - Ensure Remotion is installed and configured in your development environment.
   - Load the Remotion project containing the video templates.

2. **Configure Encoding Settings**:
   - Define encoding presets for each variant:
     - **30s**: High resolution, standard bitrate.
     - **15s**: Medium resolution, optimized bitrate.
     - **6s**: Low resolution, minimal bitrate for quick loading.

3. **Render Video Variants**:
   - Execute the Remotion rendering command for each variant:
     ```bash
     npx remotion render <ProjectName> <CompositionName> video_30s.mp4 --codec h264 --preset <preset_30s>
     npx remotion render <ProjectName> <CompositionName> video_15s.mp4 --codec h264 --preset <preset_15s>
     npx remotion render <ProjectName> <CompositionName> video_6s.mp4 --codec h264 --preset <preset_6s>
     ```

4. **Verify Outputs**:
   - Check the output directory for the rendered video files.
   - Review log files for any errors or warnings during rendering.

5. **Quality Assurance**:
   - Play each variant to ensure quality meets standards.
   - Confirm that all encoding settings were applied correctly.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure presets are correctly defined to avoid quality loss.
- **Remotion Configuration Issues**: Verify that the Remotion project is properly set up before rendering.
- **Resource Limitations**: Be aware of system resource constraints that may affect rendering times.
- **File Naming Conflicts**: Ensure unique file names to avoid overwriting previous outputs.

This artifact serves as a concise guide for implementing the rendering of video variants using Remotion, ensuring a smooth and efficient workflow.
