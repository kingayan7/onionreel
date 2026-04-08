# OnionReel Scale Plan v1

## 1. Roles/Permissions Model

### 1.1 Roles
- **Operator**: Full access to all system features, including user management, project settings, and analytics.
- **Producer**: Access to create and manage projects, view analytics, and initiate billing processes. Limited access to user management.
- **Client**: View-only access to their projects, analytics, and approval workflows. No management capabilities.

### 1.2 Granular Scopes
- **Project Management**: Create, edit, delete projects.
- **User Management**: Add/remove users, assign roles.
- **Analytics Access**: View pipeline speed, QC pass rates, etc.
- **Billing Management**: Access billing information, usage metrics, and payment methods.
- **Approval Workflow**: Initiate and approve revisions.

## 2. Analytics Events

### 2.1 Key Metrics
- **Pipeline Speed**: Measure time taken from project initiation to completion.
- **QC Pass Rates**: Percentage of projects passing quality control on first submission.
- **Revision Loops**: Count of revisions required before final approval.
- **Approvals Time**: Average time taken for client approvals on revisions.

### 2.2 Data Collection
- Implement event tracking for each metric.
- Store data for analysis and reporting.

## 3. Billing Hooks

### 3.1 Billing Models
- **Usage-Based**: Charge clients based on metrics such as:
  - Number of projects created.
  - Total pipeline processing time.
  - Number of revisions processed.
- **Subscription**: Fixed monthly/annual fee for access to the platform, with tiered pricing based on user roles or project limits.

### 3.2 What to Meter
- Track project creation, pipeline duration, QC passes, and revisions.
- Monitor user activity for subscription tier adjustments.

## 4. Data Retention + Audit Considerations

### 4.1 Data Retention Policy
- Retain analytics data for a minimum of 24 months.
- Archive older data for compliance and historical analysis.

### 4.2 Audit Considerations
- Maintain logs of user actions, including project changes and billing adjustments.
- Ensure audit trails are immutable and accessible for compliance reviews.

## 5. Acceptance Criteria

### 5.1 Role Functionality
- Verify that each role can only access the features and data permitted by their scope.
- Ensure that user management functions correctly, allowing role assignments and removals.

### 5.2 Analytics Accuracy
- Confirm that analytics events are accurately tracked and reported.
- Validate metrics against manual calculations for accuracy.

### 5.3 Billing Functionality
- Test usage-based billing calculations against actual usage data.
- Ensure subscription models are correctly applied based on user roles.

### 5.4 Data Retention Compliance
- Review data retention practices to ensure compliance with policies.
- Validate that audit logs are correctly maintained and accessible.

### 5.5 User Experience
- Gather feedback from users on role clarity and ease of access.
- Ensure that analytics dashboards are intuitive and actionable.

## Conclusion
The OnionReel Scale Plan v1 outlines a comprehensive approach to managing roles, analytics, and billing within the platform. By implementing a structured permissions model, tracking key metrics, and establishing clear billing hooks, we aim to create an efficient and user-friendly experience while ensuring compliance and data integrity.
