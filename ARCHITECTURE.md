# OnionReel Architecture (draft)

## Principle
Mirror the Growth OS pattern:
- **Dashboard** = human controls + visibility
- **Brain** = orchestration (jobs, rules, retries, audit logs)
- **Knowledge** = reusable SOPs + prompts + templates

## Brain (services)
- Task queue: discrete jobs (e.g., "Generate shot list", "QC audio")
- Artifact store: scripts, boards, shot lists, exports, versions
- Evaluators: quality rubrics per platform/output
- Connectors: Drive/Frame.io/local folder/NLE exports

## Dashboard (modules)
- Projects
- Briefs
- Scripts
- Storyboards
- Shot lists
- Assets
- Review/Approvals
- Exports/Deliverables
- Quality (QC reports)

## Data model (high level)
- Project
- Brief
- Artifact (type, version, path/url, metadata)
- Task (status, inputs, outputs, logs)
- StylePack (look, sound, pacing, brand rules)
