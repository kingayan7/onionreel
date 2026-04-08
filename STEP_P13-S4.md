# OnionReel v1 Artifact: Render Variants with Remotion

## Overview
This artifact outlines the process for rendering video variants (30fps, 15fps, 6fps) using Remotion, along with setting up encoding presets. The goal is to ensure efficient rendering and encoding of video content for various platforms.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV).
- **Remotion Project**: Pre-configured Remotion project with components for rendering.
- **Encoding Settings**: Preset configurations for each frame rate variant.
- **Node.js Environment**: Ensure Node.js and Remotion are installed.

## Outputs
- **Rendered Videos**: Three output files for each frame rate:
  - `video-30fps.mp4`
  - `video-15fps.mp4`
  - `video-6fps.mp4`
- **Encoding Logs**: Logs detailing the encoding process for each variant.

## Steps
1. **Setup Remotion Project**:
   - Ensure your Remotion project is configured with all necessary components and assets.

2. **Define Encoding Presets**:
   - Create a configuration file (e.g., `encodingPresets.js`) that includes settings for:
     - Resolution
     - Bitrate
     - Codec
   - Example:
     ```javascript
     const presets = {
       '30fps': { bitrate: '5000k', resolution: '1920x1080' },
       '15fps': { bitrate: '2500k', resolution: '1280x720' },
       '6fps': { bitrate: '1000k', resolution: '640x360' },
     };
     export default presets;
     ```

3. **Render Variants**:
   - Use Remotion to render each video variant:
     ```bash
     npx remotion render <CompositionName> video-30fps.mp4 --fps 30
     npx remotion render <CompositionName> video-15fps.mp4 --fps 15
     npx remotion render <CompositionName> video-6fps.mp4 --fps 6
     ```

4. **Encode Videos**:
   - Utilize a video encoding tool (e.g., FFmpeg) to apply the encoding presets:
     ```bash
     ffmpeg -i video-30fps.mp4 -b:v 5000k -s 1920x1080 output-30fps.mp4
     ffmpeg -i video-15fps.mp4 -b:v 2500k -s 1280x720 output-15fps.mp4
     ffmpeg -i video-6fps.mp4 -b:v 1000k -s 640x360 output-6fps.mp4
     ```

5. **Verify Outputs**:
   - Check each output file for quality and ensure it meets the specifications.

## Pitfalls
- **Performance Issues**: Rendering at lower frame rates may lead to faster processing but could compromise quality. Test each variant thoroughly.
- **Encoding Errors**: Ensure FFmpeg is correctly configured; check for codec compatibility issues.
- **Resource Management**: Rendering multiple variants simultaneously can strain system resources. Consider rendering sequentially if necessary.
- **Version Compatibility**: Ensure that the Remotion version is compatible with your project setup to avoid breaking changes.

By following these steps, you will successfully render and encode video variants for OnionReel, enhancing the platform's capabilities.
