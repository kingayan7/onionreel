# OnionReel Artifact Store (MVP)

This is a minimal artifact store implementation: file/folder storage with meta.json + content.txt.

## Layout

- artifact_store/data/<projectId>/<artifactId>/meta.json
- artifact_store/data/<projectId>/<artifactId>/content.txt

Next: add query by type, version pointers, checksums, and wire to the dashboard + brain.
