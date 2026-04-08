# GitHub Persistence: Commit + Push Each Ship (Optional Toggle)

## Overview
Implement a feature in OnionReel that allows users to commit and push each ship (release) to a specified GitHub repository. This feature will be optional and can be toggled on or off by the user. The goal is to enhance version control and collaboration by automatically saving each release to GitHub.

## Inputs
- **GitHub Repository URL**: The URL of the GitHub repository where the ships will be pushed.
- **Commit Message**: A customizable message for the commit.
- **Toggle Option**: A boolean flag to enable or disable the commit and push feature.
- **Authentication**: GitHub credentials or token for authentication.

## Outputs
- **Commit Status**: Success or failure message indicating the result of the commit and push operation.
- **GitHub URL**: Direct link to the newly created commit in the repository.
- **Error Logs**: Detailed logs in case of failure, including reasons for any issues encountered.

## Steps
1. **User Input**: Capture the GitHub repository URL, commit message, and toggle option.
2. **Authentication**: Validate GitHub credentials or token.
3. **Check Toggle**: If the toggle is enabled, proceed with the following steps; otherwise, skip to the end.
4. **Initialize Git**: Ensure the local Git repository is initialized.
5. **Add Changes**: Stage the changes related to the current ship.
6. **Commit Changes**: Commit the changes with the provided commit message.
7. **Push Changes**: Push the commit to the specified branch in the GitHub repository.
8. **Return Status**: Provide feedback on the success or failure of the commit and push operation, including the commit URL if successful.

## Pitfalls
- **Authentication Issues**: Incorrect credentials or token can prevent access to the repository.
- **Network Connectivity**: Loss of internet connection can interrupt the push operation.
- **Git Configuration**: Ensure that the local Git configuration is set up correctly (e.g., user name and email).
- **Merge Conflicts**: Pushing changes may result in conflicts if the remote repository has been updated since the last pull.
- **Toggle Misconfiguration**: Users may forget to toggle the option, leading to unexpected behavior.

By following this roadmap step, OnionReel will enhance its version control capabilities, making it easier for users to manage their releases effectively.
