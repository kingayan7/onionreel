# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process to render video variants at resolutions of 30p, 15p, and 6p using Remotion, along with predefined encoding settings presets. This will enhance the flexibility and performance of video outputs for various platforms and devices.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured project files for rendering
- **Encoding Settings**: Presets for each variant (resolution, bitrate, codec)
- **Environment**: Node.js environment with Remotion installed

## Outputs
- **Rendered Videos**: Three video files at specified resolutions:
  - 30p (30 frames per second)
  - 15p (15 frames per second)
  - 6p (6 frames per second)
- **Log Files**: Summary of rendering process and any errors encountered

## Steps
1. **Set Up Remotion Environment**:
   - Install Node.js and Remotion.
   - Clone the OnionReel repository and navigate to the Remotion project directory.

2. **Configure Encoding Settings**:
   - Define encoding presets in a configuration file (e.g., `encodingSettings.js`):
     ```javascript
     const encodingSettings = {
       '30p': { bitrate: '5000k', codec: 'h264' },
       '15p': { bitrate: '2500k', codec: 'h264' },
       '6p': { bitrate: '1000k', codec: 'h264' },
     };
     export default encodingSettings;
     ```

3. **Render Videos**:
   - Use Remotion’s `renderMedia` function to create video variants:
     ```javascript
     import { renderMedia } from 'remotion';
     import encodingSettings from './encodingSettings';

     const renderVariants = async () => {
       for (const [key, settings] of Object.entries(encodingSettings)) {
         await renderMedia({
           composition: 'YourCompositionName',
           output: `output/${key}.mp4`,
           codec: settings.codec,
           bitrate: settings.bitrate,
           fps: parseInt(key),
         });
       }
     };
     renderVariants();
     ```

4. **Verify Outputs**:
   - Check the output directory for rendered files.
   - Review log files for any errors or warnings during the rendering process.

5. **Testing**:
   - Play back the rendered videos to ensure quality meets expectations.
   - Validate compatibility across different devices and platforms.

## Pitfalls
- **Environment Issues**: Ensure that Node.js and Remotion are correctly installed and configured.
- **Encoding Errors**: Incorrect encoding settings may lead to poor video quality or failed renders. Double-check presets.
- **File Size Management**: High bitrate settings can lead to large file sizes; adjust as necessary for target platforms.
- **Performance**: Rendering multiple variants may require significant system resources; monitor performance and optimize as needed.
- **Version Compatibility**: Ensure that the Remotion version used is compatible with the project setup to avoid breaking changes.

This artifact serves as a guide to efficiently implement video rendering variants in OnionReel, ensuring a streamlined process and high-quality outputs.
