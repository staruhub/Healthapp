# Frontend Implementation Tasks

## 1. Project Setup & Configuration
- [x] 1.1 Initialize Next.js 14 project with TypeScript using `pnpm create next-app`
- [x] 1.2 Configure tsconfig.json with strict mode and path aliases
- [x] 1.3 Install shadcn/ui CLI and initialize with "new-york" style
- [x] 1.4 Install core dependencies (zustand, @tanstack/react-query, axios, date-fns, recharts)
- [x] 1.5 Install form dependencies (react-hook-form, @hookform/resolvers, zod)
- [x] 1.6 Configure components.json for shadcn/ui
- [x] 1.7 Set up Tailwind CSS configuration with CSS variables
- [x] 1.8 Create .env.example with NEXT_PUBLIC_API_URL
- [x] 1.9 Set up project directory structure (app/, components/, lib/, hooks/, store/, types/)

## 2. UI Foundation & Shared Components
- [x] 2.1 Install shadcn/ui components: button, card, input, label, form, dialog, toast, badge, separator
- [x] 2.2 Install shadcn/ui components: select, textarea, progress, tabs, avatar, dropdown-menu
- [x] 2.3 Create app/globals.css with CSS variables and base styles
- [x] 2.4 Create lib/utils.ts with cn() helper function
- [x] 2.5 Create components/app-shell.tsx with sidebar and bottom navigation
- [x] 2.6 Create components/theme-provider.tsx for theme support
- [x] 2.7 Create app/layout.tsx with fonts, providers, and metadata
- [x] 2.8 Create hooks/use-mobile.ts for responsive detection
- [x] 2.9 Create hooks/use-toast.ts for toast notifications
- [x] 2.10 Create components/ui/loading-spinner.tsx component
- [x] 2.11 Create components/ui/empty-state.tsx component

## 3. API Client & State Management
- [x] 3.1 Create types/api.ts with API request/response types
- [x] 3.2 Create types/models.ts with domain model types
- [x] 3.3 Create lib/api-client.ts with Axios instance and interceptors
- [x] 3.4 Create store/auth-store.ts with Zustand auth state
- [x] 3.5 Create store/chat-store.ts with Zustand chat widget state
- [x] 3.6 Create lib/auth.ts with token utilities
- [x] 3.7 Set up React Query provider in app/layout.tsx
- [x] 3.8 Create lib/mock-data.ts with mock API responses

## 4. Authentication Pages
- [x] 4.1 Create app/(auth)/layout.tsx for auth pages
- [x] 4.2 Create app/(auth)/login/page.tsx with login form
- [x] 4.3 Create app/(auth)/register/page.tsx with registration form
- [x] 4.4 Create components/auth/login-form.tsx with react-hook-form + zod
- [x] 4.5 Create components/auth/register-form.tsx with validation
- [x] 4.6 Create components/auth/password-strength.tsx indicator
- [x] 4.7 Create hooks/use-auth.ts with login/register/logout mutations
- [x] 4.8 Implement token storage and refresh logic
- [x] 4.9 Create auth middleware for protected routes
- [x] 4.10 Add loading states and error handling to auth forms

## 5. Onboarding Flow
- [x] 5.1 Create app/onboarding/page.tsx with multi-step wizard
- [x] 5.2 Create components/onboarding/step-indicator.tsx
- [x] 5.3 Create components/onboarding/profile-form.tsx (name, age, gender, height, weight)
- [x] 5.4 Create components/onboarding/goal-selector.tsx (cut/bulk/gain/maintain)
- [x] 5.5 Create components/onboarding/target-calculator.tsx for calorie calculation
- [x] 5.6 Implement form validation with zod schemas
- [x] 5.7 Create hooks/use-profile.ts for profile mutations
- [x] 5.8 Add navigation between steps with validation
- [x] 5.9 Implement profile completion check and redirect

## 6. Food Logging UI
- [x] 6.1 Create app/(main)/log/page.tsx with food logging interface
- [x] 6.2 Create components/food/food-input.tsx with natural language textarea
- [x] 6.3 Create components/food/food-item-card.tsx for parsed food items
- [x] 6.4 Create components/food/portion-selector.tsx dropdown
- [x] 6.5 Create components/food/food-log-list.tsx with meal type badges
- [x] 6.6 Create components/food/calorie-summary-card.tsx (consumed/goal/remaining)
- [x] 6.7 Create hooks/use-food-parse.ts for AI parsing mutation
- [x] 6.8 Create hooks/use-food-logs.ts for CRUD operations
- [x] 6.9 Implement loading states with progress messages during AI parsing
- [x] 6.10 Add error handling for failed parsing
- [x] 6.11 Implement portion adjustment with recalculation
- [x] 6.12 Add delete functionality for food logs

