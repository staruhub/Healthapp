# Frontend API Integration Fixes

## MODIFIED Requirements

### Requirement: Frontend API Client Implementation
The frontend SHALL correctly integrate with all backend API endpoints using the field names defined in existing specifications.

#### Scenario: Body log creation uses correct field names
- **WHEN** a user submits a body weight entry
- **THEN** the frontend sends `weight_kg` (not `weight`) to `POST /api/v1/body/logs`
- **AND** the request includes `date` in YYYY-MM-DD format
- **AND** the backend returns 201 Created on success

#### Scenario: Body log query uses correct parameters
- **WHEN** the frontend queries body logs for a date range
- **THEN** it uses query parameters `date_from` and `date_to` (not `start_date`/`end_date`)
- **AND** the response maps `weight_kg` correctly for display

#### Scenario: Workout log creation uses correct field names
- **WHEN** a user submits a workout entry
- **THEN** the frontend sends `duration_minutes` (not `duration`) to `POST /api/v1/workout/logs`
- **AND** the request includes `workout_type`, `date`, and optional `notes`
- **AND** the backend returns 201 Created on success

#### Scenario: Workout log query uses correct parameters
- **WHEN** the frontend queries workout logs for a date range
- **THEN** it uses query parameters `date_from` and `date_to` (not `start_date`/`end_date`)
- **AND** the response maps `duration_minutes` correctly for display

#### Scenario: Insights API uses correct endpoints
- **WHEN** the frontend fetches daily insight
- **THEN** it calls `GET /api/v1/insight/daily?date=YYYY-MM-DD`
- **AND** when generating insight, it calls `POST /api/v1/insight/generate`

#### Scenario: Ingredient analysis uses correct request format
- **WHEN** the frontend submits ingredient analysis
- **THEN** it sends `text` field (not `ingredients`) to `POST /api/v1/ingredient/analyze`
- **AND** handles the structured response correctly

#### Scenario: Authentication token storage is consistent
- **WHEN** a user logs in successfully
- **THEN** the token is stored in a location accessible to both client code and middleware
- **AND** protected routes correctly verify authentication status

#### Scenario: Error responses are handled gracefully
- **WHEN** an API returns an error response
- **THEN** the frontend displays a user-friendly error message
- **AND** does not crash or render raw error objects
