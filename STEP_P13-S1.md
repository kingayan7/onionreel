# Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the process of scaffolding a Remotion project within the `onionreel/remotion` directory. The goal is to set up a basic project structure that supports composition and CLI rendering, enabling users to create and render videos using React components.

## Inputs
- **Node.js**: Ensure Node.js is installed (version 14.x or higher).
- **Yarn**: Recommended package manager for managing dependencies.
- **Remotion CLI**: The Remotion command-line interface for rendering videos.
- **Project Directory**: The path to the `onionreel/remotion` directory.

## Outputs
- A scaffolded Remotion project structure.
- Basic configuration files (`package.json`, `tsconfig.json`, etc.).
- Sample video component for testing.
- Scripts for building and rendering videos via CLI.

## Steps
1. **Navigate to Project Directory**:
   ```bash
   cd onionreel/remotion
   ```

2. **Initialize a New Node Project**:
   ```bash
   yarn init -y
   ```

3. **Install Remotion**:
   ```bash
   yarn add remotion
   ```

4. **Set Up TypeScript** (if using TypeScript):
   ```bash
   yarn add typescript @types/react @types/react-dom --dev
   npx tsc --init
   ```

5. **Create Project Structure**:
   - Create directories:
     ```bash
     mkdir src
     mkdir public
     ```

6. **Create Sample Video Component**:
   - Create a file `src/Video.tsx`:
     ```tsx
     import { Composition } from 'remotion';
     import { MyVideo } from './MyVideo';

     export const RemotionVideo: React.FC = () => {
       return (
         <Composition
           id="MyVideo"
           component={MyVideo}
           durationInFrames={300}
           fps={30}
           width={1920}
           height={1080}
         />
       );
     };
     ```

7. **Create the Video Component**:
   - Create a file `src/MyVideo.tsx`:
     ```tsx
     import { Video } from 'remotion';

     export const MyVideo: React.FC = () => {
       return <Video src="path/to/video.mp4" />;
     };
     ```

8. **Add Build and Render Scripts**:
   - Update `package.json`:
     ```json
     {
       "scripts": {
         "build": "remotion build",
         "render": "remotion render src/Video.tsx MyVideo out/video.mp4"
       }
     }
     ```

9. **Run the Project**:
   - Build the project:
     ```bash
     yarn build
     ```
   - Render the video:
     ```bash
     yarn render
     ```

## Pitfalls
- **Dependency Conflicts**: Ensure all dependencies are compatible with each other, especially React and Remotion versions.
- **Incorrect Paths**: Double-check file paths in the component imports and video sources.
- **TypeScript Configuration**: If using TypeScript, ensure the `tsconfig.json` is correctly set up for JSX and React.
- **Rendering Issues**: If the render fails, check for console errors and ensure all components are correctly defined.

By following these steps, you will have a functional Remotion project scaffolded within the `onionreel/remotion` directory, ready for video composition and CLI rendering.
