# AI Chat Assistant Specification

## ADDED Requirements

### Requirement: Global Chat Widget
The system SHALL provide a floating chat widget accessible from all main application pages.

#### Scenario: Widget visibility on main pages
- **WHEN** a user is on /log, /dashboard, or /assistant pages
- **THEN** the chat widget button is visible in the bottom-right corner
- **AND** clicking the button opens the chat window
- **AND** the widget maintains state (open/closed) across page navigation

#### Scenario: Widget hidden on auth pages
- **WHEN** a user is on /auth/login, /auth/register, or /onboarding pages
- **THEN** the chat widget is not visible
- **AND** no chat API calls are made

#### Scenario: Widget toggle
- **WHEN** a user clicks the chat widget button
- **THEN** the chat window opens with animation
- **AND** clicking again closes the window
- **AND** clicking outside the window also closes it

### Requirement: Chat Message Handling
The system SHALL process user messages and return AI-generated responses.

#### Scenario: Send chat message
- **WHEN** a user sends a message in the chat widget
- **THEN** the system creates a chat_logs record with role="user"
- **AND** sends message to AI service with context (current page, date, user profile)
- **AND** receives AI response
- **AND** creates a chat_logs record with role="assistant"
- **AND** displays response in chat window
- **AND** returns thread_id for conversation continuity

#### Scenario: Message with context
- **WHEN** a user sends "我今天吃多了吗？" from /log page on 2025-12-26
- **THEN** the system includes context: {page: "/log", date: "2025-12-26"}
- **AND** AI service queries food_logs for that date
- **AND** response is based on actual user data (e.g., "根据今日记录，你摄入约1800-2100kcal...")

#### Scenario: General knowledge question
- **WHEN** a user asks "水果算碳水吗？"
- **THEN** the system sends message without requiring database context
- **AND** AI service returns knowledge-based answer
- **AND** response does not access user's logs

#### Scenario: Empty message
- **WHEN** a user submits empty or whitespace-only message
- **THEN** the system returns 422 Validation Error
- **AND** frontend prevents submission of empty messages

### Requirement: Conversation Threading
The system SHALL maintain conversation context across multiple messages.

#### Scenario: New conversation
- **WHEN** a user starts a new chat session
- **THEN** the system generates a new thread_id (UUID)
- **AND** all messages in the session use the same thread_id

#### Scenario: Continue conversation
- **WHEN** a user sends a follow-up message
- **THEN** the system includes previous messages from the same thread_id
- **AND** AI service has context of prior conversation
- **AND** response is contextually relevant

#### Scenario: Conversation history limit
- **WHEN** the system sends conversation history to AI
- **THEN** it includes last 10 messages maximum
- **AND** older messages are truncated to control token usage

### Requirement: Quick Commands
The system SHALL support slash commands for common actions.

#### Scenario: /analyze_today command
- **WHEN** a user types "/analyze_today"
- **THEN** the system triggers daily insight generation for today
- **AND** returns the insight as chat response
- **AND** formats it as a structured card

#### Scenario: /ingredient command
- **WHEN** a user types "/ingredient" followed by text
- **THEN** the system triggers ingredient analysis
- **AND** returns the analysis as chat response
- **AND** formats it as a structured verdict card

#### Scenario: Unknown command
- **WHEN** a user types an unrecognized slash command
- **THEN** the system returns message "未知命令，可用命令：/analyze_today, /ingredient"

### Requirement: Chat History Persistence
The system SHALL save all chat messages for user reference.

#### Scenario: Save chat messages
- **WHEN** a user sends a message and receives a response
- **THEN** the system creates two chat_logs records (user + assistant)
- **AND** both records have the same thread_id
- **AND** both records have user_id from JWT token
- **AND** both records have created_at timestamp

#### Scenario: Query chat history
- **WHEN** a user requests chat history
- **THEN** the system returns all chat_logs where user_id matches
- **AND** orders results by created_at ascending (oldest first)
- **AND** groups by thread_id
- **AND** supports pagination (limit/offset)

