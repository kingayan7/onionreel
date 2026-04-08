# OnionReel v1 Artifact: P13-S4 - Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants at 30fps, 15fps, and 6fps using Remotion, along with encoding settings presets. The goal is to ensure efficient rendering and encoding for various use cases.

## Inputs
- **Video Source**: Original video file(s) to be rendered.
- **Remotion Project**: Pre-configured Remotion project with necessary components.
- **Encoding Presets**: Settings for each variant (resolution, bitrate, codec).
- **Environment**: Node.js environment with Remotion installed.

## Outputs
- **Rendered Videos**: Three output files for each variant:
  - `output_30fps.mp4`
  - `output_15fps.mp4`
  - `output_6fps.mp4`
- **Log Files**: Success/error logs for each rendering process.

## Steps
1. **Set Up Remotion Project**:
   - Ensure the Remotion project is configured with the necessary components for video rendering.

2. **Define Encoding Presets**:
   - Create a configuration file (e.g., `encodingPresets.json`) that specifies the settings for each variant:
     ```json
     {
       "30fps": { "bitrate": "5000k", "codec": "h264", "resolution": "1920x1080" },
       "15fps": { "bitrate": "2500k", "codec": "h264", "resolution": "1280x720" },
       "6fps": { "bitrate": "1000k", "codec": "h264", "resolution": "640x360" }
     }
     ```

3. **Render Videos**:
   - Use Remotion's rendering API to generate videos for each preset:
     ```javascript
     const { renderMedia } = require('remotion');
     const presets = require('./encodingPresets.json');

     for (const [fps, settings] of Object.entries(presets)) {
       await renderMedia({
         composition: 'YourCompositionName',
         output: `output_${fps}.mp4`,
         codec: settings.codec,
         fps: parseInt(fps),
         bitrate: settings.bitrate,
         resolution: settings.resolution,
       });
     }
     ```

4. **Log Output**:
   - Capture success and error logs during the rendering process for troubleshooting.

5. **Test Outputs**:
   - Verify the rendered videos for quality and adherence to the specified presets.

## Pitfalls
- **Performance Issues**: Rendering at higher resolutions may require significant resources. Monitor system performance.
- **Codec Compatibility**: Ensure that the chosen codec is supported by the target platforms.
- **Error Handling**: Implement robust error handling to capture and log issues during rendering.
- **Version Compatibility**: Ensure Remotion and Node.js versions are compatible with the project setup.

By following these steps, you can successfully render video variants using Remotion, ensuring a streamlined process for video production in OnionReel.
