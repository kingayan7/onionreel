# OnionReel Brain v1 — Integrations Spec v1

## Integration Goals
1. Streamline media asset management across Drive, Frame.io, Telegram, and NLEs.
2. Facilitate seamless review and approval workflows.
3. Ensure error notifications and status updates are communicated effectively.
4. Standardize export conventions for NLEs.

## Non-Goals
1. Implement full-fledged project management features.
2. Support for non-standard NLEs or media platforms.
3. Real-time collaboration features beyond notifications.

---

## Drive Integration

### Folder Layout
- Root folder: `OnionReelProjects`
- Subfolders: 
  - `Assets`
  - `Exports`
  - `Reviews`
  - `FinalDeliverables`

### Upload Policy
- All uploads must be in approved formats (e.g., .mp4, .mov).
- Assets must be uploaded to the `Assets` folder only.

### Naming Conventions
- Use format: `ProjectName_AssetType_Version.ext` (e.g., `ProjectX_Video_v1.mp4`).

### Permissions
- Read/Write access for project team members.
- Read-only access for external reviewers.

---

## Frame.io Integration

### Review Links
- Generate unique review links for each asset uploaded.
- Links expire after 30 days.

### Version Posting
- Automatically post new versions of assets upon upload.
- Maintain a version history for each asset.

### Comments Ingestion
- Pull comments from Frame.io and associate them with the respective asset in Drive.
- Notify team members of new comments via Telegram.

---

## Telegram Integration

### Status Pings
- Send status updates on uploads, reviews, and approvals to a designated channel.
- Include asset name and link to the Drive location.

### Approvals
- Allow team members to approve or reject assets via Telegram commands.
- Capture approval status and update the asset in Drive.

### Error Alerts
- Notify the team of any errors during uploads or processing.
- Include error details and suggested actions.

### Commands
- `/approve [asset_name]`
- `/reject [asset_name]`
- `/status [project_name]`

---

## NLE Exports

### Export Conventions
- Premiere: Use Adobe Media Encoder settings for H.264.
- Resolve: Use optimized media settings for delivery.
- Final Cut: Export using ProRes 422 HQ.

### Proxies
- Generate proxy files for all high-resolution assets.
- Store proxies in the `Proxies` subfolder of Drive.

### Deliverables
- Final exports must be stored in the `FinalDeliverables` folder.
- Use consistent naming: `ProjectName_Final_v1.ext`.

---

## Webhook/Event Model

### Drive
- Listen for new file uploads and folder changes.

### Frame.io
- Listen for new comments and version uploads.

### Telegram
- Listen for approval/rejection commands.

### NLE
- Listen for export completion events.

---

## Auth Strategy

### Drive
- Use OAuth 2.0 for user authentication.

### Frame.io
- Use API key for integration.

### Telegram
- Use Bot Token for command execution.

### NLE
- No authentication required; local integration.

---

## Failure Modes + Retries + Audit Logs

### Failure Modes
- Upload failures (Drive)
- Comment ingestion failures (Frame.io)
- Command execution failures (Telegram)

### Retries
- Implement exponential backoff for retries on failures.
- Retry up to 3 times before logging the error.

### Audit Logs
- Maintain logs for all integration actions.
- Include timestamps, user actions, and error messages.

---

## Acceptance Criteria for “Integrations Spec v1 Complete”
1. All integration goals are met with no non-goals addressed.
2. Documented folder structure and naming conventions are implemented in Drive.
3. Frame.io review links and comments are functioning as specified.
4. Telegram notifications and commands are operational.
5. NLE export conventions are validated and implemented.
6. Webhook/event model is fully operational.
7. Authentication strategies are secure and functioning.
8. Failure modes, retries, and audit logs are implemented and tested.
9. Integration is tested end-to-end and meets performance benchmarks.
