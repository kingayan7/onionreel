# OnionReel v1 Artifact: Scaffold Remotion Project

## Overview
This artifact outlines the steps to scaffold a Remotion project within the `onionreel/remotion` directory. The goal is to enable video composition and CLI rendering capabilities, ensuring a smooth integration with OnionReel's existing architecture.

## Inputs
- **Node.js**: Ensure Node.js is installed (version 14 or higher).
- **Remotion CLI**: Install the Remotion CLI globally.
- **Git**: Version control system for managing project changes.
- **Existing OnionReel Repository**: Clone the OnionReel repository to your local machine.

## Outputs
- A scaffolded Remotion project located in `onionreel/remotion`.
- Basic project structure including:
  - `src` directory for video components.
  - `public` directory for static assets.
  - Configuration files (`package.json`, `remotion.config.ts`).
- Functional CLI commands for rendering videos.

## Steps
1. **Clone OnionReel Repository**
   ```bash
   git clone <repository-url>
   cd onionreel
   ```

2. **Install Remotion CLI**
   ```bash
   npm install -g remotion
   ```

3. **Create Remotion Project Structure**
   ```bash
   mkdir remotion
   cd remotion
   npx create-remotion@latest
   ```

4. **Configure Remotion**
   - Modify `remotion.config.ts` to set up video dimensions and other settings.
   - Ensure the entry point for the video is correctly defined.

5. **Add Sample Video Component**
   - Create a sample video component in the `src` directory.
   - Export the component to be used in the main video.

6. **Update `package.json` Scripts**
   - Add scripts for rendering and previewing videos:
   ```json
   "scripts": {
     "start": "remotion preview",
     "build": "remotion render <VideoComponent> <OutputPath>"
   }
   ```

7. **Test the Setup**
   - Run the preview command:
   ```bash
   npm start
   ```
   - Render a sample video:
   ```bash
   npm run build
   ```

8. **Commit Changes**
   ```bash
   git add remotion
   git commit -m "Scaffolded Remotion project"
   ```

## Pitfalls
- **Node Version Compatibility**: Ensure you are using a compatible Node.js version to avoid dependency issues.
- **Global Dependencies**: If the Remotion CLI is not installed globally, commands may fail. Verify installation with `remotion --version`.
- **File Structure**: Ensure the correct directory structure is maintained to avoid import errors.
- **Configuration Errors**: Double-check the `remotion.config.ts` for any misconfigurations that could affect rendering.
- **Sample Component**: Ensure the sample component is functional; otherwise, the preview and render commands will fail.

By following these steps, you will successfully scaffold a Remotion project within OnionReel, enabling video composition and rendering capabilities.
