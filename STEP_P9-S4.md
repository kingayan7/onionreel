# OnionReel v1 Artifact: VO + Music Mix v1 (Ducking) + Loudness Normalization Target

## Overview
This artifact outlines the process for creating a Voice Over (VO) and music mix with ducking and loudness normalization. The goal is to ensure that the VO is clear and prominent while maintaining a balanced audio experience with music.

## Inputs
- **Voice Over Audio Files**: Clean, recorded VO tracks.
- **Music Tracks**: Background music files intended for the mix.
- **Loudness Normalization Target**: Specified loudness level (e.g., -16 LUFS for streaming platforms).
- **Ducking Parameters**: Settings for how much the music volume should reduce when VO is present (e.g., -6 dB reduction).

## Outputs
- **Final Mixed Audio File**: A single audio file containing the mixed VO and music, adhering to the loudness normalization target.
- **Mixing Session File**: Project file from the Digital Audio Workstation (DAW) used for future adjustments.

## Steps
1. **Import Audio Files**: Load VO and music tracks into the DAW.
2. **Set Up Ducking**:
   - Apply a sidechain compressor to the music track.
   - Route the VO track to the sidechain input of the compressor.
   - Adjust the compressor settings to achieve the desired ducking effect.
3. **Mixing**:
   - Balance the levels of the VO and music tracks.
   - Ensure clarity of the VO while maintaining a pleasant background music presence.
4. **Loudness Normalization**:
   - Use a loudness meter to measure the current loudness of the mix.
   - Adjust levels to reach the specified loudness target (e.g., -16 LUFS).
5. **Export Final Mix**: Render the final audio file in the desired format (WAV, MP3, etc.).
6. **Save Project**: Save the DAW session for future reference and adjustments.

## Pitfalls
- **Over-Ducking**: Excessive reduction in music volume can lead to a disjointed listening experience. Aim for a natural balance.
- **Inconsistent Loudness**: Failing to monitor loudness throughout the mixing process can result in a final product that does not meet the target.
- **Poor Quality VO**: Ensure VO recordings are clean and free from background noise before mixing.
- **Ignoring Metadata**: Remember to include relevant metadata in the final audio file for easier identification and organization.

This artifact serves as a concise guide for achieving a professional VO and music mix with effective ducking and loudness normalization.
