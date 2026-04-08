# OnionReel v1 Artifact: Brain Job Types

## Overview
This document outlines the implementation details for the brain job types: `sora_generate`, `stock_fetch`, `render`, `qc_render`, and `export_pack`. These jobs are essential for streamlining the video production workflow in OnionReel.

## Inputs
- **sora_generate**
  - User specifications (e.g., video length, style)
  - Source assets (audio, video clips, images)

- **stock_fetch**
  - Keywords or tags for stock media
  - User preferences (e.g., resolution, licensing)

- **render**
  - Project file (e.g., .onion format)
  - Render settings (resolution, format)

- **qc_render**
  - Rendered video file
  - Quality control parameters (e.g., resolution, bitrate)

- **export_pack**
  - Finalized project files
  - Export settings (e.g., format, destination)

## Outputs
- **sora_generate**
  - Generated storyboard or script

- **stock_fetch**
  - List of stock media assets

- **render**
  - Rendered video file

- **qc_render**
  - Quality control report (issues, recommendations)

- **export_pack**
  - Packaged project files (e.g., video, assets, metadata)

## Steps
1. **sora_generate**
   - Accept user inputs and generate a storyboard/script.
   - Validate inputs for completeness.

2. **stock_fetch**
   - Query stock media API with user-provided keywords.
   - Filter results based on user preferences.

3. **render**
   - Load project file and apply render settings.
   - Execute rendering process and save output.

4. **qc_render**
   - Analyze the rendered video for quality issues.
   - Generate a report detailing any discrepancies.

5. **export_pack**
   - Compile all necessary files into a single package.
   - Apply export settings and save to the specified destination.

## Pitfalls
- **sora_generate**
  - Incomplete user inputs may lead to suboptimal storyboards.
  
- **stock_fetch**
  - API rate limits or downtime could delay asset retrieval.
  
- **render**
  - Insufficient system resources may cause rendering failures.
  
- **qc_render**
  - False negatives in quality checks might lead to unpolished outputs.
  
- **export_pack**
  - Incorrect export settings could result in incompatible file formats.

By following this roadmap, we can ensure a smooth implementation of the brain job types, enhancing the overall functionality of OnionReel.
