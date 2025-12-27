# Daily Insights Specification

## ADDED Requirements

### Requirement: Daily Summary Generation
The system SHALL generate AI-powered daily summaries based on user's food, workout, and body logs.

#### Scenario: Complete daily insight
- **WHEN** a user requests daily insight for a date with food/workout/body logs
- **THEN** the system aggregates all logs for that date and user_id
- **AND** generates structured insight with gap_summary, reasons, next_actions, cautions
- **AND** gap_summary quantifies calorie intake vs target (e.g., "今日热量摄入约1800-2100kcal，略超目标区间")
- **AND** reasons array contains 2-3 specific attributions to meals/activities
- **AND** next_actions array contains 1-3 actionable recommendations for tomorrow
- **AND** cautions array includes estimation disclaimers

#### Scenario: No logs for the day
- **WHEN** a user requests daily insight for a date with no logs
- **THEN** the system returns insight with gap_summary indicating no data
- **AND** gap_summary is "今日暂无记录，先去记录一下吧"
- **AND** reasons and next_actions are empty or contain generic encouragement
- **AND** does not fabricate data or insights

#### Scenario: Partial logs (only food)
- **WHEN** a user has food logs but no workout or body logs for the day
- **THEN** the system generates insight based on available food data
- **AND** gap_summary focuses on calorie intake
- **AND** next_actions may suggest adding workout or weight tracking

#### Scenario: Partial logs (only workout)
- **WHEN** a user has workout logs but no food logs for the day
- **THEN** the system generates insight acknowledging workout
- **AND** gap_summary mentions exercise but notes missing food data
- **AND** next_actions suggest logging meals for complete picture

### Requirement: Calorie Gap Analysis
The system SHALL calculate and explain the gap between actual intake and target calories.

#### Scenario: Calorie surplus
- **WHEN** user's total food intake exceeds their target calorie range
- **THEN** gap_summary states "今日热量摄入约X-Ykcal，超出目标区间(A-Bkcal)"
- **AND** reasons identify high-calorie meals (e.g., "午餐黄焖鸡米饭热量较高")
- **AND** next_actions suggest lower-calorie alternatives for tomorrow

#### Scenario: Calorie deficit
- **WHEN** user's total food intake is below their target calorie range
- **THEN** gap_summary states "今日热量摄入约X-Ykcal，低于目标区间(A-Bkcal)"
- **AND** reasons identify if deficit is intentional (for cut goal) or concerning
- **AND** next_actions may suggest increasing intake if deficit is too large

#### Scenario: On-target calories
- **WHEN** user's total food intake is within their target calorie range
- **THEN** gap_summary states "今日热量摄入约X-Ykcal，符合目标区间(A-Bkcal)"
- **AND** reasons highlight what went well
- **AND** next_actions encourage maintaining current approach

### Requirement: Attribution and Root Cause Analysis
The system SHALL attribute calorie gaps to specific meals and activities.

#### Scenario: Meal-level attribution
- **WHEN** the system identifies calorie surplus
- **THEN** reasons specify which meal(s) contributed most (e.g., "午餐黄焖鸡米饭约800kcal")
- **AND** mentions specific food items if relevant (e.g., "下午零食增加了额外200kcal")

#### Scenario: Activity attribution
- **WHEN** the system considers workout logs
- **THEN** reasons mention exercise impact (e.g., "运动消耗偏少，仅散步20分钟")
- **AND** estimates calorie burn if workout data available

#### Scenario: Multi-factor attribution
- **WHEN** multiple factors contribute to gap
- **THEN** reasons list top 2-3 factors in order of impact
- **AND** avoids overwhelming user with too many details

### Requirement: Actionable Recommendations
The system SHALL provide specific, executable next steps for tomorrow.

#### Scenario: Dietary recommendations
- **WHEN** the system generates next_actions
- **THEN** it suggests specific meal choices (e.g., "明日午餐选择沙拉/轻食，控制在500kcal以内")
- **AND** recommendations align with user's goal_type
- **AND** suggestions are realistic and achievable

#### Scenario: Exercise recommendations
- **WHEN** workout logs show low activity
- **THEN** next_actions suggest specific exercise (e.g., "增加30分钟有氧运动")
- **AND** recommendations match user's activity_level and capabilities

#### Scenario: Limit recommendations
- **WHEN** the system generates next_actions
- **THEN** it provides maximum 3 actions to avoid overwhelming user
- **AND** prioritizes highest-impact changes

### Requirement: Insight Persistence
The system SHALL save generated insights for historical reference.

#### Scenario: Save insight
- **WHEN** the system generates a daily insight
- **THEN** it creates an insights record with user_id from JWT token
- **AND** stores date (the date being analyzed)
- **AND** stores insight_json (structured insight data)
- **AND** sets created_at to current timestamp
- **AND** returns 201 Created with the saved record

#### Scenario: Query insights by date
- **WHEN** a user requests insight for a specific date
- **THEN** the system returns the most recent insights record for that date and user_id
- **AND** includes insight_json with gap_summary, reasons, next_actions, cautions

#### Scenario: Query insights history
- **WHEN** a user requests their insights history
- **THEN** the system returns all insights where user_id matches
- **AND** orders results by date descending
- **AND** supports date range filtering

### Requirement: Mock Mode Support
The system SHALL generate insights in mock mode using rule-based logic.

#### Scenario: Mock mode insight generation
- **WHEN** AI_MODE environment variable is set to "mock"
- **THEN** the system uses MockAIService for insight generation
- **AND** calculates calorie totals from actual food_logs data
- **AND** generates gap_summary based on simple rules
- **AND** provides generic but relevant next_actions
- **AND** response time is <1 second

#### Scenario: Mock mode calorie calculation
- **WHEN** mock mode generates insight
- **THEN** it sums total_kcal_min and total_kcal_max from all food_logs for the date
- **AND** compares to user's target calorie range (calculated from profile)
- **AND** generates gap_summary with actual numbers

### Requirement: Real Mode AI Integration
The system SHALL use real LLM APIs for sophisticated insight generation in production.

#### Scenario: Real mode insight generation
- **WHEN** AI_MODE environment variable is set to "real"
- **THEN** the system uses RealAIService with configured API key
- **AND** sends comprehensive context (all logs, user profile, goal_type)
- **AND** requests JSON output matching DailyInsightResult schema
- **AND** validates response against Pydantic schema

#### Scenario: Real mode timeout
- **WHEN** AI API call exceeds 10 seconds
- **THEN** the system cancels the request
- **AND** returns 504 Gateway Timeout
- **AND** provides message "生成解读超时，请稍后重试"

#### Scenario: Real mode API error
- **WHEN** AI API returns error
- **THEN** the system logs the error with details
- **AND** returns 503 Service Unavailable
- **AND** provides message "解读服务暂时不可用"

### Requirement: Safety and Disclaimers
The system SHALL include appropriate disclaimers in all insights.

#### Scenario: Estimation disclaimer
- **WHEN** the system generates any insight
- **THEN** cautions array includes "热量估算存在误差，仅供参考"
- **AND** includes "建议结合体重趋势综合判断"

#### Scenario: Medical boundary
- **WHEN** the system generates recommendations
- **THEN** it avoids medical advice (e.g., "你需要服用维生素补充剂")
- **AND** focuses on dietary and exercise suggestions
- **AND** uses conditional language ("建议", "可以考虑")

