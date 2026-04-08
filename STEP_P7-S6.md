# OnionReel: Telegram Control Surface v1 (Commands: /status, /run, /projects)

## Overview
The Telegram Control Surface v1 allows users to interact with OnionReel via Telegram. This artifact implements three primary commands: `/status`, `/run`, and `/projects`. Each command provides essential functionalities for monitoring and managing OnionReel operations directly from Telegram.

## Inputs
- **Telegram Bot Token**: Required for bot authentication.
- **User ID**: To manage permissions and access control.
- **OnionReel API Endpoint**: URL for interacting with the OnionReel backend.
- **Command Parameters**: Specific parameters for each command (if applicable).

## Outputs
- **/status**: Returns the current status of OnionReel (e.g., running, idle, error).
- **/run**: Executes a specified task or job and returns the result or confirmation.
- **/projects**: Lists all active projects with relevant details (e.g., project name, status).

## Steps
1. **Set Up Telegram Bot**:
   - Create a new bot via BotFather on Telegram.
   - Obtain the bot token and set up webhook for incoming messages.

2. **Implement Command Handlers**:
   - Create functions for each command (`/status`, `/run`, `/projects`).
   - Use the Telegram Bot API to parse incoming messages and trigger the appropriate handler.

3. **Integrate with OnionReel API**:
   - Implement API calls to OnionReel for each command.
     - `/status`: GET request to fetch current status.
     - `/run`: POST request to execute a task.
     - `/projects`: GET request to list active projects.

4. **Response Formatting**:
   - Format responses for Telegram (e.g., Markdown or plain text).
   - Ensure messages are concise and informative.

5. **Testing**:
   - Test each command in a controlled environment.
   - Validate responses and error handling.

6. **Deployment**:
   - Deploy the bot to a cloud service (e.g., Heroku, AWS).
   - Ensure the webhook is correctly configured.

## Pitfalls
- **Authentication Issues**: Ensure the bot token is kept secure and not hard-coded.
- **Rate Limiting**: Be aware of Telegram's rate limits; implement throttling if necessary.
- **Error Handling**: Gracefully handle API errors and provide meaningful feedback to users.
- **User Permissions**: Implement checks to ensure only authorized users can execute certain commands.
- **Testing Environment**: Test thoroughly in a sandbox to avoid affecting production data.

By following this roadmap, the Telegram Control Surface v1 will provide a seamless integration for users to manage OnionReel effectively.
