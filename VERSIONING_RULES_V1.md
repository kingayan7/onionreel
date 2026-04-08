# OnionReel Versioning Rules v1

## Naming Conventions

### Projects
- Use the format: `ClientName_ProjectName_YYYYMMDD`
- Example: `AcmeCorp_AdCampaign_20231001`

### Sequences
- Use the format: `ProjectName_SequenceDescription`
- Example: `AdCampaign_IntroSequence`

### Shots
- Use the format: `SequenceName_ShotNumber`
- Example: `IntroSequence_Shot01`

### Timelines
- Use the format: `ProjectName_TimelineDescription`
- Example: `AdCampaign_FinalEdit`

### Exports
- Use the format: `ProjectName_ExportDescription_Version`
- Example: `AdCampaign_FinalCut_V1`

### Versions
- Increment version number for each new export or variant.
- Use the format: `v#` where # is the version number.
- Example: `v2`

## Variant Naming
- Use the format: `Platform_AspectRatio_Duration_HookID_CTAID_v#`
- Example: `Instagram_16x9_30s_Hook123_CTA456_v1`

## Approval Workflow
- **Draft**: Initial version created.
- **Internal QC**: Quality check by internal team.
- **Client Review**: Send to client for feedback.
- **Approved**: Client approval received.
- **Shipped**: Final version delivered.

## Version Bump vs New Variant
- **Version Bump**: Minor changes, fixes, or adjustments to an existing variant.
- **New Variant**: Significant changes, new platforms, or different aspect ratios.

## Changelog Format
- Use single-line entries for each change.
- Format: `YYYY-MM-DD: Description of change.`
- Example: `2023-10-01: Updated graphics for Hook123 variant.`
- Changelog lives in `memory log` and `/onionreel/CHANGELOG.md`.

## No Silent Overwrites Rules
- Always create a new version for any changes.
- Do not replace existing files without versioning.

## File/Folder Structure Recommendations
- **Project Folder**
  - `/assets`: Store all media files.
  - `/sequences`: Store sequence files.
  - `/timelines`: Store timeline files.
  - `/exports`: Store export files.
  - `/changelog`: Store CHANGELOG.md file.
  - `/qc`: Store QC reports.

## QC Gates Before Marking Roadmap Step DONE
- Ensure all elements pass internal QC.
- Confirm client feedback is addressed.
- Validate that all documentation is updated (including changelog).
- Review file structure for completeness. 

By adhering to these rules, we ensure a consistent and efficient workflow across all OnionReel projects.
