# OnionReel v1 Artifact: Render Variants via Remotion

## Overview
This artifact outlines the process for rendering video variants (30s, 15s, and 6s) using Remotion, alongside setting up encoding presets. This will enhance OnionReel's video rendering capabilities, allowing for efficient production of multiple formats from a single source.

## Inputs
- **Video Source**: Original video file (e.g., MP4, MOV)
- **Remotion Project**: Pre-configured Remotion project files
- **Encoding Presets**: JSON or configuration files defining encoding settings for each variant
- **Rendering Parameters**: Specifications for each variant (duration, resolution, etc.)

## Outputs
- **Rendered Videos**: 
  - `output/30s.mp4`
  - `output/15s.mp4`
  - `output/6s.mp4`
- **Log Files**: 
  - `logs/render_30s.log`
  - `logs/render_15s.log`
  - `logs/render_6s.log`

## Steps
1. **Set Up Environment**:
   - Ensure Node.js and Remotion are installed.
   - Install necessary dependencies using `npm install`.

2. **Configure Remotion Project**:
   - Create a Remotion project structure.
   - Import the video source and set up the composition for each variant.

3. **Define Encoding Presets**:
   - Create JSON files for each variant with settings such as bitrate, codec, and resolution.

4. **Render Variants**:
   - Execute the Remotion CLI commands for each variant:
     ```bash
     npx remotion render <CompositionName> output/30s.mp4 --props '{duration: 30}'
     npx remotion render <CompositionName> output/15s.mp4 --props '{duration: 15}'
     npx remotion render <CompositionName> output/6s.mp4 --props '{duration: 6}'
     ```

5. **Apply Encoding Presets**:
   - Use a video processing tool (e.g., FFmpeg) to apply encoding presets to the rendered videos.

6. **Log Outputs**:
   - Capture logs for each rendering process for troubleshooting and verification.

## Pitfalls
- **Dependency Issues**: Ensure all dependencies are compatible with the current version of Node.js and Remotion.
- **File Path Errors**: Verify that all file paths are correctly set to avoid rendering failures.
- **Encoding Settings**: Incorrect encoding presets may lead to suboptimal video quality or playback issues.
- **Resource Limitations**: Rendering high-quality videos may require significant CPU/GPU resources; ensure the environment can handle the load.
- **Log Management**: Regularly check logs for errors; unaddressed issues may lead to incomplete renders. 

By following these steps, OnionReel will successfully render video variants efficiently, paving the way for enhanced video production capabilities.
