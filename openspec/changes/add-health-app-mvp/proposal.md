# Add Health App MVP

## Why

Current health management applications suffer from high friction in data entry (requiring precise weighing and gram-by-gram input) and lack of actionable insights. Users struggle to maintain consistent logging habits and cannot translate health goals into daily dietary decisions. This proposal addresses these pain points by creating an AI-powered health management platform that enables:

- **Low-friction input**: 5-second meal logging via natural language
- **Transparent AI estimation**: Calorie ranges with clear assumptions instead of false precision
- **Personalized guidance**: Data-driven, actionable recommendations aligned with user goals
- **Always-available assistance**: Global AI chat widget for health-related questions

The MVP validates the core value proposition with essential features while maintaining a clear path to future enhancements.

## What Changes

This proposal introduces a complete health management application with the following capabilities:

### Core Features
- **User Authentication & Onboarding** - Email/password registration, JWT-based auth, user profile setup with health goals
- **Food Logging** - Natural language meal input with AI-powered calorie estimation (range-based, adjustable portions)
- **Body & Workout Tracking** - Weight logging with trend visualization, exercise recording (type, duration, notes)
- **Ingredient Analysis** - Paste ingredient/nutrition labels for AI-powered health assessment aligned with user goals
- **Daily Insights** - AI-generated daily summaries with gap analysis, attribution, and actionable next steps
- **Dashboard** - 3-card overview: weight trends, goal completion rates, weekly insights
- **AI Chat Assistant** - Global floating chat widget for personalized health Q&A

### Technical Architecture
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui, managed with pnpm
- **Backend**: FastAPI + Python 3.11+ with async/await, managed with uv
- **Database**: PostgreSQL 15+ with SQLAlchemy 2.0 (async ORM) and Alembic migrations
- **AI Integration**: Dual-mode design (mock for development, real for production) with structured JSON outputs validated by Pydantic

### Security & Privacy
- JWT-based authentication (access + refresh tokens)
- bcrypt password hashing (≥12 rounds)
- User data isolation (all queries filtered by user_id)
- AI keys stored server-side only
- HTTPS enforcement in production

### Key Design Decisions
- **Range-based estimation**: Calorie values as min/max ranges to acknowledge uncertainty
- **Structured AI outputs**: All AI responses follow strict JSON schemas validated by Pydantic
- **Mock mode**: Full functionality without real AI API keys for development and testing
- **Medical boundaries**: No diagnostic or medication advice; prompts users to consult professionals

## Impact

### Affected Specs
This is a greenfield implementation creating the following new capabilities:
- `auth` - User authentication and authorization
- `food-logging` - Natural language meal recording and AI parsing
- `body-tracking` - Weight and workout logging
- `ingredient-analysis` - Ingredient/nutrition label evaluation
- `daily-insights` - AI-generated daily summaries
- `dashboard` - Data visualization and trends
- `ai-chat` - Global AI assistant widget

### Affected Code
**New directories and files:**
- `frontend/` - Complete Next.js application
  - `src/app/(auth)/` - Login/register pages
  - `src/app/(main)/` - Main application pages (log, dashboard, assistant)
  - `src/app/onboarding/` - User profile setup
  - `src/components/` - UI components (shadcn/ui + custom)
  - `src/lib/` - API client, auth utilities
  - `src/store/` - Zustand state management
  - `src/types/` - TypeScript type definitions

- `backend/` - Complete FastAPI application
  - `app/main.py` - FastAPI application entry point
  - `app/config.py` - Configuration management
  - `app/database.py` - Database connection and session management
  - `app/api/v1/` - API route handlers (auth, food, workout, body, ingredient, insight, chat, dashboard)
  - `app/models/` - SQLAlchemy ORM models
  - `app/schemas/` - Pydantic validation schemas
  - `app/services/` - Business logic layer
  - `app/services/ai/` - AI service abstraction (base, mock, real)
  - `app/utils/` - Security utilities (JWT, password hashing)
  - `alembic/` - Database migrations

**Database schema:**
- 8 new tables: users, profiles, food_logs, workout_logs, body_logs, ingredient_checks, insights, chat_logs, refresh_tokens

### Migration Path
This is a new application with no existing users or data. Initial deployment steps:
1. Set up PostgreSQL database
2. Run Alembic migrations to create schema
3. Configure environment variables (.env files)
4. Deploy backend (FastAPI) and frontend (Next.js) separately
5. Start in mock mode for testing, switch to real mode when AI keys are configured

### Performance Targets
- Page load: ≤2s (first contentful paint)
- Non-AI API responses: ≤500ms
- AI API responses: ≤10s
- Concurrent users: ≥100 (MVP phase)

### Testing Requirements
- Backend: Unit tests for services, API integration tests, security tests (401/403 scenarios)
- Frontend: Component tests for key UI elements, E2E tests for critical flows
- AI outputs: Schema validation tests, mock mode coverage

