# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the implementation of rendering video variants at 30fps, 15fps, and 6fps using Remotion. It includes encoding settings presets to ensure optimal output quality and performance.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV).
- **Remotion Configuration**: Project setup with necessary components.
- **Encoding Settings**: Preset configurations for each frame rate variant.

## Outputs
- **Rendered Videos**: 
  - `output_30fps.mp4`
  - `output_15fps.mp4`
  - `output_6fps.mp4`
- **Encoding Logs**: Logs for each rendering process for troubleshooting.

## Steps
1. **Set Up Remotion Project**:
   - Initialize a new Remotion project if not already done.
   - Install necessary dependencies (e.g., `remotion`).

2. **Create Video Variants**:
   - Define video rendering functions for each frame rate in the Remotion project.
   - Use Remotion's `Video` component to specify the source and frame rate.

3. **Configure Encoding Settings**:
   - Create presets for encoding settings:
     - **30fps**: High quality, standard bitrate.
     - **15fps**: Medium quality, reduced bitrate.
     - **6fps**: Low quality, minimal bitrate.
   - Implement encoding settings in the rendering functions.

4. **Render Videos**:
   - Execute rendering commands for each variant using Remotion's CLI:
     ```bash
     npx remotion render src/Video.tsx output_30fps.mp4 --fps 30
     npx remotion render src/Video.tsx output_15fps.mp4 --fps 15
     npx remotion render src/Video.tsx output_6fps.mp4 --fps 6
     ```

5. **Verify Outputs**:
   - Check the output files and logs for successful rendering and encoding.

## Pitfalls
- **Performance Issues**: Rendering at lower frame rates may lead to unexpected visual artifacts; ensure proper testing.
- **Encoding Errors**: Incorrect settings may result in failed encodings; validate presets before execution.
- **Dependency Conflicts**: Ensure all dependencies are compatible with the current version of Remotion.
- **File Format Compatibility**: Verify that the input video format is supported by Remotion to avoid runtime errors.

This artifact serves as a concise guide to implementing the rendering of video variants using Remotion, ensuring a smooth development process and high-quality outputs.
