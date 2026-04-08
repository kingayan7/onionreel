# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, along with encoding settings presets. This step ensures that OnionReel can produce optimized video formats for various platforms and user needs.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project with templates for each variant
- **Encoding Presets**: JSON or configuration files defining encoding settings for each variant
- **Node.js Environment**: Required for running Remotion scripts

## Outputs
- **Rendered Video Files**: 
  - `output_30s.mp4`
  - `output_15s.mp4`
  - `output_6s.mp4`
- **Log Files**: Detailed logs of the rendering process for troubleshooting

## Steps
1. **Set Up Environment**:
   - Ensure Node.js and Remotion are installed.
   - Clone the OnionReel repository and navigate to the Remotion project directory.

2. **Configure Encoding Settings**:
   - Create or update encoding presets in a JSON file. Include settings like bitrate, resolution, and codec for each variant.

3. **Render Variants**:
   - Run the Remotion CLI commands for each variant:
     ```bash
     npx remotion render <path_to_project> <output_30s.mp4> --props '{"duration":30}'
     npx remotion render <path_to_project> <output_15s.mp4> --props '{"duration":15}'
     npx remotion render <path_to_project> <output_6s.mp4> --props '{"duration":6}'
     ```

4. **Verify Outputs**:
   - Check the output directory for the rendered video files and log files.
   - Ensure that each variant meets the specified encoding settings.

5. **Document Process**:
   - Update the documentation with the rendering process and encoding settings for future reference.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure that the encoding presets are compatible with the target platforms.
- **Rendering Failures**: Monitor log files for errors during rendering; common issues include missing assets or incorrect paths.
- **Performance Issues**: Rendering can be resource-intensive; ensure the environment has adequate CPU and memory resources.
- **Version Compatibility**: Verify that the Remotion version is compatible with the project setup to avoid breaking changes.

By following this artifact, the team can efficiently render video variants, ensuring high-quality outputs tailored for various user needs.