## 7. Body & Workout Tracking UI
- [x] 7.1 Create app/(main)/body/page.tsx with tracking interface
- [x] 7.2 Create components/body/weight-form.tsx with 0.1kg precision input
- [x] 7.3 Create components/body/workout-form.tsx with type selector and duration
- [x] 7.4 Create components/body/weight-chart.tsx using recharts (7/30 day toggle)
- [x] 7.5 Create components/body/workout-list.tsx with history
- [x] 7.6 Create hooks/use-body-logs.ts for weight CRUD
- [x] 7.7 Create hooks/use-workout-logs.ts for workout CRUD
- [x] 7.8 Implement chart data aggregation and formatting
- [x] 7.9 Add empty states for new users
- [x] 7.10 Implement responsive chart sizing

## 8. Ingredient Analysis UI
- [x] 8.1 Create app/(main)/ingredient/page.tsx with analysis interface
- [x] 8.2 Create components/ingredient/ingredient-input.tsx with textarea
- [x] 8.3 Create components/ingredient/analysis-result-card.tsx with verdict badges
- [x] 8.4 Create components/ingredient/recommendation-list.tsx
- [x] 8.5 Create components/ingredient/analysis-history.tsx
- [x] 8.6 Create hooks/use-ingredient-analysis.ts for analysis mutation
- [x] 8.7 Implement loading states during AI processing
- [x] 8.8 Add verdict badge styling (推荐=green, 谨慎=yellow, 不推荐=red)
- [x] 8.9 Display goal-aligned recommendations
- [x] 8.10 Add disclaimer text for analysis results

## 9. Daily Insights UI
- [x] 9.1 Create app/(main)/insights/page.tsx with insights interface
- [x] 9.2 Create components/insights/insight-card.tsx with gap analysis
- [x] 9.3 Create components/insights/attribution-section.tsx for reasons
- [x] 9.4 Create components/insights/recommendations-list.tsx (max 3 items)
- [x] 9.5 Create components/insights/generate-button.tsx with loading state
- [x] 9.6 Create hooks/use-daily-insights.ts for generation and fetching
- [x] 9.7 Implement date selector for viewing past insights
- [x] 9.8 Add cautions and disclaimers display
- [x] 9.9 Handle empty state when no logs exist for the day

## 10. Dashboard UI
- [x] 10.1 Create app/(main)/dashboard/page.tsx with 3-card layout
- [x] 10.2 Create components/dashboard/weight-trend-card.tsx with recharts line chart
- [x] 10.3 Create components/dashboard/completion-rate-card.tsx with circular progress
- [x] 10.4 Create components/dashboard/weekly-insight-card.tsx
- [x] 10.5 Create hooks/use-dashboard-data.ts for aggregated data fetching
- [x] 10.6 Implement 7/30 day toggle for weight trends
- [x] 10.7 Calculate and display goal completion percentages
- [x] 10.8 Add empty states for each card when no data
- [x] 10.9 Implement responsive grid layout (1 col mobile, 3 col desktop)
- [x] 10.10 Add loading skeletons for dashboard cards

## 11. AI Chat Widget
- [x] 11.1 Create components/chat/chat-widget.tsx floating button
- [x] 11.2 Create components/chat/chat-window.tsx slide-in panel
- [x] 11.3 Create components/chat/message-list.tsx with user/assistant messages
- [x] 11.4 Create components/chat/message-input.tsx with send button
- [x] 11.5 Create components/chat/quick-commands.tsx buttons
- [x] 11.6 Create hooks/use-chat.ts for message mutations and history
- [x] 11.7 Implement visibility control (hidden on /auth and /onboarding)
- [x] 11.8 Add context passing (current page, date) to chat API
- [x] 11.9 Implement quick command handlers (/analyze_today, /ingredient)
- [x] 11.10 Add medical disclaimer footer to chat window
- [x] 11.11 Implement chat window open/close animation
- [x] 11.12 Add auto-scroll to latest message

## 12. Polish & UX Enhancements
- [x] 12.1 Add loading spinners to all async operations
- [x] 12.2 Implement error toast notifications for API failures
- [x] 12.3 Add success toast notifications for mutations
- [x] 12.4 Implement form validation error messages
- [x] 12.5 Add responsive design testing (mobile, tablet, desktop)
- [x] 12.6 Implement keyboard navigation for forms
- [x] 12.7 Add ARIA labels for accessibility
- [x] 12.8 Optimize images with Next.js Image component (no images to optimize, only SVGs)
- [x] 12.9 Add page transitions and animations (added PageTransition component)
- [x] 12.10 Implement medical disclaimer footer on all main pages

## 13. Testing & Quality Assurance
- [x] 13.1 Test authentication flow (login, register, logout, token refresh)
- [x] 13.2 Test food logging with various inputs
- [x] 13.3 Test body and workout tracking
- [x] 13.4 Test ingredient analysis
- [x] 13.5 Test daily insights generation
- [x] 13.6 Test dashboard data visualization
- [x] 13.7 Test chat widget functionality
- [x] 13.8 Test responsive design on mobile devices
- [x] 13.9 Run Lighthouse audit (target: >90 performance)
- [x] 13.10 Verify accessibility with screen reader
- [x] 13.11 Test error scenarios (network failures, invalid inputs)
- [x] 13.12 Verify bundle size (<500KB gzipped) - 538KB gzipped, slightly over target
