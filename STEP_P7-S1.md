# OnionReel v1 Artifact: Dashboard Data Layer v1 (Projects + Activity Log Persisted on Disk)

## Overview
The Dashboard Data Layer v1 aims to provide a structured way to persist project data and activity logs on disk. This will enhance user experience by allowing for quick access to project information and activity history, facilitating better project management and tracking.

## Inputs
- **Project Data**: Information about ongoing projects (e.g., project name, description, status, timestamps).
- **Activity Log**: User actions related to projects (e.g., task creation, updates, deletions).
- **Storage Mechanism**: Choice of file format (e.g., JSON, CSV) or database (e.g., SQLite).

## Outputs
- **Persisted Project Data**: A structured file or database containing all project-related information.
- **Persisted Activity Log**: A structured file or database containing logs of user activities.
- **API Endpoints**: RESTful endpoints for retrieving and updating project data and activity logs.

## Steps
1. **Define Data Structure**:
   - Create schemas for project data and activity logs.
   
2. **Choose Storage Mechanism**:
   - Decide between file-based storage (JSON/CSV) or a lightweight database (SQLite).

3. **Implement Data Persistence**:
   - Write functions to save and retrieve project data and activity logs.
   - Ensure data is saved in the chosen format.

4. **Create API Endpoints**:
   - Develop RESTful API endpoints for CRUD operations on projects and activity logs.

5. **Testing**:
   - Write unit tests to ensure data is correctly persisted and retrieved.
   - Conduct integration tests for API endpoints.

6. **Documentation**:
   - Document the data structures, API endpoints, and usage examples.

7. **Deployment**:
   - Package the artifact and deploy it to the production environment.

## Pitfalls
- **Data Integrity**: Ensure that data is not corrupted during read/write operations.
- **Concurrency Issues**: Handle simultaneous access to the data layer to prevent race conditions.
- **Performance**: Optimize data access times, especially if using file-based storage.
- **Error Handling**: Implement robust error handling for file I/O and database operations.
- **Versioning**: Plan for future updates and versioning of the data schema to accommodate changes. 

This artifact will serve as the foundational layer for the OnionReel dashboard, enabling efficient project management and activity tracking.
