# Implementation Tasks

## 1. Project Setup & Infrastructure
- [x] 1.1 Initialize Next.js project with TypeScript, Tailwind CSS, and App Router
- [x] 1.2 Install and configure shadcn/ui component library
- [x] 1.3 Set up pnpm workspace and dependencies (Zustand, React Query, Axios)
- [x] 1.4 Initialize FastAPI project with uv package manager
- [x] 1.5 Install backend dependencies (SQLAlchemy, Pydantic, asyncpg, python-jose, passlib, httpx)
- [x] 1.6 Set up PostgreSQL database (local/Docker for development)
- [x] 1.7 Configure Alembic for database migrations
- [x] 1.8 Create environment variable templates (.env.example for both frontend and backend)
- [x] 1.9 Set up project directory structure following conventions

## 2. Database Schema & Models
- [x] 2.1 Create SQLAlchemy models for users table
- [x] 2.2 Create SQLAlchemy models for profiles table
- [x] 2.3 Create SQLAlchemy models for food_logs table
- [x] 2.4 Create SQLAlchemy models for workout_logs table
- [x] 2.5 Create SQLAlchemy models for body_logs table
- [x] 2.6 Create SQLAlchemy models for ingredient_checks table
- [x] 2.7 Create SQLAlchemy models for insights table
- [x] 2.8 Create SQLAlchemy models for chat_logs table
- [x] 2.9 Create SQLAlchemy models for refresh_tokens table
- [x] 2.10 Generate and test initial Alembic migration (requires PostgreSQL)
- [x] 2.11 Add database indexes (user_id, date composite indexes)

## 3. Authentication & Authorization
- [x] 3.1 Implement password hashing utilities (bcrypt)
- [x] 3.2 Implement JWT token generation and validation
- [x] 3.3 Create Pydantic schemas for auth requests/responses
- [x] 3.4 Implement POST /api/v1/auth/register endpoint
- [x] 3.5 Implement POST /api/v1/auth/login endpoint
- [x] 3.6 Implement POST /api/v1/auth/refresh endpoint
- [x] 3.7 Create authentication dependency for protected routes
- [x] 3.8 Implement user_id extraction from JWT tokens
- [x] 3.9 Build frontend login page
- [x] 3.10 Build frontend registration page
- [x] 3.11 Implement frontend auth state management (Zustand)
- [x] 3.12 Create API client with token interceptors
- [ ] 3.13 Write auth API tests (401, 403 scenarios)

## 4. User Onboarding & Profile
- [x] 4.1 Create Pydantic schemas for user profile
- [x] 4.2 Implement POST /api/v1/profile endpoint
- [x] 4.3 Implement GET /api/v1/profile endpoint
- [x] 4.4 Implement PUT /api/v1/profile endpoint
- [x] 4.5 Build frontend onboarding page with form validation
- [x] 4.6 Implement profile completion check and redirect logic
- [ ] 4.7 Write profile API tests

## 5. Food Logging & AI Parsing
- [x] 5.1 Design AI service base class interface
- [x] 5.2 Implement MockAIService for food parsing
- [x] 5.3 Implement RealAIService for food parsing (OpenAI integration)
- [x] 5.4 Create Pydantic schemas for food parse requests/responses
- [x] 5.5 Implement POST /api/v1/food/parse endpoint
- [x] 5.6 Implement POST /api/v1/food/logs endpoint (save parsed food)
- [x] 5.7 Implement GET /api/v1/food/logs endpoint (query by date)
- [x] 5.8 Implement DELETE /api/v1/food/logs/{id} endpoint
- [x] 5.9 Build frontend food logging page with text input
- [x] 5.10 Implement portion adjustment UI with dropdown selectors
- [x] 5.11 Display structured food items with calorie ranges
- [ ] 5.12 Write food logging API tests
- [ ] 5.13 Write AI output schema validation tests

## 6. Body & Workout Tracking
- [x] 6.1 Create Pydantic schemas for body logs
- [x] 6.2 Implement POST /api/v1/body/logs endpoint
- [x] 6.3 Implement GET /api/v1/body/logs endpoint (query by date range)
- [x] 6.4 Create Pydantic schemas for workout logs
- [x] 6.5 Implement POST /api/v1/workout/logs endpoint
- [x] 6.6 Implement GET /api/v1/workout/logs endpoint
- [x] 6.7 Build frontend body weight input form
- [x] 6.8 Build frontend workout logging form with type selector
- [ ] 6.9 Write body/workout API tests

