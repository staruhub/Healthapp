# Dashboard Specification

## ADDED Requirements

### Requirement: Weight Trend Visualization
The system SHALL provide weight trend data for visualization in line charts.

#### Scenario: 7-day weight trend
- **WHEN** a user requests 7-day weight trend data
- **THEN** the system returns array of {date, weight_kg} for last 7 days
- **AND** includes null for days with no weight records
- **AND** orders data by date ascending (oldest to newest)
- **AND** filters by user_id from JWT token

#### Scenario: 30-day weight trend
- **WHEN** a user requests 30-day weight trend data
- **THEN** the system returns array of {date, weight_kg} for last 30 days
- **AND** includes null for days with no weight records
- **AND** orders data by date ascending

#### Scenario: No weight data
- **WHEN** a user has no weight records
- **THEN** the system returns empty array
- **AND** frontend displays empty state with "开始记录体重" prompt

#### Scenario: Sparse weight data
- **WHEN** a user has weight records for only some days in the range
- **THEN** the system returns data points only for days with records
- **AND** frontend chart handles gaps appropriately (no interpolation)

### Requirement: Goal Completion Rate
The system SHALL calculate and display completion rates for calorie and workout goals.

#### Scenario: Calorie goal completion
- **WHEN** a user requests calorie completion rate for a period (7/30 days)
- **THEN** the system calculates percentage of days where food logs exist
- **AND** calculates percentage of days where calorie intake was within target range
- **AND** returns {logging_rate, on_target_rate, total_days}

#### Scenario: Workout goal completion
- **WHEN** a user requests workout completion rate for a period
- **THEN** the system calculates percentage of days with workout logs
- **AND** calculates total workout minutes vs target (e.g., 150 min/week)
- **AND** returns {workout_days, total_minutes, target_minutes, completion_rate}

#### Scenario: No data for completion rate
- **WHEN** a user has no logs in the period
- **THEN** the system returns 0% completion rates
- **AND** frontend displays empty state with encouragement to start logging

### Requirement: Weekly Insight Summary
The system SHALL generate a high-level weekly insight for dashboard display.

#### Scenario: Weekly insight generation
- **WHEN** a user requests weekly insight
- **THEN** the system analyzes last 7 days of logs (food, workout, body)
- **AND** generates 1-sentence summary (e.g., "本周体重下降0.5kg，饮食控制良好")
- **AND** provides 1-2 actionable suggestions for next week
- **AND** returns structured {summary, suggestions}

#### Scenario: Insufficient data for weekly insight
- **WHEN** a user has <3 days of logs in the last 7 days
- **THEN** the system returns summary "本周记录较少，建议增加记录频率"
- **AND** suggestions encourage consistent logging

#### Scenario: Mock mode weekly insight
- **WHEN** AI_MODE is "mock"
- **THEN** the system generates insight using rule-based logic
- **AND** calculates actual weight change if data available
- **AND** provides generic but relevant suggestions

#### Scenario: Real mode weekly insight
- **WHEN** AI_MODE is "real"
- **THEN** the system uses AI to generate personalized insight
- **AND** considers user's goal_type and progress
- **AND** validates output against Pydantic schema

### Requirement: Dashboard Data Aggregation
The system SHALL provide a single endpoint for all dashboard data to minimize API calls.

#### Scenario: Get dashboard overview
- **WHEN** a user requests dashboard overview
- **THEN** the system returns combined data: {weight_trend, completion_rates, weekly_insight}
- **AND** all data is filtered by user_id from JWT token
- **AND** response time is ≤1 second (excluding AI calls)

#### Scenario: Dashboard with date range parameter
- **WHEN** a user requests dashboard with custom date range
- **THEN** the system calculates all metrics for the specified range
- **AND** defaults to 7 days if no range specified

### Requirement: Empty State Handling
The system SHALL provide appropriate empty states when user has no data.

#### Scenario: New user dashboard
- **WHEN** a new user (no logs) accesses dashboard
- **THEN** weight_trend returns empty array
- **AND** completion_rates return 0%
- **AND** weekly_insight returns onboarding message
- **AND** frontend displays "开始记录" prompts for each card

#### Scenario: Partial data dashboard
- **WHEN** a user has some logs but not all types
- **THEN** the system returns actual data for available log types
- **AND** returns empty/zero for missing log types
- **AND** frontend displays mixed state (data + empty prompts)

### Requirement: Performance Optimization
The system SHALL optimize dashboard queries for fast loading.

#### Scenario: Efficient data queries
- **WHEN** the system fetches dashboard data
- **THEN** it uses indexed queries on (user_id, date)
- **AND** limits data to requested date range
- **AND** uses single database session for all queries
- **AND** response time is ≤500ms for non-AI data

#### Scenario: Caching consideration
- **WHEN** the system generates weekly insight (AI-powered)
- **THEN** it may cache the result for 24 hours (optional optimization)
- **AND** cache key includes user_id and date range
- **AND** cache invalidation occurs when new logs are added

### Requirement: Data Visualization Support
The system SHALL provide data in formats suitable for frontend charting libraries.

#### Scenario: Weight trend chart data
- **WHEN** the system returns weight trend
- **THEN** data format is [{date: "2025-12-20", weight: 70.5}, ...]
- **AND** dates are ISO 8601 strings
- **AND** weight values are numbers (not strings)

#### Scenario: Completion rate chart data
- **WHEN** the system returns completion rates
- **THEN** data format is {logging_rate: 0.85, on_target_rate: 0.60, ...}
- **AND** rates are decimals between 0 and 1
- **AND** frontend converts to percentages for display

### Requirement: Goal Progress Indicators
The system SHALL calculate progress toward user's health goals.

#### Scenario: Weight loss progress
- **WHEN** a user with goal_type="cut" views dashboard
- **THEN** the system calculates weight_change from start_weight_kg to latest weight
- **AND** calculates progress_percent toward target weight (if set)
- **AND** indicates if trend is positive (weight decreasing)

#### Scenario: Weight gain progress
- **WHEN** a user with goal_type="bulk" or "gain" views dashboard
- **THEN** the system calculates weight_change (should be positive)
- **AND** indicates if trend is positive (weight increasing)

#### Scenario: Maintenance progress
- **WHEN** a user with goal_type="maintain" views dashboard
- **THEN** the system checks if weight is stable (within ±2kg of start_weight_kg)
- **AND** indicates if maintenance is successful

### Requirement: Responsive Data Delivery
The system SHALL support different time ranges for dashboard metrics.

#### Scenario: Toggle time range
- **WHEN** a user switches between 7-day and 30-day views
- **THEN** the system recalculates all metrics for the new range
- **AND** returns updated data within ≤500ms

#### Scenario: Custom date range
- **WHEN** a user specifies custom start and end dates
- **THEN** the system validates date range (max 90 days)
- **AND** calculates metrics for the custom range
- **AND** returns 422 if range exceeds limits

