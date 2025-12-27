# Technical Design: Health App MVP

## Context

This is a greenfield health management application addressing user pain points in existing solutions: high-friction data entry, lack of actionable insights, and difficulty translating health goals into daily decisions. The application leverages AI for natural language processing while maintaining transparency about estimation uncertainty.

**Key Stakeholders:**
- End users: Individuals pursuing weight loss, muscle gain, or weight maintenance goals
- Development team: Full-stack developers implementing Next.js + FastAPI architecture
- Product team: Validating MVP value proposition before scaling

**Constraints:**
- MVP timeline: 5 weeks
- Must support offline development (mock AI mode)
- Must handle 100+ concurrent users
- AI API costs must be controllable
- Medical/legal compliance: No diagnostic advice

## Goals / Non-Goals

### Goals
- Enable 5-second meal logging via natural language input
- Provide transparent calorie estimation with ranges and assumptions
- Generate personalized, actionable daily insights
- Support both development (mock) and production (real) AI modes
- Ensure user data isolation and security (JWT + user_id filtering)
- Maintain structured AI outputs for reliable frontend rendering

### Non-Goals
- Image-based food recognition (deferred to phase 2)
- OCR for ingredient labels (deferred to phase 2)
- Streaming AI responses (deferred to phase 2)
- Social/community features (out of scope)
- Mobile native apps (web-first approach)
- Multi-language support (English/Chinese only for MVP)

## Decisions

### Decision 1: Frontend - Next.js 14 with App Router
**Rationale:**
- App Router provides modern React patterns (Server Components, streaming)
- Built-in routing, API routes, and optimization features
- TypeScript support for type safety
- Excellent developer experience with hot reload
- Easy deployment to Vercel or self-hosted

**Alternatives Considered:**
- Create React App: Deprecated, lacks modern features
- Vite + React Router: More configuration needed, less integrated
- Remix: Smaller ecosystem, steeper learning curve

**Implementation:**
- Use pnpm for faster installs and disk efficiency
- Organize routes with route groups: `(auth)`, `(main)`
- Leverage React Server Components for initial page loads
- Use Client Components for interactive features (forms, chat)

### Decision 2: Backend - FastAPI with Async/Await
**Rationale:**
- Native async support for database and AI API calls
- Automatic OpenAPI documentation generation
- Pydantic integration for request/response validation
- High performance (comparable to Node.js/Go)
- Python ecosystem for AI/ML integrations

**Alternatives Considered:**
- Django: Heavier framework, less async-native
- Flask: Lacks built-in async, manual validation
- Node.js/Express: Team prefers Python for AI work

**Implementation:**
- Use uv for fast dependency management
- Three-layer architecture: Router → Service → Model
- Async database sessions with SQLAlchemy 2.0
- Dependency injection for auth and database sessions

### Decision 3: Database - PostgreSQL with Async ORM
**Rationale:**
- Robust ACID compliance for user data
- JSON column support for flexible AI outputs
- Excellent performance with proper indexing
- Mature ecosystem and tooling
- Async driver (asyncpg) for non-blocking I/O

**Alternatives Considered:**
- MongoDB: Less suitable for relational user data
- MySQL: Weaker JSON support
- SQLite: Not suitable for concurrent users

**Schema Design:**
- UUID primary keys for security (non-sequential)
- Composite indexes on (user_id, date) for fast queries
- JSON columns for AI outputs (items_json, result_json, insight_json)
- Separate tables for different log types (normalization)

### Decision 4: AI Service Abstraction with Mock/Real Modes
**Rationale:**
- Development without API keys or costs
- Consistent testing with predictable outputs
- Easy switching between modes via environment variable
- Graceful degradation if AI service unavailable

**Design Pattern:**
```python
class BaseAIService(ABC):
    @abstractmethod
    async def parse_food(text: str, user_goal: str) -> FoodParseResult: ...
    
    @abstractmethod
    async def analyze_ingredient(text: str, user_goal: str) -> IngredientResult: ...
    
    @abstractmethod
    async def generate_insight(logs: DailyLogs, profile: Profile) -> InsightResult: ...
    
    @abstractmethod
    async def chat(message: str, context: ChatContext, history: List[Message]) -> ChatResponse: ...

# Factory pattern
def get_ai_service() -> BaseAIService:
    if settings.AI_MODE == "mock":
        return MockAIService()
    else:
        return RealAIService(api_key=settings.OPENAI_API_KEY)
```

**Mock Implementation:**
- Keyword-based pattern matching for food items
- Predefined templates for common scenarios
- Randomized ranges within realistic bounds
- Fast responses (<100ms) for development

**Real Implementation:**
- Structured prompts with JSON schema enforcement
- Pydantic validation of all AI outputs
- Retry logic with exponential backoff
- Timeout handling (10s max)

