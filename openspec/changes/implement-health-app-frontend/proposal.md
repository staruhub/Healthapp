# Implement Health App Frontend

## Why

The health app MVP requires a complete frontend implementation following the technical architecture defined in `add-health-app-mvp`. A reference implementation exists at `ai-health-management/` that demonstrates the desired code quality, component patterns, and styling approach. This proposal defines the frontend implementation tasks aligned with the reference project's patterns while implementing the health app MVP features.

**Key Drivers:**
- Implement all 7 core features defined in the MVP proposal
- Follow established patterns from the reference project for consistency
- Use modern Next.js 14 App Router patterns with TypeScript
- Leverage shadcn/ui component library with Tailwind CSS
- Ensure responsive design for mobile and desktop
- Maintain clean component architecture and separation of concerns

## What Changes

This proposal implements the complete frontend application for the health app MVP, organized into 9 capability areas:

### 1. Project Setup & Foundation
- Initialize Next.js 14 project with TypeScript and App Router
- Configure shadcn/ui with "new-york" style variant
- Set up project structure following reference patterns
- Configure path aliases (@/components, @/lib, @/hooks)
- Install and configure dependencies (React Query, Zustand, date-fns, recharts)

### 2. UI Foundation & Shared Components
- Implement AppShell component with sidebar and bottom navigation
- Create reusable card components (StatsCard, MetricCard)
- Set up theme provider and global styles
- Implement toast notification system
- Create loading states and error boundaries

### 3. Authentication Pages
- Login page with email/password form
- Registration page with validation
- Password strength indicator
- Form validation using react-hook-form + zod
- Auth state management with Zustand
- Token storage and refresh logic

### 4. Onboarding Flow
- Multi-step onboarding wizard
- Profile setup form (name, age, gender, height, weight)
- Goal selection (cut/bulk/gain/maintain)
- Target calorie calculation
- Progress indicator

### 5. Food Logging UI
- Natural language input textarea
- AI parsing loading states with progress messages
- Structured food item display with calorie ranges
- Portion adjustment dropdowns
- Daily food log list with meal type badges
- Summary card showing consumed/goal/remaining calories

### 6. Body & Workout Tracking UI
- Weight logging form with 0.1kg precision
- Workout logging form (type selector, duration, notes)
- Weight trend chart (7/30 day toggle) using recharts
- Workout history list
- Empty states for new users

### 7. Ingredient Analysis UI
- Textarea for pasting ingredient lists
- Analysis result card with verdict badges (推荐/谨慎/不推荐)
- Goal-aligned recommendations display
- Analysis history list
- Loading states during AI processing

### 8. Daily Insights UI
- Daily summary card with gap analysis
- Attribution section showing reasons (2-3 items)
- Actionable recommendations list (max 3)
- Cautions and disclaimers
- Generate insight button with loading state

### 9. Dashboard UI
- 3-card layout: weight trends, completion rates, weekly insights
- Weight trend line chart (recharts)
- Circular progress indicators for goal completion
- Weekly insight summary card
- Empty states when no data available
- Responsive grid layout

### 10. AI Chat Widget
- Floating chat button (bottom-right corner)
- Slide-in chat window with animation
- Message history display
- Context-aware message input
- Quick command buttons (/analyze_today, /ingredient)
- Medical disclaimer footer
- Visibility control (hidden on /auth and /onboarding)

## Impact

### Affected Specs
This implementation creates frontend components for all capabilities defined in `add-health-app-mvp`:
- `auth` - Login, registration, and auth state management
- `food-logging` - Natural language food input and display
- `body-tracking` - Weight and workout logging UI
- `ingredient-analysis` - Ingredient paste and analysis display
- `daily-insights` - Daily summary and recommendations UI
- `dashboard` - Data visualization and trends
- `ai-chat` - Global chat widget

### Affected Code
**New directories and files:**
- `frontend/` - Complete Next.js application
  - `app/` - App Router pages and layouts
    - `(auth)/` - Login and registration pages
    - `(main)/` - Main app pages (log, dashboard, insights, chat)
    - `onboarding/` - User profile setup wizard
    - `layout.tsx` - Root layout with fonts and providers
    - `globals.css` - Global styles and CSS variables
  - `components/` - React components
    - `ui/` - shadcn/ui components (40+ components)
    - `app-shell.tsx` - Main navigation shell
    - `food/` - Food logging components
    - `body/` - Body tracking components
    - `ingredient/` - Ingredient analysis components
    - `insights/` - Daily insights components
    - `dashboard/` - Dashboard components
    - `chat/` - Chat widget components
  - `lib/` - Utilities and API client
    - `utils.ts` - cn() helper and utilities
    - `api-client.ts` - Axios instance with interceptors
    - `auth.ts` - Auth utilities and token management
  - `hooks/` - Custom React hooks
    - `use-auth.ts` - Auth state hook
    - `use-toast.ts` - Toast notification hook
    - `use-mobile.ts` - Mobile detection hook
  - `store/` - Zustand stores
    - `auth-store.ts` - Authentication state
    - `chat-store.ts` - Chat widget state
  - `types/` - TypeScript type definitions
    - `api.ts` - API request/response types
    - `models.ts` - Domain model types

**Configuration files:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `.env.example` - Environment variable template

### Code Style Patterns (from reference project)

**Component Organization:**
- Feature-based component folders (food/, dashboard/, chat/)
- Shared UI components in components/ui/
- One component per file with clear naming
- Props interfaces defined inline or exported

**TypeScript Patterns:**
- Strict mode enabled
- Interface for component props
- Type imports using `import type`
- Proper typing for all functions and variables

**Styling Approach:**
- Tailwind CSS utility classes
- cn() helper for conditional classes
- CSS variables for theming
- Responsive design with md: and lg: breakpoints

**State Management:**
- Zustand for global state (auth, UI preferences)
- React Query for server state (not in reference, but specified in MVP)
- Local useState for component state
- Form state with react-hook-form

**File Naming:**
- kebab-case for files: `food-entry-card.tsx`
- PascalCase for components: `FoodEntryCard`
- Descriptive names: `add-food-dialog.tsx` not `dialog.tsx`

### Migration Path
1. Initialize Next.js project with pnpm
2. Install and configure shadcn/ui components
3. Set up project structure and configuration files
4. Implement UI foundation (AppShell, theme, shared components)
5. Build authentication pages and state management
6. Implement feature pages sequentially (food → body → ingredient → insights → dashboard → chat)
7. Add polish (loading states, error handling, responsive design)
8. Test all features end-to-end

### Performance Targets
- First Contentful Paint: ≤1.5s
- Time to Interactive: ≤2.5s
- Lighthouse Performance Score: ≥90
- Bundle size: ≤500KB (gzipped)

### Testing Requirements
- Component tests for key UI elements
- Form validation tests
- Auth flow E2E tests
- Responsive design verification
- Accessibility audit (WCAG 2.1 AA)

