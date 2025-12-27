# Project Setup Specification

## ADDED Requirements

### Requirement: Next.js Project Initialization
The system SHALL initialize a Next.js 14 project with TypeScript and App Router following the reference project patterns.

#### Scenario: Create Next.js project
- **WHEN** initializing the frontend project
- **THEN** use Next.js 14+ with App Router enabled
- **AND** enable TypeScript with strict mode
- **AND** include Tailwind CSS configuration
- **AND** use pnpm as package manager
- **AND** configure ESLint for code quality

#### Scenario: Configure TypeScript
- **WHEN** setting up TypeScript configuration
- **THEN** enable strict mode in tsconfig.json
- **AND** configure path aliases: @/components, @/lib, @/hooks, @/store, @/types
- **AND** set target to ES6 or higher
- **AND** enable incremental compilation

#### Scenario: Project structure
- **WHEN** creating project directories
- **THEN** create app/ for Next.js pages and layouts
- **AND** create components/ for React components
- **AND** create lib/ for utilities and API client
- **AND** create hooks/ for custom React hooks
- **AND** create store/ for Zustand state stores
- **AND** create types/ for TypeScript type definitions

### Requirement: shadcn/ui Configuration
The system SHALL configure shadcn/ui component library with "new-york" style variant.

#### Scenario: Initialize shadcn/ui
- **WHEN** setting up shadcn/ui
- **THEN** use "new-york" style variant
- **AND** enable React Server Components (rsc: true)
- **AND** set baseColor to "neutral"
- **AND** enable CSS variables (cssVariables: true)
- **AND** configure component aliases in components.json

#### Scenario: Install base components
- **WHEN** installing shadcn/ui components
- **THEN** install button, card, input, label, form components
- **AND** install dialog, toast, badge, separator components
- **AND** install select, textarea, progress, tabs components
- **AND** all components use lucide-react for icons

### Requirement: Dependency Management
The system SHALL install and configure all required dependencies using pnpm.

#### Scenario: Install core dependencies
- **WHEN** setting up project dependencies
- **THEN** install next@latest (14+), react@latest, react-dom@latest
- **AND** install typescript@5, @types/node, @types/react, @types/react-dom
- **AND** install tailwindcss@latest, autoprefixer, postcss
- **AND** install class-variance-authority, clsx, tailwind-merge

#### Scenario: Install state management
- **WHEN** installing state management libraries
- **THEN** install zustand@4+ for global state
- **AND** install @tanstack/react-query@5+ for server state
- **AND** install zustand/middleware for persistence

#### Scenario: Install form handling
- **WHEN** installing form libraries
- **THEN** install react-hook-form@7+
- **AND** install @hookform/resolvers for validation
- **AND** install zod@3+ for schema validation

#### Scenario: Install utilities
- **WHEN** installing utility libraries
- **THEN** install axios@1+ for API client
- **AND** install date-fns@3+ for date formatting
- **AND** install recharts@2+ for data visualization
- **AND** install lucide-react for icons
- **AND** install sonner for toast notifications

### Requirement: Environment Configuration
The system SHALL provide environment variable templates for configuration.

#### Scenario: Create environment template
- **WHEN** setting up environment configuration
- **THEN** create .env.example file
- **AND** include NEXT_PUBLIC_API_URL variable
- **AND** include NEXT_PUBLIC_AI_MODE variable (mock/real)
- **AND** add comments explaining each variable

#### Scenario: Environment variable usage
- **WHEN** accessing environment variables
- **THEN** use NEXT_PUBLIC_ prefix for client-side variables
- **AND** validate required variables at build time
- **AND** provide sensible defaults for development

### Requirement: Tailwind CSS Configuration
The system SHALL configure Tailwind CSS with design tokens and CSS variables.

#### Scenario: Configure Tailwind
- **WHEN** setting up Tailwind configuration
- **THEN** extend theme with custom colors using CSS variables
- **AND** configure content paths for all component files
- **AND** enable dark mode with class strategy
- **AND** include tailwindcss-animate plugin

#### Scenario: CSS variables
- **WHEN** defining CSS variables in globals.css
- **THEN** define --background, --foreground colors
- **AND** define --primary, --primary-foreground colors
- **AND** define --secondary, --secondary-foreground colors
- **AND** define --muted, --muted-foreground colors
- **AND** define --accent, --accent-foreground colors
- **AND** define --destructive, --destructive-foreground colors
- **AND** define --border, --input, --ring colors
- **AND** define --radius for border radius

### Requirement: Code Quality Tools
The system SHALL configure linting and formatting tools.

#### Scenario: ESLint configuration
- **WHEN** setting up ESLint
- **THEN** use Next.js recommended ESLint config
- **AND** enable TypeScript ESLint rules
- **AND** configure import order rules
- **AND** enable accessibility linting

#### Scenario: Package scripts
- **WHEN** defining npm scripts
- **THEN** include "dev" script for development server
- **AND** include "build" script for production build
- **AND** include "start" script for production server
- **AND** include "lint" script for code linting
- **AND** include "type-check" script for TypeScript validation

### Requirement: Next.js Configuration
The system SHALL configure Next.js for optimal performance and development experience.

#### Scenario: Configure next.config.mjs
- **WHEN** setting up Next.js configuration
- **THEN** enable React strict mode
- **AND** configure image domains for external images
- **AND** enable SWC minification
- **AND** configure output: 'standalone' for Docker deployment

#### Scenario: Font optimization
- **WHEN** configuring fonts
- **THEN** use next/font/google for Google Fonts
- **AND** load Inter font with latin subset
- **AND** apply font using CSS variable
- **AND** enable font display swap

### Requirement: Development Workflow
The system SHALL provide efficient development workflow.

#### Scenario: Hot reload
- **WHEN** running development server
- **THEN** enable fast refresh for instant updates
- **AND** preserve component state during edits
- **AND** show error overlay for build errors

#### Scenario: Type checking
- **WHEN** developing with TypeScript
- **THEN** provide real-time type checking in IDE
- **AND** show type errors in terminal during dev
- **AND** fail build on type errors

### Requirement: Build Optimization
The system SHALL optimize production builds for performance.

#### Scenario: Production build
- **WHEN** building for production
- **THEN** minify JavaScript and CSS
- **AND** optimize images automatically
- **AND** generate static pages where possible
- **AND** code-split by route
- **AND** tree-shake unused code

#### Scenario: Bundle analysis
- **WHEN** analyzing bundle size
- **THEN** target <500KB gzipped for main bundle
- **AND** lazy load heavy components (charts, chat)
- **AND** use dynamic imports for code splitting

