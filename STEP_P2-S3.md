# OnionReel v1 Artifact: Versioning Rules (P2-S3)

## Overview
This artifact outlines the versioning rules for OnionReel, detailing the naming conventions, approval processes, and changelog management to ensure consistency and clarity in software releases.

## Inputs
- **Current Version**: The existing version of OnionReel.
- **Change Types**: List of changes (e.g., features, bug fixes, breaking changes).
- **Approval Stakeholders**: List of team members or roles required for approval.
- **Changelog Template**: Predefined format for documenting changes.

## Outputs
- **Version Number**: A new version number following semantic versioning (e.g., MAJOR.MINOR.PATCH).
- **Approval Workflow**: Documented process for obtaining necessary approvals.
- **Changelog Entry**: A formatted entry summarizing changes made in the release.

## Steps
1. **Determine Change Type**:
   - Identify if changes are major, minor, or patches based on the following:
     - **Major**: Breaking changes that require user intervention.
     - **Minor**: New features that are backward-compatible.
     - **Patch**: Backward-compatible bug fixes.

2. **Update Version Number**:
   - Increment the version number according to the change type:
     - Major: Increment the MAJOR version and reset MINOR and PATCH.
     - Minor: Increment the MINOR version and reset PATCH.
     - Patch: Increment the PATCH version.

3. **Document Changes**:
   - Use the changelog template to summarize changes made.
   - Include sections for added features, fixed bugs, and breaking changes.

4. **Approval Process**:
   - Submit the new version number and changelog for approval.
   - Ensure all relevant stakeholders review and approve the changes.

5. **Release**:
   - Once approved, tag the release in the version control system.
   - Publish the new version and update any relevant documentation.

## Pitfalls
- **Inconsistent Versioning**: Ensure all team members understand and adhere to the versioning rules to avoid discrepancies.
- **Lack of Clarity in Changelog**: Be specific and clear in documenting changes to avoid confusion among users.
- **Neglecting Approvals**: Skipping the approval process can lead to unvetted changes being released, resulting in potential issues.
- **Ignoring Semantic Versioning**: Failing to follow semantic versioning can lead to misunderstandings about the impact of changes on users.