#### Scenario: Query specific thread
- **WHEN** a user requests messages for a specific thread_id
- **THEN** the system returns all chat_logs for that thread and user_id
- **AND** orders by created_at ascending

### Requirement: Medical Safety Boundaries
The system SHALL refuse to provide medical diagnoses or medication advice.

#### Scenario: Medical diagnosis request
- **WHEN** a user asks "我是不是得了糖尿病？"
- **THEN** the system responds "我无法提供医疗诊断，如有健康问题请咨询专业医生"
- **AND** does not attempt to diagnose based on symptoms

#### Scenario: Medication advice request
- **WHEN** a user asks "我应该吃什么药？"
- **THEN** the system responds "我无法提供用药建议，请咨询医生或药剂师"
- **AND** does not recommend any medications

#### Scenario: Health concern escalation
- **WHEN** a user describes concerning symptoms
- **THEN** the system responds with empathy
- **AND** strongly recommends consulting a healthcare professional
- **AND** does not provide self-diagnosis or treatment suggestions

### Requirement: Mock Mode Support
The system SHALL provide chat functionality in mock mode.

#### Scenario: Mock mode chat
- **WHEN** AI_MODE environment variable is set to "mock"
- **THEN** the system uses MockAIService for chat responses
- **AND** returns predefined responses based on keyword matching
- **AND** response time is <500ms

#### Scenario: Mock mode data-driven response
- **WHEN** mock mode receives "我今天吃多了吗？" with context
- **THEN** it queries actual food_logs for the date
- **AND** generates response based on calorie totals
- **AND** response includes actual numbers from database

#### Scenario: Mock mode knowledge response
- **WHEN** mock mode receives general question
- **THEN** it returns predefined educational content
- **AND** response is helpful and accurate

### Requirement: Real Mode AI Integration
The system SHALL use real LLM APIs for sophisticated chat in production.

#### Scenario: Real mode chat
- **WHEN** AI_MODE environment variable is set to "real"
- **THEN** the system uses RealAIService with configured API key
- **AND** sends conversation history and context
- **AND** includes system prompt with safety guidelines
- **AND** validates response format

#### Scenario: Real mode timeout
- **WHEN** AI API call exceeds 10 seconds
- **THEN** the system cancels the request
- **AND** returns message "响应超时，请稍后重试"

#### Scenario: Real mode API error
- **WHEN** AI API returns error
- **THEN** the system logs the error
- **AND** returns message "服务暂时不可用，请稍后重试"

### Requirement: Response Formatting
The system SHALL support rich response formats for better UX.

#### Scenario: Text response
- **WHEN** AI returns plain text response
- **THEN** the system displays it as markdown-formatted text
- **AND** supports basic formatting (bold, italic, lists)

#### Scenario: Card response
- **WHEN** AI returns structured data (insight, ingredient analysis)
- **THEN** the system renders it as a visual card
- **AND** card includes appropriate styling and icons
- **AND** card data is stored in response metadata

#### Scenario: Multi-part response
- **WHEN** AI returns both text and structured data
- **THEN** the system displays text followed by card(s)
- **AND** maintains visual hierarchy

### Requirement: Rate Limiting
The system SHALL prevent abuse of chat functionality.

#### Scenario: Normal usage
- **WHEN** a user sends messages at normal pace (<10 per minute)
- **THEN** all messages are processed normally

#### Scenario: Rate limit exceeded
- **WHEN** a user sends >20 messages in 1 minute
- **THEN** the system returns 429 Too Many Requests
- **AND** provides message "请求过于频繁，请稍后再试"
- **AND** frontend disables send button temporarily

#### Scenario: Daily limit
- **WHEN** a user sends >100 messages in 24 hours
- **THEN** the system returns 429 Too Many Requests
- **AND** provides message "今日消息数量已达上限"

