# Implementation Fixes Specification

## ADDED Requirements

### Requirement: Backend Spec Compliance
The backend implementation SHALL comply with all requirements defined in the health-app-mvp specifications.

#### Scenario: Dashboard workout days calculation
- **WHEN** the system calculates weekly workout days
- **THEN** it SHALL query WorkoutLog table (not FoodLog)
- **AND** return accurate workout_days count

#### Scenario: Body log deletion
- **WHEN** a user requests to delete their body log
- **THEN** the system SHALL delete the record if owned by the user
- **AND** return 204 No Content on success
- **AND** return 404 Not Found if record doesn't exist or belongs to another user

#### Scenario: Workout log deletion
- **WHEN** a user requests to delete their workout log
- **THEN** the system SHALL delete the record if owned by the user
- **AND** return 204 No Content on success
- **AND** return 404 Not Found if record doesn't exist or belongs to another user

#### Scenario: Ingredient check deletion
- **WHEN** a user requests to delete their ingredient check
- **THEN** the system SHALL delete the record if owned by the user
- **AND** return 204 No Content on success
- **AND** return 404 Not Found if record doesn't exist or belongs to another user

#### Scenario: Chat slash command /analyze_today
- **WHEN** a user sends "/analyze_today" in chat
- **THEN** the system SHALL trigger daily insight generation for today
- **AND** return the insight as a structured chat response

#### Scenario: Chat slash command /ingredient
- **WHEN** a user sends "/ingredient <text>" in chat
- **THEN** the system SHALL trigger ingredient analysis on the provided text
- **AND** return the analysis result as a structured chat response

#### Scenario: Unknown slash command
- **WHEN** a user sends an unrecognized slash command
- **THEN** the system SHALL return help message listing available commands
