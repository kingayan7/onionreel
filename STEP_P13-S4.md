# OnionReel v1 Artifact: Render Variants 30/15/6 via Remotion + Encode Settings Presets

## Overview
This artifact outlines the process for rendering video variants at 30, 15, and 6 frames per second (FPS) using Remotion, along with predefined encoding settings. This step is crucial for optimizing video delivery across different platforms and bandwidths.

## Inputs
- **Video Source**: Original video file(s) to be rendered.
- **Remotion Project**: Configuration files including composition settings.
- **Encoding Presets**: Predefined settings for different quality and compression levels.
- **Output Formats**: Desired output formats (e.g., MP4, WebM).

## Outputs
- **Rendered Videos**: Three variants of the video rendered at 30 FPS, 15 FPS, and 6 FPS.
- **Log Files**: Logs detailing the rendering process and any errors encountered.
- **Quality Metrics**: Reports on the quality and size of each rendered variant.

## Steps
1. **Set Up Remotion Environment**:
   - Ensure Remotion is installed and configured.
   - Create a new Remotion project or navigate to the existing project.

2. **Configure Video Composition**:
   - Define the main composition settings (resolution, duration).
   - Ensure the video source is properly imported.

3. **Define Encoding Settings**:
   - Create and save encoding presets for 30 FPS, 15 FPS, and 6 FPS.
   - Include parameters such as bitrate, codec, and resolution.

4. **Render Video Variants**:
   - Use Remotion's rendering capabilities to generate the three video variants.
   - Execute rendering commands for each FPS setting:
     ```bash
     npm run render --fps=30
     npm run render --fps=15
     npm run render --fps=6
     ```

5. **Verify Outputs**:
   - Check the output directory for rendered videos.
   - Review log files for any errors or warnings.
   - Validate quality metrics to ensure compliance with preset standards.

6. **Document and Archive**:
   - Document the rendering process and any issues encountered.
   - Archive the rendered videos and logs for future reference.

## Pitfalls
- **Incompatible Formats**: Ensure the original video format is supported by Remotion.
- **Rendering Errors**: Monitor logs for errors; common issues include missing assets or incorrect settings.
- **Performance Issues**: Rendering at lower FPS may lead to unexpected quality; validate outputs before deployment.
- **Version Compatibility**: Ensure that the Remotion version used is compatible with the encoding presets.

By following these steps, you can successfully render video variants at different frame rates, ensuring optimal delivery for various use cases.
