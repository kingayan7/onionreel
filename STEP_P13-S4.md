# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants at 30fps, 15fps, and 6fps using Remotion. It includes the necessary encoding settings presets to ensure optimal quality and performance for each variant.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project setup
- **Encoding Settings**: Presets for each frame rate variant
  - 30fps: High quality
  - 15fps: Medium quality
  - 6fps: Low quality
- **Environment**: Node.js, Remotion installed, necessary dependencies

## Outputs
- **Rendered Videos**: 
  - `output_30fps.mp4` (30fps)
  - `output_15fps.mp4` (15fps)
  - `output_6fps.mp4` (6fps)

## Steps
1. **Setup Environment**:
   - Ensure Node.js and Remotion are installed.
   - Create a new Remotion project or navigate to the existing one.

2. **Configure Video Source**:
   - Place the original video file in the designated folder within the Remotion project.

3. **Define Encoding Settings**:
   - Create presets for each frame rate variant in the Remotion configuration.
   ```javascript
   const presets = {
     '30fps': { codec: 'h264', bitrate: '5000k' },
     '15fps': { codec: 'h264', bitrate: '2500k' },
     '6fps': { codec: 'h264', bitrate: '1000k' },
   };
   ```

4. **Render Variants**:
   - Use Remotion's rendering functions to generate videos for each frame rate.
   ```javascript
   const renderVideo = async (fps) => {
     await renderMedia({
       composition: 'MyComposition',
       output: `output_${fps}.mp4`,
       codec: presets[fps].codec,
       bitrate: presets[fps].bitrate,
       fps: fps,
     });
   };

   await Promise.all([renderVideo(30), renderVideo(15), renderVideo(6)]);
   ```

5. **Verify Outputs**:
   - Check the output directory for the rendered videos and ensure they play correctly.

## Pitfalls
- **Encoding Errors**: Ensure that the encoding settings and codecs are supported by the output format.
- **Resource Limitations**: Rendering at higher frame rates may require significant CPU/GPU resources; monitor performance.
- **File Size Management**: Higher quality settings may lead to larger file sizes; consider storage implications.
- **Dependencies**: Ensure all necessary Remotion packages and dependencies are up to date to avoid compatibility issues.

By following these steps, you can effectively render video variants at different frame rates using Remotion, ensuring a streamlined process for your OnionReel project.
