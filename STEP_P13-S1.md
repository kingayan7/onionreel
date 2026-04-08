# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to set up a basic structure that allows for composition and CLI rendering, enabling users to create and render videos using Remotion.

## Inputs
- **Node.js**: Ensure Node.js is installed (version 14 or above).
- **NPM/Yarn**: Package manager for managing dependencies.
- **Remotion**: Library for creating videos using React.
- **Git**: Version control system for managing project files.

## Outputs
- A fully scaffolded Remotion project in the `onionreel/remotion` directory.
- Basic configuration files (`package.json`, `tsconfig.json`, etc.).
- Sample video component and rendering script.

## Steps
1. **Create Directory**: 
   ```bash
   mkdir -p onionreel/remotion
   cd onionreel/remotion
   ```

2. **Initialize NPM**:
   ```bash
   npm init -y
   ```

3. **Install Remotion**:
   ```bash
   npm install remotion
   ```

4. **Set Up TypeScript (Optional)**:
   - If using TypeScript, install TypeScript and create a `tsconfig.json`:
   ```bash
   npm install typescript --save-dev
   npx tsc --init
   ```

5. **Create Basic Video Component**:
   - Create a new file `src/MyVideo.tsx`:
   ```tsx
   import { Composition } from 'remotion';
   import { MyVideoComponent } from './MyVideoComponent';

   export const RemotionVideo = () => {
       return (
           <Composition
               id="MyVideo"
               component={MyVideoComponent}
               durationInFrames={300}
               fps={30}
               width={1920}
               height={1080}
           />
       );
   };
   ```

6. **Create a Sample Video Component**:
   - Create `src/MyVideoComponent.tsx`:
   ```tsx
   import React from 'react';

   export const MyVideoComponent = () => {
       return <div>Hello, Remotion!</div>;
   };
   ```

7. **Set Up CLI Rendering**:
   - Create a `render.ts` script:
   ```tsx
   import { renderMedia } from 'remotion';
   import { RemotionVideo } from './MyVideo';

   renderMedia(<RemotionVideo />, {
       output: 'output/video.mp4',
       codec: 'h264',
       // additional options
   });
   ```

8. **Add Scripts to `package.json`**:
   ```json
   "scripts": {
       "start": "remotion start",
       "build": "remotion build",
       "render": "ts-node render.ts"
   }
   ```

9. **Run the Project**:
   - Start the Remotion server:
   ```bash
   npm start
   ```

   - Render the video:
   ```bash
   npm run render
   ```

## Pitfalls
- **Version Compatibility**: Ensure that all installed packages are compatible with each other, especially React and Remotion.
- **TypeScript Configuration**: If using TypeScript, ensure that `tsconfig.json` is correctly set up to avoid compilation issues.
- **File Paths**: Double-check file paths when importing components to avoid module not found errors.
- **CLI Permissions**: If encountering permission issues during rendering, ensure that the script has the necessary access to write files in the output directory.

This scaffold provides a solid foundation for further development and customization of video projects using Remotion within OnionReel.
