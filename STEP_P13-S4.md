# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, 6s) using Remotion, along with the necessary encoding settings presets. This step is crucial for delivering optimized video formats tailored for various platforms and audiences.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project files
- **Encoding Settings**: Preset configurations for different video lengths
- **Environment**: Node.js environment with Remotion installed

## Outputs
- **Rendered Videos**: 
  - `output_30s.mp4`
  - `output_15s.mp4`
  - `output_6s.mp4`
- **Log File**: Summary of render processes and any errors encountered

## Steps
1. **Setup Environment**:
   - Ensure Node.js and Remotion are installed.
   - Clone the Remotion project repository and navigate to the project directory.

2. **Configure Encoding Settings**:
   - Define encoding presets for each variant in a configuration file (e.g., `encodingSettings.js`):
     ```javascript
     const encodingSettings = {
       30: { bitrate: '1500k', resolution: '1920x1080' },
       15: { bitrate: '1000k', resolution: '1280x720' },
       6: { bitrate: '500k', resolution: '640x360' },
     };
     export default encodingSettings;
     ```

3. **Render Variants**:
   - Use Remotion’s `renderMedia` function for each variant:
     ```javascript
     import { renderMedia } from 'remotion';
     import encodingSettings from './encodingSettings';

     const renderVariant = async (duration) => {
       await renderMedia({
         composition: 'MyComposition',
         codec: 'h264',
         outputLocation: `output_${duration}s.mp4`,
         inputProps: { duration },
         ...encodingSettings[duration],
       });
     };

     await Promise.all([renderVariant(30), renderVariant(15), renderVariant(6)]);
     ```

4. **Execute Render Process**:
   - Run the script to start rendering:
     ```bash
     node renderScript.js
     ```

5. **Verify Outputs**:
   - Check the output directory for the rendered videos and review the log file for any errors.

## Pitfalls
- **Environment Issues**: Ensure all dependencies are correctly installed and that the Node.js version is compatible with Remotion.
- **Encoding Errors**: Validate encoding settings to prevent issues during rendering (e.g., unsupported resolutions or bitrates).
- **Resource Limitations**: Rendering may consume significant CPU and memory; ensure the environment has adequate resources.
- **File Permissions**: Ensure the script has permission to write output files in the designated directory.

By following these steps, you can successfully render video variants using Remotion, ensuring a smooth workflow for video production in OnionReel.
