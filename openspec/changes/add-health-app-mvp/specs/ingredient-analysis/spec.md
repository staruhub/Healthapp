# Ingredient Analysis Specification

## ADDED Requirements

### Requirement: Ingredient Text Analysis
The system SHALL analyze ingredient lists and nutrition labels to provide health assessments aligned with user goals.

#### Scenario: Complete ingredient analysis
- **WHEN** a user submits ingredient list text (e.g., "配料：小麦粉、白砂糖、植物油、食用盐、增味剂...")
- **THEN** the system returns structured analysis with verdict, reasons, suggestions, cautions
- **AND** verdict is one of: "推荐", "谨慎", "不推荐"
- **AND** reasons array contains 1-3 specific concerns or benefits
- **AND** suggestions array contains actionable recommendations
- **AND** cautions array includes disclaimers

#### Scenario: Nutrition label analysis
- **WHEN** a user submits nutrition facts (e.g., "每100g: 能量2100kJ, 蛋白质8g, 脂肪15g, 碳水化合物60g, 钠800mg")
- **THEN** the system analyzes macronutrient ratios and micronutrients
- **AND** provides verdict based on user's goal_type
- **AND** highlights specific concerns (high sugar, high sodium, low protein, etc.)

#### Scenario: Incomplete information
- **WHEN** a user submits very limited text (e.g., only "小麦粉")
- **THEN** the system returns verdict as null or "信息不足"
- **AND** provides message "请提供完整的配料表或营养成分表以获得准确分析"
- **AND** does not fabricate analysis based on insufficient data

#### Scenario: Empty or invalid input
- **WHEN** a user submits empty string or non-ingredient text
- **THEN** the system returns 422 Validation Error
- **AND** provides message "请输入有效的配料表或营养成分表"

### Requirement: Goal-Aligned Recommendations
The system SHALL tailor ingredient analysis to the user's health goal.

#### Scenario: Analysis for weight loss goal (cut)
- **WHEN** a user with goal_type="cut" analyzes a high-sugar product
- **THEN** the verdict is "不推荐" or "谨慎"
- **AND** reasons include "含糖量较高，不利于减脂目标"
- **AND** suggestions include lower-calorie alternatives

#### Scenario: Analysis for muscle gain goal (bulk)
- **WHEN** a user with goal_type="bulk" analyzes a high-protein product
- **THEN** the verdict is "推荐"
- **AND** reasons include "蛋白质含量高，有助于肌肉增长"
- **AND** suggestions may include optimal consumption timing

#### Scenario: Analysis for maintenance goal
- **WHEN** a user with goal_type="maintain" analyzes a balanced product
- **THEN** the verdict considers overall nutritional balance
- **AND** reasons focus on moderation and variety

### Requirement: Structured Output Format
The system SHALL return ingredient analysis in a consistent, structured format.

#### Scenario: Valid JSON structure
- **WHEN** the system completes ingredient analysis
- **THEN** it returns JSON with fields: verdict, reasons, suggestions, cautions
- **AND** verdict is a string (one of the three options or null)
- **AND** reasons is an array of strings (max 3 items)
- **AND** suggestions is an array of strings (max 3 items)
- **AND** cautions is an array of strings (at least 1 item)

#### Scenario: Pydantic validation
- **WHEN** AI service returns analysis result
- **THEN** the system validates it against IngredientCheckResult Pydantic model
- **AND** rejects responses that don't match schema
- **AND** logs validation errors for debugging

### Requirement: Analysis History Persistence
The system SHALL save ingredient analysis results for user reference.

#### Scenario: Save analysis result
- **WHEN** a user completes an ingredient analysis
- **THEN** the system creates an ingredient_checks record with user_id from JWT token
- **AND** stores raw_text (original input)
- **AND** stores result_json (structured analysis)
- **AND** sets created_at to current timestamp
- **AND** returns 201 Created with the saved record

#### Scenario: Query analysis history
- **WHEN** a user requests their ingredient analysis history
- **THEN** the system returns all ingredient_checks where user_id matches
- **AND** orders results by created_at descending
- **AND** includes raw_text, result_json, created_at
- **AND** supports pagination (limit/offset)

#### Scenario: Delete analysis record
- **WHEN** a user requests deletion of an analysis they own
- **THEN** the system deletes the record from ingredient_checks table
- **AND** returns 204 No Content

### Requirement: Mock Mode Support
The system SHALL provide ingredient analysis functionality in mock mode.

#### Scenario: Mock mode analysis
- **WHEN** AI_MODE environment variable is set to "mock"
- **THEN** the system uses MockAIService for analysis
- **AND** returns structured results based on keyword matching
- **AND** response time is <500ms
- **AND** results are deterministic for the same input

#### Scenario: Mock mode high-sugar detection
- **WHEN** mock mode encounters keywords like "白砂糖", "糖", "甜味剂" in top 3 ingredients
- **THEN** it returns verdict "谨慎" or "不推荐"
- **AND** reasons include "含糖量较高"

#### Scenario: Mock mode high-protein detection
- **WHEN** mock mode encounters keywords like "蛋白质>15g/100g" or "鸡胸肉", "牛肉"
- **THEN** it returns verdict "推荐" (for bulk/gain goals)
- **AND** reasons include "蛋白质含量高"

### Requirement: Real Mode AI Integration
The system SHALL integrate with real LLM APIs for ingredient analysis in production.

#### Scenario: Real mode analysis
- **WHEN** AI_MODE environment variable is set to "real"
- **THEN** the system uses RealAIService with configured API key
- **AND** sends structured prompt with user's goal_type as context
- **AND** requests JSON output matching IngredientCheckResult schema
- **AND** validates response against Pydantic schema

#### Scenario: Real mode timeout
- **WHEN** AI API call exceeds 10 seconds
- **THEN** the system cancels the request
- **AND** returns 504 Gateway Timeout
- **AND** provides message "分析服务响应超时，请稍后重试"

#### Scenario: Real mode API error
- **WHEN** AI API returns error
- **THEN** the system logs the error with details
- **AND** returns 503 Service Unavailable
- **AND** provides message "分析服务暂时不可用"

### Requirement: Safety and Disclaimers
The system SHALL include appropriate disclaimers and avoid medical claims.

#### Scenario: Medical disclaimer
- **WHEN** the system returns any ingredient analysis
- **THEN** cautions array includes "以上分析基于文本信息，实际成分以包装为准"
- **AND** includes "本建议不构成医疗意见"

#### Scenario: Allergen detection
- **WHEN** the system detects common allergens (花生, 牛奶, 鸡蛋, 大豆, 小麦, etc.)
- **THEN** it mentions them in reasons or cautions
- **AND** does not provide medical advice about allergies
- **AND** suggests consulting a doctor if user has allergies

#### Scenario: Health claims avoidance
- **WHEN** the system generates analysis
- **THEN** it avoids making medical claims (e.g., "可以治疗糖尿病")
- **AND** focuses on nutritional composition and goal alignment
- **AND** uses conditional language ("可能", "建议", "参考")

