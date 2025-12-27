# Health App MVP - OpenSpec Proposal

## Overview

This OpenSpec proposal defines the complete technical specification for an AI-powered health management application based on the PRD located at `/Volumes/Ventoy/Playground/Healthapp/prd.md`.

## Proposal Structure

```
openspec/changes/add-health-app-mvp/
├── proposal.md          # Why, what changes, and impact
├── design.md            # Technical architecture and design decisions
├── tasks.md             # 125 implementation tasks organized in 13 phases
├── README.md            # This file
└── specs/               # Capability specifications (delta format)
    ├── auth/
    │   └── spec.md      # Authentication & authorization requirements
    ├── food-logging/
    │   └── spec.md      # Natural language food parsing & logging
    ├── body-tracking/
    │   └── spec.md      # Weight & workout tracking
    ├── ingredient-analysis/
    │   └── spec.md      # Ingredient/nutrition label analysis
    ├── daily-insights/
    │   └── spec.md      # AI-generated daily summaries
    ├── dashboard/
    │   └── spec.md      # Data visualization & trends
    └── ai-chat/
        └── spec.md      # Global AI assistant widget
```

## Key Features

### 1. **User Authentication & Onboarding** (`auth/spec.md`)
- Email/password registration with bcrypt hashing
- JWT-based authentication (access + refresh tokens)
- User data isolation (all queries filtered by user_id)
- Profile setup with health goals (cut/bulk/gain/maintain)

### 2. **Food Logging** (`food-logging/spec.md`)
- Natural language meal input (e.g., "午餐一个红薯一个鸡蛋")
- AI-powered parsing into structured food items
- Calorie estimation as ranges (min/max) with transparent assumptions
- Portion adjustment with recalculation
- Mock and real AI modes

### 3. **Body & Workout Tracking** (`body-tracking/spec.md`)
- Weight logging with 0.1kg precision
- Workout recording (type, duration, notes)
- Weight trend data for 7/30-day visualization
- Workout summary aggregation

### 4. **Ingredient Analysis** (`ingredient-analysis/spec.md`)
- Paste ingredient lists or nutrition labels
- AI-powered health assessment (推荐/谨慎/不推荐)
- Goal-aligned recommendations
- Analysis history persistence

### 5. **Daily Insights** (`daily-insights/spec.md`)
- AI-generated daily summaries based on all logs
- Calorie gap analysis (intake vs target)
- Attribution to specific meals/activities
- Actionable next-day recommendations (max 3)

### 6. **Dashboard** (`dashboard/spec.md`)
- Weight trend visualization (7/30-day line charts)
- Goal completion rates (calorie, workout)
- Weekly AI-generated insights
- Empty state handling for new users

### 7. **AI Chat Assistant** (`ai-chat/spec.md`)
- Global floating chat widget (bottom-right corner)
- Context-aware responses (current page, date, user data)
- Conversation threading
- Quick commands (/analyze_today, /ingredient)
- Medical safety boundaries (no diagnosis/medication advice)

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Components**: shadcn/ui
- **Package Manager**: pnpm 8.x
- **State Management**: Zustand (global) + React Query (server state)

### Backend
- **Framework**: FastAPI 0.109+
- **Language**: Python 3.11+
- **Package Manager**: uv
- **ORM**: SQLAlchemy 2.0 (async)
- **Validation**: Pydantic V2
- **Authentication**: python-jose (JWT) + passlib (bcrypt)
- **Migrations**: Alembic

### Database
- **DBMS**: PostgreSQL 15+
- **Driver**: asyncpg (async)
- **Tables**: 9 tables (users, profiles, food_logs, workout_logs, body_logs, ingredient_checks, insights, chat_logs, refresh_tokens)

### AI Integration
- **Modes**: Mock (development) / Real (production)
- **Pattern**: Abstract base class with mock and real implementations
- **Validation**: All AI outputs validated by Pydantic schemas
- **Providers**: OpenAI / Claude / compatible APIs

## Design Highlights

### 1. **Dual AI Mode**
- **Mock Mode**: Keyword-based pattern matching, no API keys needed, <500ms responses
- **Real Mode**: LLM API integration with structured prompts and JSON schema enforcement

### 2. **Range-Based Estimation**
- All calorie estimates provided as min/max ranges
- Transparent portion assumptions (e.g., "中等大小红薯约150g")
- User-adjustable portions with recalculation

### 3. **Structured AI Outputs**
- All AI responses follow strict JSON schemas
- Pydantic validation prevents malformed data from breaking UI
- Frontend renders structured data, not free-form text

### 4. **Security First**
- JWT tokens with 30-min access, 7-day refresh
- bcrypt password hashing (≥12 rounds)
- User data isolation via user_id filtering
- AI keys never exposed to frontend

### 5. **Medical Safety**
- No diagnostic or medication advice
- Disclaimers on all AI outputs
- Escalation to healthcare professionals for health concerns

## Implementation Phases (13 Phases, 125 Tasks)

1. **Project Setup & Infrastructure** (9 tasks)
2. **Database Schema & Models** (11 tasks)
3. **Authentication & Authorization** (13 tasks)
4. **User Onboarding & Profile** (7 tasks)
5. **Food Logging & AI Parsing** (13 tasks)
6. **Body & Workout Tracking** (9 tasks)
7. **Ingredient Analysis** (8 tasks)
8. **Daily Insights** (9 tasks)
9. **Dashboard & Data Visualization** (9 tasks)
10. **AI Chat Assistant** (11 tasks)
11. **Frontend Polish & UX** (8 tasks)
12. **Testing & Quality Assurance** (8 tasks)
13. **Documentation & Deployment** (10 tasks)

## Validation Status

✅ **Validated**: This proposal passes `openspec validate add-health-app-mvp --strict`

All requirements include:
- Clear requirement statements (SHALL/MUST)
- At least one scenario per requirement
- Proper scenario formatting (`#### Scenario:`)
- WHEN-THEN structure for acceptance criteria

## Next Steps

1. **Review Proposal**: Read `proposal.md`, `design.md`, and spec files
2. **Approve Proposal**: Stakeholder sign-off before implementation
3. **Begin Implementation**: Follow `tasks.md` sequentially
4. **Track Progress**: Update task checkboxes as work completes
5. **Archive After Deployment**: Move to `changes/archive/` and update `specs/`

## Quick Commands

```bash
# View proposal summary
openspec show add-health-app-mvp

# Validate proposal
openspec validate add-health-app-mvp --strict

# View specific capability spec
openspec show add-health-app-mvp --type change --json --deltas-only

# List all tasks
cat openspec/changes/add-health-app-mvp/tasks.md
```

## Contact & Questions

For questions about this proposal, refer to:
- PRD: `/Volumes/Ventoy/Playground/Healthapp/prd.md`
- Project conventions: `openspec/project.md`
- OpenSpec guide: `openspec/AGENTS.md`

