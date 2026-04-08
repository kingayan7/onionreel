# OnionReel Brain v1 — Artifact Store Spec v1

## Purpose
The Artifact Store is designed to store every artifact produced by the pipeline, including but not limited to documentation, exports, variants, and quality control (QC) results. This centralized repository ensures that all artifacts are easily accessible, versioned, and retrievable for future reference and compliance.

## Artifact Types
The following artifact types will be supported:
1. Brief
2. Script
3. Storyboard
4. ShotList
5. EditPlan
6. Export
7. Variant
8. CaptionSRT
9. QCResult
10. LogEntry

## Versioning Rules
- **Immutable Artifacts**: Once an artifact is stored, it cannot be altered. New versions must be created for any changes.
- **Pointers to Latest**: Each artifact will maintain a pointer to its latest version, allowing quick access without needing to sift through historical versions.

## Naming + IDs
Each artifact will have the following identifiers:
- **artifactId**: Unique identifier for the artifact.
- **projectId**: Identifier for the project to which the artifact belongs.
- **deliverableId**: Identifier for the specific deliverable associated with the artifact.
- **variantId**: Identifier for any variants of the artifact.

## Storage Layout
The storage layout will follow a hierarchical folder structure:
```
/artifacts
  /{projectId}
    /{deliverableId}
      /{variantId}
        /{artifactType}
          /{artifactId}
            artifactFile
            metadata.json
```
Each artifact's folder will contain the artifact file and a metadata sidecar file named `metadata.json`.

## Metadata Schema
Each `metadata.json` file will include the following fields (all required):
- `artifactId`: Unique identifier for the artifact.
- `projectId`: Identifier for the project.
- `deliverableId`: Identifier for the deliverable.
- `variantId`: Identifier for the variant.
- `artifactType`: Type of the artifact.
- `version`: Version number of the artifact.
- `createdAt`: Timestamp of creation.
- `updatedAt`: Timestamp of the last update.
- `checksum`: SHA256 checksum for integrity verification.

## Retrieval Queries
The Artifact Store will support the following retrieval queries:
- List artifacts by `projectId`.
- List artifacts by `deliverableId`.
- List artifacts by `variantId`.
- List artifacts by `createdAt` timestamp range.

## Integrity
- **Checksums**: Each artifact will have a SHA256 checksum stored in its metadata to ensure data integrity.
- **Deduplication**: The system will check for existing artifacts before storing new ones to prevent duplicates.
- **Audit Trail**: All actions (creation, retrieval, deletion) will be logged to maintain an audit trail.

## Access Control Notes (Future)
Access control mechanisms will be implemented to restrict access based on user roles. Future enhancements will include user authentication, permission settings, and audit logging for access events.

## Acceptance Criteria for “Artifact Store v1 Complete”
1. All specified artifact types are supported and can be stored.
2. Versioning rules are implemented and functional.
3. Naming conventions and IDs are consistently applied.
4. The storage layout is established and operational.
5. Metadata schema is defined and validated for all artifact types.
6. Retrieval queries are functional and return expected results.
7. Integrity checks (checksums, deduplication, audit trails) are implemented.
8. Basic access control measures are defined for future implementation. 

This specification outlines the foundational requirements for the Artifact Store, ensuring a robust and scalable solution for managing artifacts within the OnionReel pipeline.
