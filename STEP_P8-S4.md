# OnionReel v1 Artifact: One-Command Local Start Script

## Overview
This artifact provides a one-command script to start both the dashboard and the job runner loop for OnionReel. It simplifies the local development environment setup, allowing developers to quickly launch the application with minimal configuration.

## Inputs
- **Environment Variables**: 
  - `PORT`: Port number for the dashboard (default: 3000)
  - `JOB_INTERVAL`: Time interval for the job runner loop in milliseconds (default: 5000)
- **Dependencies**: Ensure that Node.js and npm are installed.

## Outputs
- **Running Services**: 
  - Dashboard accessible at `http://localhost:<PORT>`
  - Job runner loop executing tasks at specified intervals
- **Log Output**: Console logs for both dashboard and job runner to track activity and errors.

## Steps
1. **Create Start Script**:
   - Write a shell script (e.g., `start.sh`) with the following content:
     ```bash
     #!/bin/bash
     PORT=${PORT:-3000}
     JOB_INTERVAL=${JOB_INTERVAL:-5000}

     echo "Starting dashboard on port $PORT..."
     (npm run start:dashboard -- --port $PORT) &

     echo "Starting job runner loop with interval $JOB_INTERVAL ms..."
     (npm run start:job-runner -- --interval $JOB_INTERVAL) &

     wait
     ```

2. **Make Script Executable**:
   - Run `chmod +x start.sh` to make the script executable.

3. **Run the Script**:
   - Execute the script with `./start.sh`.

4. **Verify Services**:
   - Check the console logs to confirm both services are running.
   - Access the dashboard via the specified port in a web browser.

## Pitfalls
- **Port Conflicts**: Ensure the specified port is not already in use. Use `lsof -i :<PORT>` to check.
- **Environment Variables**: If not set, defaults will be used. Ensure they meet your requirements.
- **Script Permissions**: Ensure the script has the correct permissions to execute.
- **Background Processes**: The script runs services in the background; ensure proper logging to track issues.
- **Dependency Issues**: Ensure all required npm packages are installed before running the script.

By following this guide, you can efficiently set up a local OnionReel environment with a single command, streamlining your development process.
