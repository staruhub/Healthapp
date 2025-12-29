# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (FastAPI/Python)
```bash
cd backend

# Install dependencies
uv sync

# Run database migrations
uv run alembic upgrade head

# Start development server (port 8001)
uv run uvicorn app.main:app --reload --port 8001

# Create new migration
uv run alembic revision --autogenerate -m "description"

# Rollback migration
uv run alembic downgrade -1

# Run tests
uv run pytest

# Run single test file
uv run pytest tests/test_auth.py -v
```

### Frontend (Next.js/React)
```bash
cd frontend

# Install dependencies
pnpm install

# Start development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Database (Docker)
```bash
# Start PostgreSQL
docker-compose up -d

# Check container status
docker ps | grep postgres

# View logs
docker-compose logs postgres
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 16.1 (App Router), React 19.2, TypeScript, TailwindCSS 4.x, Zustand, TanStack Query
- **Backend**: FastAPI 0.115+, Python 3.11+, SQLAlchemy 2.0 (async), Pydantic V2, Alembic
- **Database**: PostgreSQL 15+

### Backend Three-Layer Architecture
```
Router (app/api/v1/) → Service (app/services/) → Model (app/models/)
```
- **Router**: API endpoints, parameter validation, dependency injection
- **Service**: Business logic, AI integration, data aggregation
- **Model**: SQLAlchemy ORM models, database access

### Frontend Structure
- `app/(auth)/` - Authentication pages (login, register)
- `app/(main)/` - Main application pages (dashboard, food, body, chat)
- `app/onboarding/` - User onboarding flow
- `components/ui/` - Base UI components (shadcn/ui)
- `components/<feature>/` - Feature-specific components
- `hooks/` - Custom React hooks
- `store/` - Zustand state management
- `lib/` - Utilities including API client (`lib/api.ts`)

### AI Service Pattern
The backend uses an abstraction layer for AI services:
- `AI_MODE=mock`: Uses keyword-based pattern matching (no API costs, for development)
- `AI_MODE=real`: Uses OpenAI/Claude API (requires API key)

Services are in `app/services/ai/` with a base class defining the interface and mock/real implementations.

### State Management
- **Zustand**: Global client state (auth, user preferences)
- **TanStack Query**: Server state caching and synchronization

### Authentication
- JWT-based with access token (30min) and refresh token (7 days)
- All data queries filter by `user_id` extracted from JWT
- Token stored in localStorage via Zustand persist

## Key Conventions

### Code Style
- **Frontend**: kebab-case files (`food-log.tsx`), PascalCase components (`FoodLogCard`)
- **Backend**: snake_case files (`food_service.py`), PascalCase classes (`FoodLog`)
- All functions must have type annotations (Python) or TypeScript types

### Commit Messages
```
<type>(<scope>): <subject>
```
Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### API Endpoints Pattern
All API routes are versioned under `/api/v1/`:
- `/api/v1/auth/*` - Authentication
- `/api/v1/food/*` - Food logging
- `/api/v1/body/*` - Body metrics
- `/api/v1/workout/*` - Workout tracking
- `/api/v1/dashboard/*` - Dashboard aggregation
- `/api/v1/chat` - AI chat assistant
- `/api/v1/ingredient/*` - Ingredient analysis

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/healthapp_db
SECRET_KEY=<generate with: openssl rand -hex 32>
AI_MODE=mock|real
OPENAI_API_KEY=sk-...  # Required when AI_MODE=real
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_AI_MODE=mock
```

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->
