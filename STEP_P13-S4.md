# OnionReel v1 Artifact: Render Variants with Remotion

## Overview
This artifact outlines the process for rendering video variants in three resolutions (30p, 15p, 6p) using Remotion. It includes the necessary encoding settings presets to ensure optimal quality and performance.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Configured project with necessary components
- **Encoding Settings**: Preset configurations for each resolution
  - 30p: High quality (e.g., 1920x1080)
  - 15p: Medium quality (e.g., 1280x720)
  - 6p: Low quality (e.g., 640x360)

## Outputs
- **Rendered Videos**: Three separate video files for each resolution:
  - `output_30p.mp4`
  - `output_15p.mp4`
  - `output_6p.mp4`

## Steps
1. **Set Up Remotion Environment**:
   - Ensure Remotion is installed and configured correctly.
   - Create a new Remotion project or open an existing one.

2. **Configure Video Source**:
   - Import the original video file into the Remotion project.

3. **Define Encoding Presets**:
   - Create encoding presets for each resolution in the Remotion configuration.
   - Example settings:
     - **30p**: 
       - Codec: H.264
       - Bitrate: 5000 kbps
     - **15p**: 
       - Codec: H.264
       - Bitrate: 2500 kbps
     - **6p**: 
       - Codec: H.264
       - Bitrate: 1000 kbps

4. **Render Videos**:
   - Execute the rendering process for each variant using the respective encoding settings.
   - Use command-line or Remotion’s API to initiate rendering.

5. **Verify Outputs**:
   - Check the output files for successful rendering.
   - Ensure each file meets the specified resolution and quality standards.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure that the encoding settings match the desired output quality; incorrect settings can lead to poor video quality.
- **Resource Limitations**: Rendering can be resource-intensive; ensure the environment has sufficient CPU and memory.
- **File Format Compatibility**: Verify that the output formats are compatible with the intended distribution platforms.
- **Version Mismatches**: Ensure that the Remotion version used supports all required features and settings.

By following these guidelines, you can effectively render video variants using Remotion, ensuring a smooth workflow and high-quality outputs.
