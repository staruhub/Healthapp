# Reference Project Patterns - Implementation Guide

This document maps patterns from the reference project (`ai-health-management/`) to the health app implementation.

## Component Patterns

### Pattern 1: AppShell Navigation

**Reference Project:**
```typescript
// components/app-shell.tsx
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card md:block">
        {/* Navigation items */}
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden">
        {/* Navigation items */}
      </nav>
      
      <main className="min-h-screen">{children}</main>
    </div>
  )
}
```

**Health App Implementation:**
- Use same structure with updated navigation items
- Navigation: Dashboard, Food Log, Body, Insights, Chat
- Same responsive behavior (sidebar desktop, bottom nav mobile)

### Pattern 2: Feature Component Cards

**Reference Project:**
```typescript
// components/food/food-entry-card.tsx
export function FoodEntryCard({ entry }: FoodEntryCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {entry.imageUrl && (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={entry.imageUrl} alt={entry.name} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium leading-tight text-foreground">{entry.name}</h3>
              <Badge variant="secondary" className={mealTypeColors[entry.mealType]}>
                {entry.mealType}
              </Badge>
            </div>
            {/* Nutrition info */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Health App Implementation:**
- Apply same card pattern to food logs, workout logs, insights
- Use Card + CardContent composition
- Flex layout with image + content
- Badge for categorization (meal type, workout type, verdict)

### Pattern 3: Stats Card with Progress

**Reference Project:**
```typescript
// components/dashboard/stats-card.tsx
export function StatsCard({ title, value, subtitle, icon: Icon, progress, variant }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", variant === "primary" && "bg-primary text-primary-foreground")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Health App Implementation:**
- Use for dashboard cards (weight, calories, workouts)
- Support variant prop for primary/secondary styling
- Include progress bar for goal completion
- Icon in top-right corner

### Pattern 4: Page Layout

**Reference Project:**
```typescript
// app/food-log/page.tsx
export default function FoodLogPage() {
  const [entries, setEntries] = useState<FoodEntry[]>(mockFoodEntries)
  
  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Food Log</h1>
            <p className="text-muted-foreground">Track what you eat</p>
          </div>
          <AddFoodDialog onAdd={handleAddFood} />
        </div>
        
        {/* Summary Card */}
        <Card className="mb-6 bg-primary text-primary-foreground">
          {/* Summary content */}
        </Card>
        
        {/* Entries List */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Today's Entries</h2>
          <div className="space-y-3">
            {entries.map((entry) => <FoodEntryCard key={entry.id} entry={entry} />)}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
```

**Health App Implementation:**
- Wrap all main pages in AppShell
- Consistent padding: p-4 md:p-6 lg:p-8
- Header with title + description + action button
- Summary card with primary background
- List section with heading + space-y-3 for items

## Styling Patterns

### Pattern 1: cn() Helper Usage

**Reference Project:**
```typescript
className={cn(
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
  isActive
    ? "bg-primary/10 text-primary"
    : "text-muted-foreground hover:bg-muted hover:text-foreground",
)}
```

**Health App Implementation:**
- Use cn() for all conditional classes
- Base classes first, then conditional
- Use theme colors (primary, muted, foreground)

### Pattern 2: Responsive Breakpoints

**Reference Project:**
```typescript
className="pb-20 md:pb-0 md:pl-64"  // Mobile bottom padding, desktop left padding
className="hidden md:block"          // Hide on mobile, show on desktop
className="md:hidden"                // Show on mobile, hide on desktop
className="p-4 md:p-6 lg:p-8"       // Responsive padding
```

**Health App Implementation:**
- Mobile-first approach
- md: breakpoint at 768px
- lg: breakpoint at 1024px

### Pattern 3: Color System

**Reference Project:**
```typescript
// Uses CSS variables
bg-background       // Page background
text-foreground     // Primary text
bg-card            // Card background
text-muted-foreground  // Secondary text
bg-primary         // Primary color
text-primary-foreground  // Text on primary
bg-muted           // Muted background
border-border      // Border color
```

**Health App Implementation:**
- Use same CSS variable names
- Define in globals.css
- Support light/dark themes

## TypeScript Patterns

### Pattern 1: Component Props Interface

**Reference Project:**
```typescript
interface FoodEntryCardProps {
  entry: FoodEntry
}

export function FoodEntryCard({ entry }: FoodEntryCardProps) {
  // Component implementation
}
```

**Health App Implementation:**
- Define props interface above component
- Use descriptive interface names (ComponentNameProps)
- Export interface if used elsewhere

### Pattern 2: Type Imports

**Reference Project:**
```typescript
import type { ReactNode } from "react"
import type { FoodEntry } from "@/lib/mock-data"
import type { LucideIcon } from "lucide-react"
```

**Health App Implementation:**
- Use `import type` for type-only imports
- Improves tree-shaking
- Clearer intent

### Pattern 3: Mock Data Types

**Reference Project:**
```typescript
// lib/mock-data.ts
export interface FoodEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  timestamp: Date
  imageUrl?: string
}
```

**Health App Implementation:**
- Define domain types in types/models.ts
- Use string literal unions for enums
- Optional fields with ?
- Date type for timestamps

## File Organization

### Pattern 1: Feature Folders

**Reference Project:**
```
components/
├── food/
│   ├── food-entry-card.tsx
│   └── add-food-dialog.tsx
├── dashboard/
│   ├── stats-card.tsx
│   ├── macro-ring.tsx
│   └── weekly-chart.tsx
└── insights/
    └── insight-card.tsx
```

**Health App Implementation:**
- Group related components by feature
- One component per file
- Descriptive file names (kebab-case)

### Pattern 2: Shared UI Components

**Reference Project:**
```
components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── label.tsx
├── form.tsx
├── dialog.tsx
├── toast.tsx
└── badge.tsx
```

**Health App Implementation:**
- All shadcn/ui components in ui/
- Don't modify ui/ components directly
- Create wrapper components if needed

## State Management Patterns

### Pattern 1: Local State for UI

**Reference Project:**
```typescript
const [entries, setEntries] = useState<FoodEntry[]>(mockFoodEntries)
const [stats] = useState(mockTodayStats)
const [goals] = useState(mockGoals)
```

**Health App Implementation:**
- Use local state for component-specific data
- Initialize with mock data during development
- Replace with React Query hooks for real API

### Pattern 2: usePathname for Active Route

**Reference Project:**
```typescript
const pathname = usePathname()
const isActive = pathname === item.href
```

**Health App Implementation:**
- Use for navigation highlighting
- Compare pathname to route
- Apply active styles conditionally

## Summary

The reference project demonstrates:
- ✅ Clean component composition
- ✅ Consistent styling patterns
- ✅ Responsive design approach
- ✅ TypeScript best practices
- ✅ Feature-based organization
- ✅ Reusable component patterns

Apply these patterns throughout the health app implementation for consistency and maintainability.

