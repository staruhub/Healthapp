# Food Logging Specification

## ADDED Requirements

### Requirement: Natural Language Food Parsing
The system SHALL parse natural language meal descriptions into structured food items with calorie estimates.

#### Scenario: Simple meal parsing
- **WHEN** a user submits "午餐一个红薯一个鸡蛋一盆小番茄"
- **THEN** the system returns ≥3 structured food items
- **AND** each item includes name, portion_assumption, kcal_min, kcal_max, notes
- **AND** each item includes portion_options array with at least 2 alternatives
- **AND** total_kcal_min and total_kcal_max are calculated as sum of all items

#### Scenario: Complex meal with cooking method
- **WHEN** a user submits "早上喝了一杯豆浆配两个包子"
- **THEN** the system identifies豆浆 and 包子 as separate items
- **AND** portion_assumption reflects quantity (一杯, 两个)
- **AND** notes include cooking method assumptions if relevant

#### Scenario: Ambiguous portion description
- **WHEN** a user submits "一碗饭"
- **THEN** the system provides explicit portion_assumption (e.g., "中碗约200g")
- **AND** portion_options include small/medium/large variants
- **AND** cautions field mentions "以上为估算范围，实际热量受烹饪方式、具体份量影响"

#### Scenario: Empty or invalid input
- **WHEN** a user submits empty string or non-food text
- **THEN** the system returns 422 Validation Error
- **AND** provides message "请输入有效的食物描述"

#### Scenario: AI parsing failure
- **WHEN** the AI service fails to parse the input (timeout, error, invalid JSON)
- **THEN** the system returns 500 Internal Server Error
- **AND** provides message "解析失败，请稍后重试"
- **AND** logs the error for debugging

### Requirement: Calorie Range Estimation
The system SHALL provide calorie estimates as ranges (min/max) rather than single values.

#### Scenario: Range-based output
- **WHEN** the system estimates calories for any food item
- **THEN** it provides both kcal_min and kcal_max values
- **AND** kcal_max is always ≥ kcal_min
- **AND** the range reflects realistic uncertainty (typically 10-30% variance)

#### Scenario: Assumption transparency
- **WHEN** the system provides calorie estimates
- **THEN** each item includes portion_assumption explaining the basis
- **AND** notes field provides additional context (e.g., "假设为水煮/蒸")
- **AND** cautions field reminds users of estimation limitations

### Requirement: Portion Adjustment
The system SHALL allow users to adjust portion sizes and recalculate calorie estimates.

#### Scenario: User selects different portion
- **WHEN** a user changes portion from "中(150g)" to "大(200g)" for an item
- **THEN** the system recalculates kcal_min and kcal_max proportionally
- **AND** updates total_kcal_min and total_kcal_max
- **AND** preserves other item properties (name, notes)

#### Scenario: Multiple portion adjustments
- **WHEN** a user adjusts portions for multiple items
- **THEN** the system recalculates each item independently
- **AND** updates the total calorie range to reflect all changes

### Requirement: Food Log Persistence
The system SHALL save parsed food logs to the database with user association.

#### Scenario: Save food log
- **WHEN** a user saves a parsed meal
- **THEN** the system creates a food_logs record with user_id from JWT token
- **AND** stores raw_text (original input)
- **AND** stores items_json (structured parsed items)
- **AND** stores total_kcal_min and total_kcal_max
- **AND** sets date to current date (or user-specified date)
- **AND** sets created_at to current timestamp

#### Scenario: Query food logs by date
- **WHEN** a user requests food logs for a specific date
- **THEN** the system returns all food_logs where user_id matches and date equals requested date
- **AND** orders results by created_at descending
- **AND** includes all fields (raw_text, items_json, calorie totals)

#### Scenario: Query food logs without date
- **WHEN** a user requests food logs without specifying a date
- **THEN** the system returns logs for today's date
- **AND** filters by user_id from JWT token

### Requirement: Food Log Deletion
The system SHALL allow users to delete their own food logs.

#### Scenario: Delete own food log
- **WHEN** a user requests deletion of a food log they own
- **THEN** the system deletes the record from food_logs table
- **AND** returns 204 No Content

#### Scenario: Delete non-existent log
- **WHEN** a user requests deletion of a non-existent log ID
- **THEN** the system returns 404 Not Found

#### Scenario: Delete another user's log
- **WHEN** a user attempts to delete a log belonging to another user
- **THEN** the system returns 403 Forbidden or 404 Not Found
- **AND** does not delete the record

### Requirement: Mock Mode Support
The system SHALL provide full food parsing functionality in mock mode without real AI API calls.

#### Scenario: Mock mode parsing
- **WHEN** AI_MODE environment variable is set to "mock"
- **THEN** the system uses MockAIService for parsing
- **AND** returns structured results based on keyword matching
- **AND** response time is <500ms
- **AND** results are deterministic for the same input

#### Scenario: Mock mode common foods
- **WHEN** mock mode encounters common food keywords (红薯, 鸡蛋, 米饭, 鸡胸肉, etc.)
- **THEN** it returns predefined calorie ranges and portion assumptions
- **AND** results are realistic and useful for development/testing

#### Scenario: Mock mode unknown foods
- **WHEN** mock mode encounters unknown food keywords
- **THEN** it returns a generic food item with estimated calories
- **AND** notes field indicates "模拟数据，仅供开发测试"

### Requirement: Real Mode AI Integration
The system SHALL integrate with real LLM APIs in production mode.

#### Scenario: Real mode parsing
- **WHEN** AI_MODE environment variable is set to "real"
- **THEN** the system uses RealAIService with configured API key
- **AND** sends structured prompts requesting JSON output
- **AND** validates response against Pydantic schema
- **AND** retries up to 2 times on validation failure

#### Scenario: Real mode timeout
- **WHEN** AI API call exceeds 10 seconds
- **THEN** the system cancels the request
- **AND** returns 504 Gateway Timeout
- **AND** provides message "AI服务响应超时，请稍后重试"

#### Scenario: Real mode API error
- **WHEN** AI API returns error (rate limit, invalid key, service down)
- **THEN** the system logs the error with details
- **AND** returns 503 Service Unavailable
- **AND** provides message "AI服务暂时不可用"

