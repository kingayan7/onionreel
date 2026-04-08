# OnionReel v1 Artifact: P13-S4 - Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, along with preset encoding settings. This will ensure efficient rendering and consistent quality across different video lengths for OnionReel.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project files
- **Encoding Settings**: Preset configurations for video encoding (bitrate, resolution, codec)
- **Render Variants**: Specifications for 30s, 15s, and 6s variants

## Outputs
- **Rendered Videos**: 
  - `video_30s.mp4`
  - `video_15s.mp4`
  - `video_6s.mp4`
- **Log File**: Render process log for debugging and verification

## Steps
1. **Setup Environment**:
   - Ensure Node.js and Remotion are installed.
   - Clone the OnionReel repository and navigate to the Remotion project directory.

2. **Configure Remotion Project**:
   - Import the original video into the Remotion project.
   - Create separate components for each video variant (30s, 15s, 6s).

3. **Define Encoding Presets**:
   - Create a configuration file (e.g., `encodingSettings.js`) with presets:
     ```javascript
     const encodingSettings = {
       30: { bitrate: '2000k', resolution: '1920x1080', codec: 'h264' },
       15: { bitrate: '1500k', resolution: '1280x720', codec: 'h264' },
       6: { bitrate: '800k', resolution: '640x360', codec: 'h264' },
     };
     export default encodingSettings;
     ```

4. **Render Videos**:
   - Use the Remotion CLI to render each variant:
     ```bash
     npx remotion render <YourVideoComponent> video_30s.mp4 --preset=30
     npx remotion render <YourVideoComponent> video_15s.mp4 --preset=15
     npx remotion render <YourVideoComponent> video_6s.mp4 --preset=6
     ```

5. **Log the Process**:
   - Capture logs during the rendering process for each variant to a log file.

6. **Verify Outputs**:
   - Check the output directory for the rendered videos and log file.
   - Ensure video playback quality meets the specified encoding settings.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure that the encoding settings match the desired output quality and format.
- **Resource Limitations**: Rendering can be resource-intensive; ensure adequate system resources are available.
- **Version Compatibility**: Verify that the Remotion version used is compatible with the project setup.
- **Error Handling**: Implement error handling to catch and log any rendering failures.

By following these steps, the rendering process for video variants will be streamlined, leading to a successful deployment of the P13-S4 roadmap step.
