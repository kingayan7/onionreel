# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to enable video composition and CLI rendering capabilities, providing a foundation for future enhancements.

## Inputs
- **Node.js**: Ensure Node.js is installed (version 14.x or higher).
- **Yarn**: Install Yarn globally if not already installed.
- **Remotion**: Use the latest version of Remotion.

## Outputs
- A scaffolded Remotion project structure within `onionreel/remotion`.
- Basic configuration files (e.g., `package.json`, `tsconfig.json`).
- Sample video composition files.
- CLI render script for generating videos.

## Steps
1. **Create Directory**:
   ```bash
   mkdir -p onionreel/remotion
   cd onionreel/remotion
   ```

2. **Initialize Node Project**:
   ```bash
   yarn init -y
   ```

3. **Install Remotion**:
   ```bash
   yarn add remotion
   ```

4. **Set Up TypeScript**:
   ```bash
   yarn add --dev typescript @types/node
   npx tsc --init
   ```

5. **Create Project Structure**:
   - Create directories:
     ```bash
     mkdir src
     mkdir src/Video
     ```

   - Create sample video component:
     ```javascript
     // src/Video/MyVideo.tsx
     import { Composition } from 'remotion';

     export const MyVideo = () => {
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

6. **Create CLI Render Script**:
   - Add a render script in `package.json`:
     ```json
     "scripts": {
       "render": "remotion render src/Video/MyVideo.tsx MyVideo.mp4"
     }
     ```

7. **Test the Setup**:
   - Run the render command:
     ```bash
     yarn render
     ```

## Pitfalls
- **Node Version Compatibility**: Ensure the Node.js version is compatible with Remotion.
- **TypeScript Configuration**: Incorrect `tsconfig.json` settings can lead to compilation errors.
- **Missing Dependencies**: Ensure all required packages are installed; missing dependencies can break the build.
- **File Structure**: Maintain the correct directory structure to avoid import errors.

This artifact serves as a foundational step for integrating Remotion into the OnionReel project, enabling video composition and rendering capabilities.
