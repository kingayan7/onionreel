# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, along with encoding settings presets. The goal is to ensure efficient rendering and consistent output quality for various use cases.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project files
- **Encoding Settings**: Preset configurations for different render qualities
- **Variant Durations**: Target durations (30s, 15s, 6s)
- **Output Directory**: Destination path for rendered files

## Outputs
- **Rendered Videos**: 
  - `output-30s.mp4`
  - `output-15s.mp4`
  - `output-6s.mp4`
- **Log File**: Render process log for debugging and verification

## Steps
1. **Setup Remotion Environment**:
   - Ensure Remotion is installed and configured.
   - Verify all dependencies are up to date.

2. **Configure Video Variants**:
   - Modify the Remotion project to create components for each variant duration.
   - Use props to control video length dynamically.

3. **Define Encoding Presets**:
   - Create presets for each variant:
     - **30s**: High quality, lower compression
     - **15s**: Medium quality, balanced compression
     - **6s**: Lower quality, higher compression

4. **Render Videos**:
   - Execute rendering commands for each variant:
     ```bash
     npx remotion render <ProjectFile> <CompositionName> --output=output-30s.mp4 --codec=h264 --preset=<30s_preset>
     npx remotion render <ProjectFile> <CompositionName> --output=output-15s.mp4 --codec=h264 --preset=<15s_preset>
     npx remotion render <ProjectFile> <CompositionName> --output=output-6s.mp4 --codec=h264 --preset=<6s_preset>
     ```

5. **Verify Outputs**:
   - Check the output directory for rendered files.
   - Review log file for any errors or warnings during the rendering process.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure encoding presets are correctly defined; otherwise, output quality may suffer.
- **Rendering Time**: Longer videos may take significantly more time to render; plan accordingly.
- **Resource Limitations**: High resource usage can lead to failures; monitor system performance during rendering.
- **Version Compatibility**: Ensure Remotion version is compatible with project files to avoid runtime errors. 

By following these steps, you can efficiently render video variants using Remotion, ensuring high-quality outputs tailored to different use cases.
