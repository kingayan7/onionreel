# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to set up a basic structure that allows for video composition and CLI rendering, enabling users to create and render videos programmatically.

## Inputs
- **Node.js**: Ensure Node.js (v14 or higher) is installed.
- **npm or yarn**: Package manager for dependencies.
- **Remotion CLI**: The command-line interface for Remotion.
- **Project Directory**: The path where the Remotion project will be scaffolded (e.g., `onionreel/remotion`).

## Outputs
- A scaffolded Remotion project with:
  - Basic project structure
  - Sample video composition
  - CLI render configuration
- Documentation for usage and commands.

## Steps
1. **Create Project Directory**:
   ```bash
   mkdir -p onionreel/remotion
   cd onionreel/remotion
   ```

2. **Initialize npm**:
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
   touch src/index.ts
   ```

5. **Set Up Sample Composition**:
   - Edit `src/index.ts` to include a basic video component:
   ```typescript
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

6. **Create Sample Video Component**:
   - Create `src/MyVideo.tsx`:
   ```typescript
   import { Video } from 'remotion';

   export const MyVideo = () => {
     return (
       <Video src="path/to/video.mp4" />
     );
   };
   ```

7. **Add CLI Render Script**:
   - Update `package.json` to include a render script:
   ```json
   "scripts": {
     "render": "remotion render src/index.tsx MyVideo out/video.mp4"
   }
   ```

8. **Test the Setup**:
   - Run the render command:
   ```bash
   npm run render
   ```

## Pitfalls
- **Incorrect Node.js Version**: Ensure you are using a compatible Node.js version.
- **Missing Dependencies**: Double-check that all required packages are installed.
- **File Paths**: Ensure that paths to video files in the components are correct.
- **TypeScript Errors**: If using TypeScript, ensure proper type definitions are in place to avoid compilation errors.

By following these steps, you will successfully scaffold a Remotion project within the OnionReel repository, enabling video composition and rendering capabilities.
