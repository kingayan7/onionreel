# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to establish a foundational structure that enables video composition and CLI rendering capabilities. 

## Inputs
- **Node.js**: Ensure Node.js is installed on your machine.
- **NPM/Yarn**: Package manager for installing dependencies.
- **Remotion CLI**: Command-line interface for Remotion.
- **Project Directory**: Path to `onionreel/remotion`.

## Outputs
- A scaffolded Remotion project structure within `onionreel/remotion`.
- Basic configuration files (`package.json`, `remotion.config.ts`).
- Example video composition components.
- CLI commands for rendering videos.

## Steps
1. **Navigate to Project Directory**:
   ```bash
   cd onionreel/remotion
   ```

2. **Initialize NPM/Yarn**:
   ```bash
   npm init -y
   # or
   yarn init -y
   ```

3. **Install Remotion**:
   ```bash
   npm install remotion
   # or
   yarn add remotion
   ```

4. **Create Remotion Configuration**:
   - Create a file named `remotion.config.ts` in the root directory:
     ```typescript
     import { defineConfig } from 'remotion';

     export default defineConfig({
       // Configuration options
       codec: 'h264',
       output: 'video.mp4',
       // Other configurations...
     });
     ```

5. **Set Up Video Composition**:
   - Create a `src` directory and add a sample video component:
     ```bash
     mkdir src
     touch src/MyVideo.tsx
     ```
   - Example content for `MyVideo.tsx`:
     ```tsx
     import { Video } from 'remotion';

     export const MyVideo: React.FC = () => {
       return <Video src="path/to/video.mp4" />;
     };
     ```

6. **Add CLI Scripts**:
   - Update `package.json` with render scripts:
     ```json
     "scripts": {
       "render": "remotion render src/MyVideo.tsx out/video.mp4"
     }
     ```

7. **Test the Setup**:
   - Run the render command:
     ```bash
     npm run render
     # or
     yarn render
     ```

## Pitfalls
- **Dependency Issues**: Ensure all dependencies are compatible with your Node.js version.
- **File Paths**: Verify that video file paths in components are correct.
- **Rendering Errors**: Check console logs for errors during rendering; they may indicate missing configurations or incorrect component implementations.
- **Environment Setup**: Ensure that your local environment has sufficient resources (CPU, RAM) for video rendering tasks.

By following these steps, you will have a functional Remotion project scaffolded within `onionreel/remotion`, ready for video composition and rendering.
