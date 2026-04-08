# OnionReel v1 Artifact: P13-S4 - Render Variants via Remotion

## Overview
This artifact outlines the process to render video variants at resolutions of 30p, 15p, and 6p using Remotion, along with the encoding settings presets. The goal is to ensure efficient rendering and consistent output quality for different use cases.

## Inputs
- **Video Source**: Original video file(s) in supported formats (e.g., MP4, MOV).
- **Remotion Project**: Pre-configured Remotion project files with necessary components.
- **Encoding Presets**: JSON or configuration files defining encoding settings for each variant.
- **Node.js Environment**: Ensure Node.js and Remotion are installed.

## Outputs
- **Rendered Videos**: 
  - `output-30p.mp4`
  - `output-15p.mp4`
  - `output-6p.mp4`
- **Log Files**: Logs detailing the rendering process and any errors encountered.

## Steps
1. **Set Up Environment**:
   - Ensure Node.js is installed.
   - Install Remotion: 
     ```bash
     npm install remotion
     ```

2. **Prepare Remotion Project**:
   - Create a Remotion project if not already set up.
   - Define video components and timelines for rendering.

3. **Define Encoding Settings**:
   - Create encoding preset configurations for each variant:
     ```json
     {
       "30p": { "bitrate": "5000k", "resolution": "1920x1080" },
       "15p": { "bitrate": "2500k", "resolution": "1280x720" },
       "6p": { "bitrate": "1000k", "resolution": "640x360" }
     }
     ```

4. **Render Variants**:
   - Use Remotion CLI to render each variant:
     ```bash
     npx remotion render <project-path> <output-path> --preset <preset-name>
     ```
   - Replace `<preset-name>` with `30p`, `15p`, and `6p` for each respective render.

5. **Verify Outputs**:
   - Check the output directory for the rendered videos.
   - Review log files for any errors or warnings.

## Pitfalls
- **Incorrect Encoding Settings**: Ensure the encoding presets match the desired output quality and compatibility.
- **Resource Limitations**: Rendering can be resource-intensive; monitor CPU and memory usage to avoid crashes.
- **File Format Issues**: Verify that the input video formats are compatible with Remotion.
- **Version Compatibility**: Ensure that the installed version of Remotion supports all required features for rendering.

By following these steps, you can successfully render video variants using Remotion, ensuring a streamlined workflow and high-quality outputs.
