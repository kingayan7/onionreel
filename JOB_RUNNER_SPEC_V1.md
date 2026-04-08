# OnionReel Brain v1 — Job Runner Spec v1

## Purpose
The Job Runner serves as a reliable orchestration engine for production pipeline tasks, ensuring that jobs are executed efficiently, monitored, and retried as necessary.

## Task Model
Each task in the Job Runner must adhere to the following model:

- **id**: Unique identifier for the task (UUID).
- **type**: Type of the task (e.g., data processing, notification).
- **inputs**: JSON object containing input parameters required for execution.
- **outputs**: JSON object containing results after execution.
- **status**: Current status of the task (e.g., pending, running, completed, failed).
- **attempts**: Number of attempts made to execute the task.
- **timestamps**: 
  - `created_at`: Timestamp when the task was created.
  - `started_at`: Timestamp when the task execution started.
  - `completed_at`: Timestamp when the task execution finished.

## Queue Model + Concurrency Controls
Tasks will be queued in a FIFO structure. Concurrency will be controlled via:

- Maximum concurrent tasks: Configurable limit (e.g., 5 concurrent jobs).
- Task priority: Optional field to allow prioritization of urgent tasks.

## Retry Policy
Tasks that fail will adhere to the following retry policy:

- **Exponential Backoff**: Wait time between retries will increase exponentially.
- **Max Attempts**: Configurable limit on retries (e.g., 3 attempts).
- **Retryable vs Non-Retryable**: Tasks that fail due to transient errors (e.g., network issues) are retryable; others (e.g., validation errors) are non-retryable.

## Idempotency Rules
Tasks must be designed to be idempotent, meaning executing the same task multiple times will not change the outcome beyond the initial application. This is crucial for tasks that may be retried.

## Logging + Audit Trail Schema
Each task will log the following:

- Task ID
- Task Type
- Status (with timestamps)
- Input parameters
- Output results
- Error messages (if any)
- User/Service that initiated the task

An audit trail will be maintained for compliance and debugging.

## Failure Handling + Dead-Letter Queue
Tasks that exceed the maximum retry attempts will be moved to a dead-letter queue for further analysis. This queue will hold tasks that cannot be processed, along with error details for investigation.

## Scheduling
The Job Runner will support:

- **At-Time Jobs**: One-time tasks scheduled for a specific time.
- **Recurring Jobs**: Tasks that repeat at defined intervals (e.g., daily, weekly).

## Observability
The system will implement:

- **Health Checks**: Regular checks on the Job Runner's status to ensure operational integrity.
- **Metrics**: Collection of metrics such as task execution time, success/failure rates, and queue length for monitoring performance.

## Minimal CLI or API Surface
The following endpoints/commands will be available:

1. **POST /tasks**: Create a new task.
2. **GET /tasks/{id}**: Retrieve task details by ID.
3. **GET /tasks**: List all tasks with optional filters (status, type).
4. **DELETE /tasks/{id}**: Remove a task from the queue.
5. **POST /tasks/retry/{id}**: Manually retry a failed task.
6. **GET /metrics**: Retrieve system metrics.
7. **GET /health**: Check system health status.

## Acceptance Criteria for “Job Runner v1 Complete”
1. Task model is fully implemented and operational.
2. Queue model supports concurrency controls as specified.
3. Retry policy is functional with configurable options.
4. Idempotency rules are enforced across all tasks.
5. Logging and audit trail capture necessary details.
6. Failure handling with a dead-letter queue is operational.
7. Scheduling for at-time and recurring jobs is implemented.
8. Observability features (health checks and metrics) are in place.
9. CLI/API surface is defined and functional.
10. Comprehensive testing validates all features and edge cases.
