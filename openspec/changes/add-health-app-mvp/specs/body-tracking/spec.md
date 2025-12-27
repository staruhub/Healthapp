# Body & Workout Tracking Specification

## ADDED Requirements

### Requirement: Body Weight Logging
The system SHALL allow users to record their body weight with date and optional notes.

#### Scenario: Record weight
- **WHEN** a user submits weight value (e.g., 70.5 kg) with optional notes
- **THEN** the system creates a body_logs record with user_id from JWT token
- **AND** stores weight_kg with precision to 0.1 kg
- **AND** sets date to current date (or user-specified date)
- **AND** stores notes if provided
- **AND** sets created_at to current timestamp
- **AND** returns 201 Created with the created record

#### Scenario: Update weight for same day
- **WHEN** a user records weight for a date that already has a weight entry
- **THEN** the system creates a new record (allows multiple entries per day)
- **AND** the latest entry by created_at is considered the current weight for that day

#### Scenario: Invalid weight value
- **WHEN** a user submits weight ≤0 or >500 kg
- **THEN** the system returns 422 Validation Error
- **AND** provides message "请输入有效的体重值 (0.1-500 kg)"

#### Scenario: Query weight logs
- **WHEN** a user requests weight logs for a date range
- **THEN** the system returns all body_logs where user_id matches and date is within range
- **AND** orders results by date descending, then created_at descending
- **AND** includes weight_kg, date, notes, created_at

#### Scenario: Query latest weight
- **WHEN** a user requests their latest weight
- **THEN** the system returns the most recent body_logs record by date and created_at
- **AND** returns null if no weight records exist

### Requirement: Workout Logging
The system SHALL allow users to record workout sessions with type, duration, and notes.

#### Scenario: Record workout
- **WHEN** a user submits workout type, duration (minutes), and optional notes
- **THEN** the system creates a workout_logs record with user_id from JWT token
- **AND** stores type from predefined options (跑步, 游泳, 力量训练, 瑜伽, 其他)
- **AND** stores duration_min as positive integer
- **AND** sets date to current date (or user-specified date)
- **AND** stores notes if provided
- **AND** returns 201 Created with the created record

#### Scenario: Invalid workout type
- **WHEN** a user submits a workout type not in predefined list
- **THEN** the system returns 422 Validation Error
- **AND** provides message listing valid workout types

#### Scenario: Invalid duration
- **WHEN** a user submits duration ≤0 or >1440 minutes (24 hours)
- **THEN** the system returns 422 Validation Error
- **AND** provides message "请输入有效的时长 (1-1440 分钟)"

#### Scenario: Query workout logs
- **WHEN** a user requests workout logs for a date range
- **THEN** the system returns all workout_logs where user_id matches and date is within range
- **AND** orders results by date descending, then created_at descending
- **AND** includes type, duration_min, date, notes, created_at

#### Scenario: Multiple workouts per day
- **WHEN** a user records multiple workouts on the same day
- **THEN** the system creates separate records for each workout
- **AND** all records are returned when querying that date

### Requirement: Weight Trend Visualization Data
The system SHALL provide aggregated weight data for trend visualization.

#### Scenario: 7-day weight trend
- **WHEN** a user requests 7-day weight trend
- **THEN** the system returns the latest weight for each of the last 7 days
- **AND** includes date and weight_kg for each day
- **AND** returns null for days with no weight records
- **AND** orders results by date ascending

#### Scenario: 30-day weight trend
- **WHEN** a user requests 30-day weight trend
- **THEN** the system returns the latest weight for each of the last 30 days
- **AND** includes date and weight_kg for each day
- **AND** returns null for days with no weight records
- **AND** orders results by date ascending

#### Scenario: No weight data
- **WHEN** a user requests weight trend but has no weight records
- **THEN** the system returns empty array
- **AND** frontend displays empty state with prompt to record weight

### Requirement: Workout Summary Data
The system SHALL provide aggregated workout data for dashboard display.

#### Scenario: Weekly workout summary
- **WHEN** a user requests weekly workout summary
- **THEN** the system calculates total workout minutes for the last 7 days
- **AND** groups by workout type
- **AND** returns total_minutes and workout_count for each type
- **AND** includes overall total_minutes across all types

#### Scenario: Monthly workout summary
- **WHEN** a user requests monthly workout summary
- **THEN** the system calculates total workout minutes for the last 30 days
- **AND** groups by workout type
- **AND** returns total_minutes and workout_count for each type

#### Scenario: No workout data
- **WHEN** a user requests workout summary but has no workout records
- **THEN** the system returns zero totals for all types
- **AND** frontend displays empty state with prompt to record workouts

### Requirement: Data Deletion
The system SHALL allow users to delete their own body and workout logs.

#### Scenario: Delete body log
- **WHEN** a user requests deletion of a body log they own
- **THEN** the system deletes the record from body_logs table
- **AND** returns 204 No Content

#### Scenario: Delete workout log
- **WHEN** a user requests deletion of a workout log they own
- **THEN** the system deletes the record from workout_logs table
- **AND** returns 204 No Content

#### Scenario: Delete another user's log
- **WHEN** a user attempts to delete a log belonging to another user
- **THEN** the system returns 403 Forbidden or 404 Not Found
- **AND** does not delete the record

### Requirement: User Profile Integration
The system SHALL use body weight data to track progress toward user goals.

#### Scenario: Weight change calculation
- **WHEN** the system calculates weight change
- **THEN** it compares current weight (latest body_logs) to start_weight_kg (from profiles)
- **AND** returns weight_change_kg (positive for gain, negative for loss)
- **AND** returns weight_change_percent

#### Scenario: Goal alignment check
- **WHEN** the system checks goal alignment
- **THEN** it compares weight trend direction to goal_type
- **AND** for goal_type="cut", weight should be decreasing
- **AND** for goal_type="bulk" or "gain", weight should be increasing
- **AND** for goal_type="maintain", weight should be stable (±2kg)
- **AND** returns on_track: true/false

