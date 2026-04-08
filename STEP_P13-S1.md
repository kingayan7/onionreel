# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the process for scaffolding a Remotion project within the `onionreel/remotion` directory, focusing on setting up a composition and enabling CLI rendering. This will provide the foundation for video rendering capabilities within the OnionReel application.

## Inputs
- **Node.js**: Ensure Node.js (v14 or later) is installed.
- **Remotion**: The Remotion library should be included as a dependency.
- **CLI Access**: Command Line Interface (CLI) access to run scripts and commands.
- **Project Structure**: Existing `onionreel` repository with a `remotion` directory.

## Outputs
- **Remotion Project Structure**: A scaffolded Remotion project with necessary files and folders.
- **Composition File**: A basic composition file to define video scenes.
- **Render Script**: A CLI script for rendering videos.
- **Package.json**: Updated with Remotion dependencies and scripts.

## Steps
1. **Navigate to the Directory**:
   ```bash
   cd onionreel/remotion
   ```

2. **Initialize the Project**:
   ```bash
   npm init -y
   ```

3. **Install Remotion**:
   ```bash
   npm install remotion
   ```

4. **Create Project Structure**:
   ```bash
   mkdir src
   touch src/Video.tsx
   ```

5. **Set Up Composition**:
   Edit `src/Video.tsx`:
   ```tsx
   import { Composition } from 'remotion';
   import { MyVideo } from './MyVideo';

   export const Video: React.FC = () => (
       <Composition
           id="MyVideo"
           component={MyVideo}
           durationInFrames={300}
           fps={30}
           width={1920}
           height={1080}
       />
   );
   ```

6. **Create Video Component**:
   Create `src/MyVideo.tsx`:
   ```tsx
   import React from 'react';

   export const MyVideo: React.FC = () => {
       return <div>Hello, Remotion!</div>;
   };
   ```

7. **Add Render Script to Package.json**:
   Update `package.json`:
   ```json
   "scripts": {
       "render": "remotion render src/Video.tsx MyVideo out/video.mp4"
   }
   ```

8. **Test the Setup**:
   Run the render script:
   ```bash
   npm run render
   ```

## Pitfalls
- **Node Version Compatibility**: Ensure the Node.js version is compatible with Remotion.
- **Missing Dependencies**: Double-check all required packages are installed.
- **File Paths**: Ensure correct paths when importing components.
- **Rendering Issues**: Check for errors in the console during rendering; adjust settings as necessary.
- **Environment Variables**: If using any environment-specific configurations, ensure they are set up correctly.

This artifact serves as a concise guide to scaffold a Remotion project within OnionReel, facilitating video rendering capabilities.
