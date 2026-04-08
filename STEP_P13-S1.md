# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to set up a basic structure that allows for composition of video components and CLI rendering.

## Inputs
- **Node.js**: Ensure Node.js is installed (v14 or higher recommended).
- **Yarn**: Install Yarn globally for package management.
- **Remotion CLI**: Familiarity with Remotion CLI commands.

## Outputs
- A scaffolded Remotion project structure inside `onionreel/remotion`.
- Basic video component templates.
- CLI scripts for rendering videos.

## Steps
1. **Navigate to the Project Directory**
   ```bash
   cd onionreel/remotion
   ```

2. **Initialize a New Remotion Project**
   ```bash
   npx create-remotion@latest
   ```
   - Follow prompts to set up the project.

3. **Install Dependencies**
   ```bash
   cd <remotion-project-name>
   yarn install
   ```

4. **Create Basic Video Components**
   - Inside the `src` directory, create a folder named `Video`.
   - Add a file `MyVideo.tsx` with a simple video component:
     ```tsx
     import { Composition } from 'remotion';
     import { YourComponent } from './YourComponent';

     export const MyVideo: React.FC = () => {
       return (
         <Composition
           id="MyVideo"
           component={YourComponent}
           durationInFrames={150}
           fps={30}
           width={1920}
           height={1080}
         />
       );
     };
     ```

5. **Set Up CLI Rendering Scripts**
   - In `package.json`, add a script for rendering:
     ```json
     "scripts": {
       "render": "remotion render MyVideo out/video.mp4"
     }
     ```

6. **Test the Setup**
   - Run the following command to render the video:
     ```bash
     yarn render
     ```
   - Check the `out` directory for the generated video.

## Pitfalls
- **Node Version Compatibility**: Ensure that the Node.js version meets the requirements of Remotion.
- **Dependency Conflicts**: Watch for any conflicts in package versions, especially if integrating with existing OnionReel dependencies.
- **File Structure**: Maintain the correct file structure to avoid issues with component imports.
- **Rendering Errors**: If rendering fails, check console logs for missing dependencies or incorrect component configurations.

By following these steps, you will have a functional Remotion project scaffolded within OnionReel, ready for further development and enhancements.
