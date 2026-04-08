# OnionReel v1 Artifact: P13-S1 - Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to create a functional setup that allows for video composition and CLI rendering using Remotion.

## Inputs
- **Node.js**: Ensure Node.js (version 14 or higher) is installed.
- **npm/yarn**: Package manager for dependency management.
- **Git**: Version control system for project management.
- **Remotion CLI**: Command-line interface for Remotion.

## Outputs
- A scaffolded Remotion project structure within `onionreel/remotion`.
- Basic video composition example.
- CLI commands for rendering videos.

## Steps
1. **Navigate to Project Directory**
   ```bash
   cd onionreel/remotion
   ```

2. **Initialize a New Remotion Project**
   ```bash
   npx create-remotion@latest .
   ```
   - This command initializes a new Remotion project in the current directory.

3. **Install Dependencies**
   ```bash
   npm install
   ```
   - Ensure all necessary dependencies are installed.

4. **Create a Basic Video Composition**
   - Inside `src`, create a new file `MyVideo.tsx` with a simple video component:
     ```tsx
     import { Composition } from 'remotion';
     import { MyVideo } from './MyVideo';

     export const RemotionVideo = () => (
       <Composition
         id="MyVideo"
         component={MyVideo}
         durationInFrames={150}
         fps={30}
         width={1920}
         height={1080}
       />
     );
     ```

5. **Add CLI Render Script**
   - In `package.json`, add a script for rendering:
     ```json
     "scripts": {
       "render": "remotion render MyVideo out/video.mp4"
     }
     ```

6. **Test the Setup**
   - Run the CLI render command:
     ```bash
     npm run render
     ```
   - Check the `out` directory for the rendered video.

## Pitfalls
- **Dependency Issues**: Ensure that all dependencies are compatible with the version of Remotion being used.
- **Incorrect Paths**: Verify that the paths in the composition and render commands are correct.
- **Node Version**: Make sure the Node.js version meets the minimum requirement; otherwise, you may encounter compatibility issues.
- **Permissions**: Ensure you have the necessary permissions to create files and directories in the specified location.

By following these steps, you will have a functional Remotion project scaffolded within the OnionReel repository, ready for video composition and rendering.
