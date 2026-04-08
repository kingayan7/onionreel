# OnionReel Dashboard UI Spec v1

## North-Star
**Goal:** Achieve the fastest production pipeline visibility and control for all users.

## User Roles
- **Operator:** Manages daily operations, oversees tasks and assets.
- **Producer:** Coordinates projects, manages deliverables and timelines.
- **Client:** Reviews project status, provides feedback, and approves deliverables.

## Screens

### 1. Home/Overview
- **Purpose:** Provide a snapshot of project health across all projects.
- **Core Widgets:**
  - Project health indicators (green/yellow/red status)
  - Summary of active projects
  - Quick stats (tasks overdue, pending approvals)
- **Key Actions:**
  - View detailed project reports
  - Filter by project status
- **Empty States:** "No projects available. Start a new project to see health metrics."

### 2. Projects List
- **Purpose:** Display all projects with essential details.
- **Core Widgets:**
  - Search bar
  - Project cards (name, status, due date)
  - Filters (by role, status, due date)
- **Key Actions:**
  - Create new project
  - Edit or delete existing projects
- **Empty States:** "No projects found. Create a project to begin."

### 3. Project Detail
- **Purpose:** Provide in-depth information about a specific project.
- **Core Widgets:**
  - Status overview (timeline, milestones)
  - Asset list (with upload/download options)
  - Task list (assigned, due dates)
  - Latest exports (download links)
- **Key Actions:**
  - Update project status
  - Add assets or tasks
- **Empty States:** "No tasks or assets added. Start by adding tasks or uploading assets."

### 4. Deliverables/Exports
- **Purpose:** Manage and review project deliverables and their versions.
- **Core Widgets:**
  - List of deliverables with version history
  - Variant options (resolution, format)
- **Key Actions:**
  - Upload new versions
  - Review and approve deliverables
- **Empty States:** "No deliverables available. Create a deliverable to track exports."

### 5. QC Dashboard
- **Purpose:** Monitor quality control metrics and blockers.
- **Core Widgets:**
  - Rubric scores (visual representation)
  - List of current blockers
- **Key Actions:**
  - Update QC scores
  - Resolve or escalate blockers
- **Empty States:** "No QC results available. Conduct QC checks to populate this dashboard."

### 6. Activity Log
- **Purpose:** Track all project-related activities and changes.
- **Core Widgets:**
  - Timeline of events (date, action, user)
  - Filters (by user, type of action)
- **Key Actions:**
  - Export activity log
- **Empty States:** "No activity recorded. Start working on projects to see logs."

### 7. Settings
- **Purpose:** Configure integrations and templates for projects.
- **Core Widgets:**
  - List of integrations (enabled/disabled)
  - Template management (create/edit/delete)
- **Key Actions:**
  - Add new integrations
  - Save template changes
- **Empty States:** "No integrations found. Set up integrations to enhance your workflow."

## Data Model Entities + Fields

### Project
- ID
- Name
- Status
- Due Date
- Owner (User ID)
- Created At
- Updated At

### Deliverable
- ID
- Project ID
- Name
- Type (video, audio, etc.)
- Status
- Created At
- Updated At

### Export
- ID
- Deliverable ID
- Version
- Date Created
- File Path
- Status

### Variant
- ID
- Export ID
- Resolution
- Format

### Asset
- ID
- Project ID
- Name
- Type
- File Path
- Status

### Task
- ID
- Project ID
- Title
- Assigned To (User ID)
- Due Date
- Status

### QCResult
- ID
- Deliverable ID
- Score
- Comments
- Date

### Blocker
- ID
- Project ID
- Description
- Status
- Assigned To (User ID)

### Template
- ID
- Name
- Type
- Content

## Events to Track + Audit Log Schema
- Event Type (create, update, delete)
- Entity Type (project, task, deliverable, etc.)
- Entity ID
- User ID
- Timestamp
- Details (JSON object for specifics)

## MVP vs V2 Scope
### MVP
- Home/Overview
- Projects List
- Project Detail
- Deliverables/Exports
- Activity Log

### V2
- QC Dashboard
- Settings
- Enhanced filtering and searching capabilities
- Advanced reporting features
