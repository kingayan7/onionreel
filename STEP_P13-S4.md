# OnionReel v1 Artifact: Render Variants 30/15/6 via Remotion + Encode Settings Presets

## Overview
This artifact outlines the process for rendering video variants at 30fps, 15fps, and 6fps using Remotion, along with the necessary encoding settings presets. The goal is to ensure consistent quality and performance across different render settings.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Configured project with necessary components and assets
- **Encoding Settings**: Preset configurations for each variant (30fps, 15fps, 6fps)

## Outputs
- **Rendered Videos**: 
  - `output_30fps.mp4`
  - `output_15fps.mp4`
  - `output_6fps.mp4`
- **Log Files**: Render logs for each variant for troubleshooting

## Steps
1. **Set Up Remotion Environment**:
   - Ensure Remotion is installed and configured in your project.
   - Verify that all assets and components are properly imported.

2. **Define Encoding Presets**:
   - Create presets for each frame rate:
     - **30fps Preset**: High quality, suitable for standard playback.
     - **15fps Preset**: Medium quality, optimized for smaller file sizes.
     - **6fps Preset**: Low quality, for quick loading and minimal bandwidth.

3. **Render Variants**:
   - Execute the rendering command for each variant:
     ```bash
     remotion render <YourComponent> <output_30fps.mp4> --fps 30 --preset <30fps_preset>
     remotion render <YourComponent> <output_15fps.mp4> --fps 15 --preset <15fps_preset>
     remotion render <YourComponent> <output_6fps.mp4> --fps 6 --preset <6fps_preset>
     ```

4. **Verify Outputs**:
   - Check the output files for playback quality.
   - Review log files for any errors or warnings during rendering.

5. **Documentation**:
   - Update project documentation with details on rendering process and encoding presets.

## Pitfalls
- **Incorrect Preset Configuration**: Ensure presets are correctly set up to avoid quality issues.
- **Resource Limitations**: Rendering at higher frame rates may require more system resources; monitor performance.
- **File Format Compatibility**: Ensure the output format is compatible with intended use cases (e.g., web, social media).
- **Version Compatibility**: Check that the Remotion version is compatible with your project setup to avoid breaking changes.

By following these steps, you can efficiently render video variants using Remotion, ensuring high-quality outputs tailored to different playback needs.
