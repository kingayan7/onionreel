# OnionReel v1 Artifact: P13-S1 - Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to set up a basic Remotion project that supports composition and CLI rendering, enabling users to create and render videos programmatically.

## Inputs
- **Node.js**: Ensure Node.js (v14 or higher) is installed.
- **npm/yarn**: Package manager for installing dependencies.
- **Remotion CLI**: Required for rendering videos from the command line.
- **Project Directory**: Path to `onionreel/remotion`.

## Outputs
- A scaffolded Remotion project structure within `onionreel/remotion`.
- Basic configuration files (e.g., `package.json`, `remotion.config.ts`).
- Sample video composition files.
- CLI commands for rendering.

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

4. **Create Basic Project Structure**:
   - Create directories:
     ```bash
     mkdir src
     mkdir src/compositions
     ```
   - Create a sample composition file:
     ```bash
     touch src/compositions/HelloWorld.tsx
     ```

5. **Add Sample Composition Code**:
   ```tsx
   // src/compositions/HelloWorld.tsx
   import { Composition } from 'remotion';
   import { Hello } from './Hello';

   export const HelloWorld: React.FC = () => {
     return (
       <Composition
         id="HelloWorld"
         component={Hello}
         durationInFrames={60}
         fps={30}
         width={1920}
         height={1080}
       />
     );
   };
   ```

6. **Create Hello Component**:
   ```tsx
   // src/compositions/Hello.tsx
   import React from 'react';

   export const Hello: React.FC = () => {
     return <h1>Hello, Remotion!</h1>;
   };
   ```

7. **Configure Remotion**:
   - Create `remotion.config.ts`:
     ```ts
     import { registerRoot } from 'remotion';
     import { HelloWorld } from './src/compositions/HelloWorld';

     registerRoot(HelloWorld);
     ```

8. **Add CLI Render Script**:
   - Update `package.json`:
     ```json
     "scripts": {
       "build": "remotion build",
       "render": "remotion render src/compositions/HelloWorld.tsx output/video.mp4"
     }
     ```

9. **Test the Setup**:
   - Run the render command:
     ```bash
     npm run render
     ```

## Pitfalls
- **Node Version**: Ensure the correct Node.js version is used; incompatible versions can lead to installation issues.
- **Dependencies**: Missing or incorrect dependencies can cause runtime errors. Always check the `package.json` for completeness.
- **File Paths**: Ensure all file paths are correct, especially in imports. Incorrect paths will lead to module not found errors.
- **Rendering Issues**: If rendering fails, check for errors in the console and ensure all components are correctly defined and exported.

This scaffold provides a solid foundation for building and rendering videos using Remotion within the OnionReel project.
