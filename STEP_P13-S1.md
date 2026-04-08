# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. It includes setting up the necessary project structure, integrating a basic composition, and enabling CLI rendering capabilities.

## Inputs
- **Node.js**: Ensure Node.js (v14 or higher) is installed.
- **npm/yarn**: Package manager for dependency management.
- **Remotion CLI**: Required for rendering videos from the command line.
- **Project Directory**: `onionreel/remotion` must exist.

## Outputs
- A scaffolded Remotion project in `onionreel/remotion` with:
  - Basic composition files
  - Configured package.json
  - CLI rendering capability
- Example video output upon rendering.

## Steps
1. **Navigate to Project Directory**:
   ```bash
   cd onionreel/remotion
   ```

2. **Initialize Node Project**:
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

5. **Set Up Basic Composition**:
   In `src/Video.tsx`, add the following code:
   ```tsx
   import { Composition } from 'remotion';
   import { MyVideo } from './MyVideo';

   export const Video: React.FC = () => {
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

6. **Create Video Component**:
   In `src/MyVideo.tsx`, add:
   ```tsx
   import { useEffect } from 'react';

   export const MyVideo: React.FC = () => {
       useEffect(() => {
           console.log('Video is rendering');
       }, []);

       return <div>Hello, Remotion!</div>;
   };
   ```

7. **Update package.json for CLI**:
   Add the following scripts:
   ```json
   "scripts": {
       "build": "remotion build",
       "render": "remotion render src/Video.tsx MyVideo out/video.mp4"
   }
   ```

8. **Render Video**:
   Run the following command to render the video:
   ```bash
   npm run render
   ```

## Pitfalls
- **Node Version**: Ensure you are using a compatible Node.js version.
- **Incorrect Paths**: Double-check paths in imports and commands.
- **Dependency Issues**: If installation fails, clear npm/yarn cache and retry.
- **Rendering Errors**: Review console logs for any runtime errors during rendering.

By following these steps, you will successfully scaffold a Remotion project within OnionReel, ready for video rendering and further development.
