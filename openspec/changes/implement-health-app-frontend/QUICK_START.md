# Frontend Implementation Quick Start Guide

This guide provides step-by-step instructions to start implementing the health app frontend.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Code editor (VS Code recommended)
- Git for version control

## Phase 1: Project Initialization (Tasks 1.1-1.9)

### Step 1: Create Next.js Project

```bash
cd /Volumes/Ventoy/Playground/Healthapp
pnpm create next-app@latest frontend --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*"
cd frontend
```

Answer prompts:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ App Router: Yes
- ✅ Customize import alias: Yes (@/*)
- ❌ src/ directory: No

### Step 2: Install shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

Answer prompts:
- Style: **new-york**
- Base color: **neutral**
- CSS variables: **Yes**

### Step 3: Install Core Dependencies

```bash
# State management
pnpm add zustand @tanstack/react-query

# Forms
pnpm add react-hook-form @hookform/resolvers zod

# API & utilities
pnpm add axios date-fns

# Charts & UI
pnpm add recharts lucide-react sonner

# Additional utilities
pnpm add class-variance-authority clsx tailwind-merge
```

### Step 4: Install shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button card input label form dialog toast badge separator select textarea progress tabs avatar dropdown-menu
```

### Step 5: Create Directory Structure

```bash
mkdir -p app/\(auth\)/login app/\(auth\)/register
mkdir -p app/\(main\)/log app/\(main\)/body app/\(main\)/ingredient app/\(main\)/insights app/\(main\)/dashboard app/\(main\)/chat
mkdir -p app/onboarding
mkdir -p components/food components/body components/ingredient components/insights components/dashboard components/chat
mkdir -p lib hooks store types
```

### Step 6: Create Environment File

```bash
cat > .env.example << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# AI Mode (mock or real)
NEXT_PUBLIC_AI_MODE=mock
EOF

cp .env.example .env.local
```

### Step 7: Update tsconfig.json

Ensure paths are configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Phase 2: UI Foundation (Tasks 2.1-2.11)

### Step 1: Create lib/utils.ts

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 2: Create components/app-shell.tsx

Copy pattern from reference project:
- Desktop sidebar (fixed, left, 256px width)
- Mobile bottom nav (fixed, bottom)
- Navigation items with icons
- Active route highlighting

### Step 3: Update app/layout.tsx

```typescript
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Health Tracker - AI-Powered Health Management",
  description: "Track your nutrition, workouts, and health goals with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

### Step 4: Create hooks/use-mobile.ts

```typescript
import { useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
```

## Phase 3: API Client & State (Tasks 3.1-3.8)

### Step 1: Create types/api.ts

```typescript
// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

// Add more types as needed
```

### Step 2: Create store/auth-store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens: (access: string, refresh: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

### Step 3: Create lib/api-client.ts

```typescript
import axios from 'axios'
import { useAuthStore } from '@/store/auth-store'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken
          })
          useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
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

## Development Workflow

### Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

### Type Checking

```bash
pnpm run type-check
```

### Linting

```bash
pnpm run lint
```

### Build for Production

```bash
pnpm run build
pnpm start
```

## Next Steps

After completing Phases 1-3:

1. **Phase 4**: Implement authentication pages (login, register)
2. **Phase 5**: Build onboarding flow
3. **Phase 6**: Create food logging UI
4. **Phase 7**: Implement body tracking UI
5. **Phase 8**: Build ingredient analysis UI
6. **Phase 9**: Create daily insights UI
7. **Phase 10**: Implement dashboard
8. **Phase 11**: Add AI chat widget
9. **Phase 12**: Polish and UX enhancements
10. **Phase 13**: Testing and QA

## Reference

- **Tasks**: `openspec/changes/implement-health-app-frontend/tasks.md`
- **Design**: `openspec/changes/implement-health-app-frontend/design.md`
- **Patterns**: `openspec/changes/implement-health-app-frontend/REFERENCE_PATTERNS.md`
- **Reference Project**: `ai-health-management/`

## Tips

- Follow the reference project patterns closely
- Use shadcn/ui components as building blocks
- Keep components small and focused
- Test responsive design on mobile and desktop
- Use TypeScript strict mode
- Commit frequently with clear messages