## 7. Ingredient Analysis
- [x] 7.1 Implement MockAIService for ingredient analysis
- [x] 7.2 Implement RealAIService for ingredient analysis
- [x] 7.3 Create Pydantic schemas for ingredient check requests/responses
- [x] 7.4 Implement POST /api/v1/ingredient/analyze endpoint
- [x] 7.5 Implement GET /api/v1/ingredient/checks endpoint (history)
- [x] 7.6 Build frontend ingredient analysis page with textarea input
- [x] 7.7 Display structured verdict cards (推荐/谨慎/不推荐)
- [ ] 7.8 Write ingredient analysis API tests

## 8. Daily Insights
- [x] 8.1 Implement MockAIService for daily insights generation
- [x] 8.2 Implement RealAIService for daily insights generation
- [x] 8.3 Create Pydantic schemas for insight requests/responses
- [x] 8.4 Implement service layer to aggregate daily logs (food + workout + body)
- [x] 8.5 Implement POST /api/v1/insight/generate endpoint
- [x] 8.6 Implement GET /api/v1/insight/daily endpoint (query by date)
- [x] 8.7 Build frontend daily insight card component
- [x] 8.8 Display gap summary, reasons, and next actions
- [ ] 8.9 Write daily insights API tests

## 9. Dashboard & Data Visualization
- [x] 9.1 Implement GET /api/v1/dashboard/weight-trend endpoint
- [x] 9.2 Implement GET /api/v1/dashboard/completion-rate endpoint
- [x] 9.3 Implement GET /api/v1/dashboard/weekly-insight endpoint
- [x] 9.4 Build frontend dashboard page layout (3-card grid)
- [x] 9.5 Implement weight trend chart component (7/30 day toggle)
- [x] 9.6 Implement completion rate circular progress component
- [x] 9.7 Implement weekly insight card component
- [x] 9.8 Add empty state handling for no data scenarios
- [ ] 9.9 Write dashboard API tests

## 10. AI Chat Assistant
- [x] 10.1 Implement MockAIService for chat responses
- [x] 10.2 Implement RealAIService for chat responses
- [x] 10.3 Create Pydantic schemas for chat requests/responses
- [x] 10.4 Implement POST /api/v1/chat/message endpoint with context support
- [x] 10.5 Implement GET /api/v1/chat/history endpoint
- [x] 10.6 Build frontend chat widget component (floating button)
- [x] 10.7 Implement chat window with message history
- [x] 10.8 Add context-aware chat (pass current page and date)
- [x] 10.9 Implement quick commands (/analyze_today, /ingredient)
- [x] 10.10 Add medical disclaimer and safety boundaries
- [ ] 10.11 Write chat API tests

## 11. Frontend Polish & UX
- [x] 11.1 Implement loading states for all async operations
- [x] 11.2 Add error handling and user-friendly error messages
- [x] 11.3 Implement toast notifications for success/error feedback
- [x] 11.4 Add form validation with clear error messages
- [x] 11.5 Implement responsive design for mobile devices
- [x] 11.6 Add medical disclaimer footer to all pages
- [x] 11.7 Optimize page load performance (code splitting, lazy loading)
- [x] 11.8 Add accessibility features (ARIA labels, keyboard navigation)

## 12. Testing & Quality Assurance
- [ ] 12.1 Write unit tests for backend services
- [ ] 12.2 Write API integration tests for all endpoints
- [ ] 12.3 Write security tests (unauthorized access, cross-user data access)
- [ ] 12.4 Write frontend component tests for key UI elements
- [ ] 12.5 Write E2E tests for critical user flows
- [ ] 12.6 Verify AI key not exposed in frontend build
- [ ] 12.7 Test mock mode functionality end-to-end
- [ ] 12.8 Perform manual testing of all features

## 13. Documentation & Deployment
- [x] 13.1 Document API endpoints (FastAPI auto-generates /docs)
- [x] 13.2 Create README with setup instructions
- [x] 13.3 Document environment variables and configuration
- [ ] 13.4 Create deployment guide for production
- [ ] 13.5 Set up CI/CD pipeline (optional)
- [ ] 13.6 Deploy backend to production environment
- [ ] 13.7 Deploy frontend to production environment
- [ ] 13.8 Configure production database and run migrations
- [ ] 13.9 Verify HTTPS and security configurations
- [ ] 13.10 Perform smoke tests in production

