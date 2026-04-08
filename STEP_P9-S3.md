# Renderer v1 (ffmpeg concat/crop/scale + text overlays + end card)

## Overview
Renderer v1 is designed to process video files by concatenating, cropping, scaling, and adding text overlays, culminating in an MP4 output formatted in a 9:16 aspect ratio. This artifact will serve as a foundational tool for video editing within OnionReel, enhancing content creation capabilities.

## Inputs
- **Video Files**: Multiple input video files (e.g., MP4, MOV).
- **Crop Parameters**: Dimensions and coordinates for cropping (e.g., width, height, x, y).
- **Scale Parameters**: Target resolution for scaling (e.g., 720x1280).
- **Text Overlays**: Text content, font size, color, position (e.g., "Hello World" at the bottom center).
- **End Card**: Optional image or video to be added at the end of the final output.

## Outputs
- **Final Video**: An MP4 file formatted in 9:16 aspect ratio, containing:
  - Concatenated clips
  - Applied crop and scale
  - Text overlays
  - End card (if provided)

## Steps
1. **Gather Inputs**: Collect all video files and parameters for cropping, scaling, text, and end card.
2. **Concatenate Videos**: Use ffmpeg to concatenate input video files into a single stream.
   ```bash
   ffmpeg -f concat -safe 0 -i input.txt -c copy output.mp4
   ```
3. **Crop Videos**: Apply cropping to the concatenated video.
   ```bash
   ffmpeg -i output.mp4 -vf "crop=w:h:x:y" cropped_output.mp4
   ```
4. **Scale Video**: Scale the cropped video to the desired resolution.
   ```bash
   ffmpeg -i cropped_output.mp4 -vf "scale=720:1280" scaled_output.mp4
   ```
5. **Add Text Overlays**: Overlay text on the video.
   ```bash
   ffmpeg -i scaled_output.mp4 -vf "drawtext=text='Your Text':fontcolor=white:fontsize=24:x=100:y=100" text_output.mp4
   ```
6. **Add End Card**: If provided, concatenate the end card to the final output.
   ```bash
   ffmpeg -i text_output.mp4 -i end_card.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0" final_output.mp4
   ```
7. **Finalize Output**: Ensure the final output is in the correct MP4 format and aspect ratio.

## Pitfalls
- **Input Format Compatibility**: Ensure all video files are in a compatible format for ffmpeg.
- **Crop Dimensions**: Incorrect crop parameters may lead to unusable output. Validate dimensions before processing.
- **Text Overlay Positioning**: Overlays may become unreadable if positioned incorrectly or if the video background is too busy.
- **Performance**: Large video files may lead to long processing times; consider optimizing input sizes.
- **Error Handling**: Implement error checks for each step to handle issues like missing files or invalid parameters gracefully.
