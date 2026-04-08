# GitHub Persistence: Commit + Push Each Ship (Optional Toggle)

## Overview
This feature allows users to commit and push each ship to a designated GitHub repository, enabling version control and collaboration. Users can toggle this feature on or off based on their preferences.

## Inputs
- **GitHub Repository URL**: The URL of the repository where ships will be pushed.
- **Commit Message**: A customizable message for each commit.
- **Toggle Option**: A boolean option to enable or disable the commit/push feature.

## Outputs
- **GitHub Commit**: A new commit created in the specified repository.
- **GitHub Push**: The latest commit pushed to the remote repository.
- **Success/Failure Status**: Confirmation of the commit and push operation.

## Steps
1. **User Configuration**:
   - Prompt the user for the GitHub repository URL.
   - Ask for a commit message.
   - Provide an option to toggle the commit/push feature.

2. **Check Toggle Status**:
   - If the toggle is enabled, proceed to the next steps; if not, skip to the end.

3. **Initialize Git**:
   - Ensure the local directory is a Git repository.
   - If not, initialize a new Git repository.

4. **Stage Changes**:
   - Add the new ship files to the staging area.

5. **Create Commit**:
   - Commit the staged changes with the provided commit message.

6. **Push to GitHub**:
   - Push the commit to the specified GitHub repository.

7. **Return Status**:
   - Provide feedback to the user on the success or failure of the operation.

## Pitfalls
- **Authentication Issues**: Ensure proper GitHub authentication (e.g., SSH keys or personal access tokens).
- **Repository URL Errors**: Validate the repository URL to avoid push failures.
- **Local Repository State**: Ensure the local repository is clean before committing; handle uncommitted changes appropriately.
- **Network Issues**: Handle potential network errors during the push operation gracefully.
- **Toggle Misunderstanding**: Clearly communicate the toggle's function to avoid user confusion.

By following these guidelines, the GitHub persistence feature can be effectively implemented, enhancing the usability of OnionReel for version control.
