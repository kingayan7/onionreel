# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process to render video variants at 30fps, 15fps, and 6fps using Remotion, along with encoding settings presets. This step is crucial for optimizing video delivery across different platforms and bandwidth scenarios.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV).
- **Remotion Project**: Pre-configured Remotion project with necessary components.
- **Encoding Settings**: Preset configurations for each frame rate (30fps, 15fps, 6fps).
- **Output Directory**: Destination folder for rendered videos.

## Outputs
- **Rendered Videos**: Three variants of the video:
  - `video_30fps.mp4`
  - `video_15fps.mp4`
  - `video_6fps.mp4`
- **Log File**: A log detailing the rendering process, including any errors or warnings.

## Steps
1. **Set Up Remotion Environment**:
   - Ensure Remotion is properly installed and configured.
   - Verify that all dependencies are up-to-date.

2. **Configure Encoding Settings**:
   - Create presets for each frame rate:
     - **30fps**: High quality, standard bitrate.
     - **15fps**: Medium quality, reduced bitrate.
     - **6fps**: Low quality, minimal bitrate.

3. **Render Videos**:
   - Execute the Remotion render command for each frame rate:
     ```bash
     npx remotion render <YourRemotionComponent> video_30fps.mp4 --fps 30 --codec h264 --preset <30fps_preset>
     npx remotion render <YourRemotionComponent> video_15fps.mp4 --fps 15 --codec h264 --preset <15fps_preset>
     npx remotion render <YourRemotionComponent> video_6fps.mp4 --fps 6 --codec h264 --preset <6fps_preset>
     ```

4. **Verify Outputs**:
   - Check the output directory for rendered videos.
   - Review the log file for any issues encountered during rendering.

5. **Testing**:
   - Play each rendered video to ensure quality and performance.
   - Test playback on various devices and platforms.

## Pitfalls
- **Dependency Issues**: Ensure all Remotion dependencies are installed correctly to avoid runtime errors.
- **Encoding Quality**: Incorrect presets may lead to poor video quality; verify settings before rendering.
- **File Size Management**: Rendering at lower frame rates can significantly reduce file sizes, but may also impact visual fidelity; balance is key.
- **Log Monitoring**: Failing to check the log file may result in unnoticed errors that could affect the final output. Always review logs post-rendering.
