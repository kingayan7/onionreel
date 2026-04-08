# OnionReel Dashboard MVP Implementation Plan v1

## Tech Assumptions
- **Frontend**: React or Vue.js for dynamic UI components.
- **Backend**: Node.js with Express for RESTful API.
- **Database**: NoSQL (e.g., MongoDB) for flexibility and scalability.
- **Authentication**: JWT for secure user sessions.
- **Hosting**: Cloud provider (e.g., AWS, Azure) for deployment.
- **State Management**: Redux or Vuex for managing application state.

## Data Model
1. **Users Collection**
   - Fields: 
     - userId (String, unique, indexed)
     - username (String, unique, indexed)
     - email (String, unique, indexed)
     - passwordHash (String)
     - createdAt (Date)
   - Indexes: userId, username, email

2. **Projects Collection**
   - Fields:
     - projectId (String, unique, indexed)
     - userId (String, indexed)
     - title (String)
     - description (String)
     - createdAt (Date)
   - Indexes: projectId, userId

3. **Metrics Collection**
   - Fields:
     - metricId (String, unique, indexed)
     - projectId (String, indexed)
     - timestamp (Date)
     - value (Number)
   - Indexes: metricId, projectId, timestamp

## API Endpoints
1. **User Registration**
   - Request: POST /api/users/register
     - Body: { username, email, password }
   - Response: { userId, username, email }

2. **User Login**
   - Request: POST /api/users/login
     - Body: { username, password }
   - Response: { token, userId }

3. **Create Project**
   - Request: POST /api/projects
     - Body: { userId, title, description }
   - Response: { projectId, title, createdAt }

4. **Get Projects**
   - Request: GET /api/projects
     - Query: { userId }
   - Response: [{ projectId, title, description, createdAt }]

5. **Log Metric**
   - Request: POST /api/metrics
     - Body: { projectId, timestamp, value }
   - Response: { metricId, projectId, timestamp, value }

6. **Get Metrics**
   - Request: GET /api/metrics
     - Query: { projectId }
   - Response: [{ metricId, timestamp, value }]

## Event Log + Audit Trail
- Log all API requests and responses for user actions.
- Store logs in a separate collection: `EventLog`
  - Fields: 
    - eventId (String, unique, indexed)
    - userId (String, indexed)
    - action (String)
    - timestamp (Date)
    - details (Object)

## UI Implementation Plan
1. **User Registration/Login Screen**
   - Build forms for user registration and login.
   - Implement validation and error handling.

2. **Dashboard Screen**
   - Display list of projects with options to create new projects.
   - Integrate project creation functionality.

3. **Project Metrics Screen**
   - Create a view to log metrics for selected projects.
   - Implement graphing library for visualizing metrics.

4. **Settings Screen**
   - Provide options for user settings (e.g., password change).

## Milestones
- **Week 1**
  - Set up project structure and environment.
  - Implement user registration and login API.
  - Build user registration/login UI.

- **Week 2**
  - Implement project creation API.
  - Build dashboard UI for project management.
  - Implement metrics logging API.

## Acceptance Criteria for MVP Completion
- Users can register and log in.
- Users can create and view projects.
- Users can log metrics and view them in a dashboard.
- Event logging is functional and captures user actions.

## Risks + Mitigations
1. **User Data Security**
   - Mitigation: Use strong hashing for passwords and secure JWT tokens.

2. **API Performance**
   - Mitigation: Optimize database queries and implement caching where necessary.

3. **Scope Creep**
   - Mitigation: Clearly define MVP features and prioritize accordingly.

4. **User Adoption**
   - Mitigation: Conduct user testing and gather feedback for improvements before launch.