### Decision 5: Authentication - JWT with Refresh Tokens
**Rationale:**
- Stateless authentication (no server-side sessions)
- Short-lived access tokens (30 min) for security
- Long-lived refresh tokens (7 days) for UX
- Standard OAuth2 Bearer pattern

**Token Flow:**
1. Login → Return access_token + refresh_token
2. API requests → Include access_token in Authorization header
3. Access token expires → Use refresh_token to get new access_token
4. Refresh token expires → Re-login required

**Security Measures:**
- bcrypt password hashing (12 rounds)
- Refresh tokens stored in database (revocable)
- HTTPS-only in production
- CORS restrictions on API

### Decision 6: State Management - Zustand + React Query
**Rationale:**
- Zustand: Lightweight global state (auth, UI preferences)
- React Query: Server state caching and synchronization
- Avoid Redux complexity for MVP scope

**State Separation:**
- **Zustand**: User auth state, chat widget open/closed, theme
- **React Query**: All API data (logs, insights, dashboard)
- **Local State**: Form inputs, UI interactions

### Decision 7: Structured AI Outputs with Pydantic Validation
**Rationale:**
- Frontend needs predictable data structures for rendering
- Prevent AI hallucinations from breaking UI
- Enable automated testing of AI outputs
- Clear contract between AI and application logic

**Example Schema:**
```python
class FoodItem(BaseModel):
    name: str
    portion_assumption: str
    portion_options: List[str]
    kcal_min: int
    kcal_max: int
    notes: str

class FoodParseResult(BaseModel):
    items: List[FoodItem]
    total_kcal_min: int
    total_kcal_max: int
    cautions: str
```

**Validation Strategy:**
- All AI responses parsed through Pydantic models
- Validation errors logged and returned as API errors
- Frontend displays error message instead of broken UI

## Risks / Trade-offs

### Risk 1: AI Output Inconsistency
**Impact:** Real AI may return unparseable or invalid JSON
**Mitigation:**
- Strict JSON schema in prompts
- Pydantic validation with clear error messages
- Retry logic (up to 2 retries)
- Fallback to mock mode if repeated failures
- Monitoring and alerting on validation failures

### Risk 2: Calorie Estimation Accuracy
**Impact:** Users may distrust inaccurate estimates
**Mitigation:**
- Always provide ranges (min/max) instead of single values
- Clearly state assumptions (e.g., "medium sweet potato ~150g")
- Allow portion adjustment with recalculation
- Include disclaimer: "Estimates are approximate and affected by cooking methods"
- Educate users on inherent uncertainty

### Risk 3: Performance - AI API Latency
**Impact:** 10s response time may feel slow
**Mitigation:**
- Show loading indicators with progress messages
- Implement request timeouts (10s max)
- Cache common food items (future optimization)
- Consider async processing for insights (future)

### Risk 4: Security - User Data Isolation
**Impact:** Data leak between users would be critical
**Mitigation:**
- All queries filtered by user_id from JWT token
- Database-level row-level security (future)
- Comprehensive security tests (401, 403 scenarios)
- Code review checklist for data access patterns

### Risk 5: Cost - AI API Usage
**Impact:** Uncontrolled usage could incur high costs
**Mitigation:**
- Rate limiting per user (e.g., 100 requests/day)
- Monitor API usage with alerts
- Implement caching for repeated queries
- Consider cheaper models for simple tasks

## Migration Plan

This is a greenfield project with no existing data to migrate.

**Initial Deployment Steps:**
1. Provision PostgreSQL database (managed service recommended)
2. Run Alembic migrations to create schema
3. Deploy backend to server (Docker container recommended)
4. Deploy frontend to CDN/hosting (Vercel recommended)
5. Configure environment variables (secrets management)
6. Start in mock mode for initial testing
7. Switch to real mode after AI key configuration
8. Monitor error rates and performance metrics

**Rollback Plan:**
- Backend: Revert to previous Docker image
- Frontend: Revert deployment via hosting platform
- Database: Alembic downgrade (if schema issues)
- AI Mode: Switch back to mock via environment variable

## Open Questions

1. **Which LLM provider?** OpenAI (GPT-4) vs Anthropic (Claude) vs others?
   - **Recommendation:** Start with OpenAI GPT-4 for structured outputs, evaluate Claude if needed

2. **Caching strategy?** Should we cache AI responses for identical inputs?
   - **Recommendation:** Defer to phase 2; focus on core functionality first

3. **Rate limiting implementation?** Redis-based or in-memory?
   - **Recommendation:** In-memory for MVP (simple), Redis for production scaling

4. **Deployment platform?** Self-hosted vs managed services?
   - **Recommendation:** Vercel (frontend) + Railway/Render (backend) for MVP simplicity

5. **Monitoring and observability?** Which tools for error tracking and performance?
   - **Recommendation:** Sentry for error tracking, built-in logging for MVP

6. **Internationalization?** Support for multiple languages?
   - **Recommendation:** English/Chinese only for MVP, i18n framework deferred to phase 2

