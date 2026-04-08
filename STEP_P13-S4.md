# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process to render video variants (30s, 15s, 6s) using Remotion, along with encoding settings presets. The goal is to ensure efficient rendering and consistent quality across different video lengths for OnionReel.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion setup with templates for each variant
- **Encoding Presets**: Settings for video quality, resolution, and format
- **Rendering Parameters**: Desired output lengths (30s, 15s, 6s)

## Outputs
- **Rendered Videos**: 
  - `output_30s.mp4`
  - `output_15s.mp4`
  - `output_6s.mp4`
- **Log File**: Summary of rendering process and any errors encountered

## Steps
1. **Set Up Remotion Project**:
   - Ensure the Remotion project is configured with templates for each video variant.
   - Include necessary assets (images, audio) in the project.

2. **Define Encoding Settings**:
   - Create presets for each output length:
     - **30s**: High quality, 1080p
     - **15s**: Medium quality, 720p
     - **6s**: Low quality, 480p

3. **Render Variants**:
   - Execute the Remotion build command for each variant:
     ```bash
     npx remotion render <CompositionName> output_30s.mp4 --codec=libx264 --preset=30s_preset
     npx remotion render <CompositionName> output_15s.mp4 --codec=libx264 --preset=15s_preset
     npx remotion render <CompositionName> output_6s.mp4 --codec=libx264 --preset=6s_preset
     ```

4. **Verify Outputs**:
   - Check the rendered files for completion and quality.
   - Log any errors during rendering.

5. **Document Process**:
   - Update the project documentation with steps and encoding settings used.

## Pitfalls
- **Resource Limitations**: Ensure the rendering environment has sufficient CPU and memory resources to handle multiple render jobs simultaneously.
- **Incorrect Presets**: Double-check that the encoding presets match the desired output specifications to avoid quality loss.
- **File Format Issues**: Ensure the input video formats are compatible with Remotion and the output settings.
- **Error Handling**: Implement robust error logging to capture any issues during the rendering process for troubleshooting.

By following this roadmap step, OnionReel will successfully render video variants efficiently, enhancing the user experience with high-quality outputs tailored to various platforms.
