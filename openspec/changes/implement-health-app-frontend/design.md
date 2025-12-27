# Frontend Implementation Design

## Context

This design document defines the frontend implementation approach for the health app MVP, based on patterns established in the reference project at `ai-health-management/`. The implementation follows Next.js 14 App Router conventions with TypeScript, shadcn/ui components, and Tailwind CSS.

**Reference Project Analysis:**
- Uses Next.js 16.0.10 (latest stable) with App Router
- shadcn/ui "new-york" style variant with neutral base color
- Component organization: feature folders + shared ui/
- TypeScript strict mode with path aliases
- Responsive design: mobile-first with bottom nav, desktop sidebar
- No state management library in reference (uses local state)
- Mock data pattern for development

**Key Constraints:**
- Must align with backend API contracts defined in MVP specs
- Must support both mock and real API modes
- Must be responsive (mobile and desktop)
- Must follow accessibility best practices
- Must maintain <500KB bundle size

## Goals / Non-Goals

### Goals
- Implement all 7 MVP features with high-quality UI/UX
- Follow reference project's code style and patterns
- Create reusable component library for future features
- Ensure responsive design works on mobile and desktop
- Implement proper loading and error states
- Set up proper TypeScript types for all API interactions

### Non-Goals
- Image upload/OCR (deferred to phase 2)
- Offline support/PWA (deferred to phase 2)
- Advanced animations (keep simple for MVP)
- Internationalization (English/Chinese only, hardcoded)
- Dark mode toggle (use system preference only)

## Decisions

### Decision 1: Project Structure - Feature-Based Organization

**Rationale:**
- Reference project uses feature-based component folders
- Easier to locate related components
- Scales better than flat structure
- Clear separation between shared UI and feature components

**Structure:**
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (main)/            # Main app route group
│   │   ├── log/           # Food logging
│   │   ├── body/          # Body tracking
│   │   ├── ingredient/    # Ingredient analysis
│   │   ├── insights/      # Daily insights
│   │   ├── dashboard/     # Dashboard
│   │   └── chat/          # Chat (optional page)
│   ├── onboarding/        # Onboarding wizard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── app-shell.tsx      # Navigation shell
│   ├── food/              # Food feature components
│   ├── body/              # Body feature components
│   ├── ingredient/        # Ingredient feature components
│   ├── insights/          # Insights feature components
│   ├── dashboard/         # Dashboard feature components
│   └── chat/              # Chat feature components
├── lib/
│   ├── utils.ts           # cn() and utilities
│   ├── api-client.ts      # Axios instance
│   └── auth.ts            # Auth utilities
├── hooks/
│   ├── use-auth.ts        # Auth hook
│   └── use-toast.ts       # Toast hook
├── store/
│   ├── auth-store.ts      # Zustand auth store
│   └── chat-store.ts      # Zustand chat store
└── types/
    ├── api.ts             # API types
    └── models.ts          # Domain types
```

### Decision 2: State Management - Zustand + React Query

**Rationale:**
- Reference project uses local state only (simple)
- MVP spec requires React Query for server state
- Zustand for minimal global state (auth, chat widget)
- Avoid Redux complexity for MVP scope

**State Distribution:**
- **Zustand**: Auth state, chat widget open/closed, user profile
- **React Query**: All API data with caching and revalidation
- **Local State**: Form inputs, UI interactions, temporary state

**Implementation:**
```typescript
// store/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens: (access: string, refresh: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

### Decision 3: API Client - Axios with Interceptors

**Rationale:**
- Centralized API configuration
- Automatic token injection
- Token refresh on 401 errors
- Request/response type safety

**Implementation:**
```typescript
// lib/api-client.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth-store'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

// Request interceptor: inject access token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/v1/auth/refresh', { refresh_token: refreshToken })
          useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
          // Retry original request
          error.config.headers.Authorization = `Bearer ${data.access_token}`
          return apiClient.request(error.config)
        } catch {
          useAuthStore.getState().clearAuth()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Decision 4: Form Handling - react-hook-form + zod

**Rationale:**
- Reference project uses react-hook-form
- zod for schema validation (type-safe)
- Integrates well with shadcn/ui form components
- Reduces boilerplate for form state management

**Pattern:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    // API call
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

### Decision 5: Component Patterns - Composition over Props

**Rationale:**
- Reference project uses composition patterns
- More flexible than prop drilling
- Easier to extend and customize
- Follows React best practices

**Examples:**
```typescript
// Good: Composition
<Card>
  <CardHeader>
    <CardTitle>Food Log</CardTitle>
  </CardHeader>
  <CardContent>
    {entries.map(entry => <FoodEntryCard key={entry.id} entry={entry} />)}
  </CardContent>
</Card>

// Avoid: Too many props
<FoodLogCard 
  title="Food Log" 
  entries={entries} 
  showHeader={true}
  headerClassName="..."
  contentClassName="..."
/>
```

### Decision 6: Styling - Tailwind Utility Classes

**Rationale:**
- Reference project uses Tailwind extensively
- shadcn/ui built on Tailwind
- Fast development with utility classes
- Consistent spacing and colors via design tokens

**Patterns:**
- Use cn() helper for conditional classes
- Responsive breakpoints: sm, md, lg
- Color palette: use CSS variables (--primary, --muted, etc.)
- Spacing: use Tailwind scale (p-4, gap-2, etc.)

**Example:**
```typescript
<div className={cn(
  "flex items-center gap-3 rounded-lg px-3 py-2.5",
  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
)}>
```

### Decision 7: Data Fetching - React Query Hooks

**Rationale:**
- Automatic caching and revalidation
- Loading and error states built-in
- Optimistic updates for better UX
- Stale-while-revalidate pattern

**Pattern:**
```typescript
// hooks/use-food-logs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export function useFoodLogs(date: string) {
  return useQuery({
    queryKey: ['food-logs', date],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/food/logs?date=${date}`)
      return data
    },
  })
}

export function useAddFoodLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (log: FoodLogInput) => {
      const { data } = await apiClient.post('/api/v1/food/logs', log)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-logs'] })
    },
  })
}
```

## Risks / Trade-offs

### Risk 1: Bundle Size
**Impact:** Large bundle affects load time
**Mitigation:**
- Use dynamic imports for heavy components (charts, chat)
- Tree-shake unused shadcn/ui components
- Analyze bundle with @next/bundle-analyzer
- Target: <500KB gzipped

### Risk 2: API Contract Changes
**Impact:** Frontend breaks if backend API changes
**Mitigation:**
- Define TypeScript types from OpenAPI spec
- Use mock data during development
- Version API endpoints (/api/v1/)
- Comprehensive integration tests

### Risk 3: Mobile Performance
**Impact:** Slow on low-end mobile devices
**Mitigation:**
- Optimize images (Next.js Image component)
- Lazy load non-critical components
- Minimize JavaScript execution
- Test on real devices

## Open Questions

1. **Mock data strategy?** Use MSW (Mock Service Worker) or simple mock functions?
   - **Recommendation:** Simple mock functions in lib/mock-data.ts (like reference project)

2. **Error tracking?** Sentry or built-in logging?
   - **Recommendation:** Console logging for MVP, Sentry for production

3. **Analytics?** Vercel Analytics or Google Analytics?
   - **Recommendation:** Vercel Analytics (already in reference project)

4. **Deployment?** Vercel or self-hosted?
   - **Recommendation:** Vercel for MVP (zero-config, fast)

