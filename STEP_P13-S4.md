# OnionReel v1 Artifact: Render Variants 30/15/6 via Remotion + Encode Settings Presets

## Overview
This artifact outlines the process for rendering video variants at 30, 15, and 6 frames per second (FPS) using Remotion. It includes the necessary encoding settings presets to ensure optimal video quality and performance.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project with video components
- **Encoding Settings**: Preset configurations for each FPS variant
- **Node.js Environment**: Required for running Remotion

## Outputs
- **Rendered Videos**: Three output files in specified formats:
  - `output_30fps.mp4`
  - `output_15fps.mp4`
  - `output_6fps.mp4`
- **Log File**: A log detailing rendering process and any errors encountered

## Steps
1. **Set Up Environment**:
   - Ensure Node.js and Remotion are installed.
   - Clone the Remotion project repository.

2. **Configure Encoding Settings**:
   - Define encoding presets for each FPS variant in a configuration file:
     ```json
     {
       "30fps": { "bitrate": "5000k", "codec": "h264" },
       "15fps": { "bitrate": "2500k", "codec": "h264" },
       "6fps": { "bitrate": "1000k", "codec": "h264" }
     }
     ```

3. **Render Videos**:
   - Use Remotion's CLI to render each variant:
     ```bash
     npx remotion render <YourRemotionProject> output_30fps.mp4 --fps 30 --preset 30fps
     npx remotion render <YourRemotionProject> output_15fps.mp4 --fps 15 --preset 15fps
     npx remotion render <YourRemotionProject> output_6fps.mp4 --fps 6 --preset 6fps
     ```

4. **Verify Outputs**:
   - Check the output files for successful rendering.
   - Review the log file for any errors or warnings.

## Pitfalls
- **Dependency Issues**: Ensure all dependencies are correctly installed and compatible with your Node.js version.
- **File Format Compatibility**: Verify that the input video formats are supported by Remotion.
- **Performance Concerns**: Rendering at lower FPS may lead to reduced video quality; adjust bitrate settings accordingly.
- **Error Handling**: Implement error handling in the rendering script to capture and log issues during the rendering process.

By following these steps, you will successfully render the required video variants using Remotion, ensuring a streamlined workflow for OnionReel's v1 release.
