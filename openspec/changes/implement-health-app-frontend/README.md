# Health App Frontend Implementation - OpenSpec Proposal

## Overview

This OpenSpec proposal defines the frontend implementation for the AI-powered health management application, based on the MVP requirements in `add-health-app-mvp` and code patterns from the reference project at `ai-health-management/`.

## Proposal Structure

```
openspec/changes/implement-health-app-frontend/
├── proposal.md          # Why, what changes, and impact
├── design.md            # Technical design decisions and patterns
├── tasks.md             # 156 implementation tasks in 13 phases
├── README.md            # This file
└── specs/               # Capability specifications
    ├── project-setup/
    │   └── spec.md      # Next.js project initialization and configuration
    └── ui-foundation/
        └── spec.md      # Shared UI components and utilities
```

## Key Features

This proposal implements the frontend for all 7 MVP capabilities:

### 1. **Authentication Pages** (`auth-pages/`)
- Login and registration forms with validation
- Password strength indicator
- JWT token management
- Auth state with Zustand

### 2. **Onboarding Flow** (`onboarding/`)
- Multi-step wizard for profile setup
- Goal selection (cut/bulk/gain/maintain)
- Target calorie calculation
- Progress indicator

### 3. **Food Logging UI** (`food-logging-ui/`)
- Natural language input textarea
- AI parsing with loading states
- Structured food item cards with calorie ranges
- Portion adjustment dropdowns
- Daily summary card

### 4. **Body & Workout Tracking UI** (`body-tracking-ui/`)
- Weight logging form (0.1kg precision)
- Workout logging form
- Weight trend chart (recharts)
- Workout history list

### 5. **Ingredient Analysis UI** (`ingredient-analysis-ui/`)
- Ingredient paste textarea
- Analysis result cards with verdict badges
- Goal-aligned recommendations
- Analysis history

### 6. **Daily Insights UI** (`daily-insights-ui/`)
- Daily summary card with gap analysis
- Attribution section (reasons)
- Actionable recommendations (max 3)
- Cautions and disclaimers

### 7. **Dashboard UI** (`dashboard-ui/`)
- Weight trend chart (7/30 day toggle)
- Goal completion circular progress
- Weekly insight summary
- Responsive 3-card layout

### 8. **AI Chat Widget** (`ai-chat-ui/`)
- Floating chat button (bottom-right)
- Slide-in chat window
- Message history
- Quick commands (/analyze_today, /ingredient)
- Medical disclaimer

## Technical Stack

### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x with CSS variables
- **Components**: shadcn/ui ("new-york" style)
- **Package Manager**: pnpm 8.x

### State Management
- **Global State**: Zustand 4+ (auth, chat widget)
- **Server State**: React Query 5+ (API data caching)
- **Form State**: react-hook-form 7+ with zod validation

### Utilities
- **API Client**: Axios 1+ with interceptors
- **Date Handling**: date-fns 3+
- **Charts**: recharts 2+
- **Icons**: lucide-react
- **Toasts**: sonner

## Code Patterns (from Reference Project)

### Component Organization
```
components/
├── ui/              # shadcn/ui components
├── app-shell.tsx    # Navigation shell
├── food/            # Food feature components
├── body/            # Body feature components
├── ingredient/      # Ingredient feature components
├── insights/        # Insights feature components
├── dashboard/       # Dashboard components
└── chat/            # Chat feature components
```

### File Naming Conventions
- **Files**: kebab-case (`food-entry-card.tsx`)
- **Components**: PascalCase (`FoodEntryCard`)
- **Descriptive names**: `add-food-dialog.tsx` not `dialog.tsx`

### TypeScript Patterns
- Strict mode enabled
- Interface for component props
- Type imports: `import type { ... }`
- Proper typing for all functions

### Styling Approach
- Tailwind utility classes
- `cn()` helper for conditional classes
- CSS variables for theming
- Responsive: `md:` and `lg:` breakpoints

### Component Patterns
- Composition over props
- Feature-based folders
- One component per file
- Props interfaces inline or exported

## Implementation Phases (13 Phases, 156 Tasks)

1. **Project Setup & Configuration** (9 tasks)
2. **UI Foundation & Shared Components** (11 tasks)
3. **API Client & State Management** (8 tasks)
4. **Authentication Pages** (10 tasks)
5. **Onboarding Flow** (9 tasks)
6. **Food Logging UI** (12 tasks)
7. **Body & Workout Tracking UI** (10 tasks)
8. **Ingredient Analysis UI** (10 tasks)
9. **Daily Insights UI** (9 tasks)
10. **Dashboard UI** (10 tasks)
11. **AI Chat Widget** (12 tasks)
12. **Polish & UX Enhancements** (10 tasks)
13. **Testing & Quality Assurance** (12 tasks)

## Design Highlights

### 1. **Reference Project Alignment**
- Follows exact patterns from `ai-health-management/`
- Uses same component structure and naming
- Maintains consistent code style
- Leverages proven UI patterns

### 2. **Responsive Design**
- Mobile-first approach
- Bottom navigation on mobile
- Sidebar navigation on desktop
- Responsive grid layouts

### 3. **State Management Strategy**
- Zustand for minimal global state
- React Query for server state with caching
- Local state for UI interactions
- Persistent auth state

### 4. **API Integration**
- Axios client with interceptors
- Automatic token injection
- Token refresh on 401 errors
- Type-safe request/response

### 5. **Form Handling**
- react-hook-form for state management
- zod for schema validation
- Integrated with shadcn/ui form components
- Clear error messages

### 6. **Performance Optimization**
- Code splitting by route
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Target: <500KB gzipped bundle

## Validation Status

✅ **Ready for validation**: Run `openspec validate implement-health-app-frontend --strict`

All requirements include:
- Clear requirement statements (SHALL/MUST)
- At least one scenario per requirement
- Proper scenario formatting (`#### Scenario:`)
- WHEN-THEN structure for acceptance criteria

## Next Steps

1. **Review Proposal**: Read `proposal.md`, `design.md`, and spec files
2. **Validate Proposal**: Run `openspec validate implement-health-app-frontend --strict`
3. **Approve Proposal**: Stakeholder sign-off before implementation
4. **Begin Implementation**: Follow `tasks.md` sequentially
5. **Track Progress**: Update task checkboxes as work completes

## Quick Commands

```bash
# Validate proposal
openspec validate implement-health-app-frontend --strict

# View proposal summary
openspec show implement-health-app-frontend

# List all tasks
cat openspec/changes/implement-health-app-frontend/tasks.md

# Start implementation
cd frontend
pnpm install
pnpm dev
```

## Reference

- **Parent Proposal**: `openspec/changes/add-health-app-mvp/`
- **Reference Project**: `ai-health-management/`
- **PRD**: `/Volumes/Ventoy/Playground/Healthapp/prd.md`
- **OpenSpec Guide**: `openspec/AGENTS.md`

