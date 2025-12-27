# Health App Backend

FastAPI backend for AI-powered health management application.

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- uv package manager

### Installation

1. Install dependencies:
```bash
uv sync
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up PostgreSQL database:
```bash
createdb healthapp
```

4. Run database migrations:
```bash
uv run alembic upgrade head
```

### Running the Server

Development mode:
```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Production mode:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API route handlers
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic validation schemas
│   ├── services/        # Business logic layer
│   │   └── ai/          # AI service abstraction
│   ├── utils/           # Utilities (security, dependencies)
│   ├── config.py        # Configuration management
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI application
├── alembic/             # Database migrations
├── pyproject.toml       # Project dependencies
└── .env                 # Environment variables (not in git)
```

## AI Modes

### Mock Mode (Development)
Set `AI_MODE=mock` in `.env`. Uses keyword-based pattern matching for fast development without API costs.

### Real Mode (Production)
Set `AI_MODE=real` and provide `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in `.env`.

## Database Migrations

Create a new migration:
```bash
uv run alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
uv run alembic upgrade head
```

Rollback:
```bash
uv run alembic downgrade -1
```

## Testing

Run tests:
```bash
uv run pytest
```

## Security Notes

- Change `SECRET_KEY` in production (use `openssl rand -hex 32`)
- Use HTTPS in production
- Keep API keys secure (never commit to git)
- Review CORS settings for production

