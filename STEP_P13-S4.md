# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, along with the encoding settings presets to ensure optimal quality and performance.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project files
- **Encoding Settings**: Preset configurations for video encoding
- **Audio Track**: Optional audio file for inclusion in variants
- **Rendering Parameters**: Desired resolution, frame rate, etc.

## Outputs
- **Rendered Video Variants**:
  - `variant_30s.mp4`
  - `variant_15s.mp4`
  - `variant_6s.mp4`
- **Log Files**: Render logs for debugging and performance tracking

## Steps
1. **Setup Remotion Environment**:
   - Ensure Remotion is installed and configured in your development environment.
   - Install required dependencies using `npm install`.

2. **Configure Project**:
   - Open the Remotion project and set up the video composition for each variant (30s, 15s, 6s).
   - Use the original video source and incorporate any necessary audio tracks.

3. **Define Encoding Presets**:
   - Create encoding settings for each variant:
     - **30s**: 1080p, 30fps, H.264
     - **15s**: 720p, 30fps, H.264
     - **6s**: 480p, 30fps, H.264

4. **Render Variants**:
   - Execute the rendering command for each variant using Remotion CLI:
     ```bash
     npx remotion render <CompositionName> variant_30s.mp4 --codec=h264 --preset=30s_preset
     npx remotion render <CompositionName> variant_15s.mp4 --codec=h264 --preset=15s_preset
     npx remotion render <CompositionName> variant_6s.mp4 --codec=h264 --preset=6s_preset
     ```

5. **Verify Output**:
   - Check the output directory for the generated video files.
   - Review log files for any errors or warnings during rendering.

6. **Testing**:
   - Play each variant to ensure they meet quality standards and playback requirements.

## Pitfalls
- **Environment Issues**: Ensure all dependencies are correctly installed and compatible with your OS.
- **Incorrect Encoding Settings**: Double-check encoding presets to avoid quality loss.
- **Rendering Failures**: Monitor logs for errors; insufficient memory or CPU resources can lead to failures.
- **Audio Sync Issues**: Ensure audio tracks are properly aligned with video clips during rendering.
- **File Size Management**: Keep an eye on file sizes, especially for web delivery; adjust encoding settings as necessary.
