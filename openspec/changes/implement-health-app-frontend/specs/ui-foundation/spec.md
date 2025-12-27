# UI Foundation Specification

## ADDED Requirements

### Requirement: AppShell Component
The system SHALL provide a navigation shell component following the reference project pattern.

#### Scenario: Desktop sidebar navigation
- **WHEN** viewing the app on desktop (≥768px width)
- **THEN** display fixed sidebar on the left (width: 256px)
- **AND** show app logo and name at the top
- **AND** display navigation items with icons and labels
- **AND** highlight active route with primary color
- **AND** apply hover states to inactive items

#### Scenario: Mobile bottom navigation
- **WHEN** viewing the app on mobile (<768px width)
- **THEN** display fixed bottom navigation bar
- **AND** show navigation items with icons and labels
- **AND** highlight active route with primary color
- **AND** hide sidebar completely

#### Scenario: Navigation items
- **WHEN** rendering navigation
- **THEN** include "Dashboard" with Home icon linking to /dashboard
- **AND** include "Food Log" with UtensilsCrossed icon linking to /log
- **AND** include "Body" with Activity icon linking to /body
- **AND** include "Insights" with TrendingUp icon linking to /insights
- **AND** include "Chat" with MessageCircle icon linking to /chat

#### Scenario: Content area
- **WHEN** rendering main content
- **THEN** apply left padding on desktop (pl-64)
- **AND** apply bottom padding on mobile (pb-20)
- **AND** ensure content is scrollable
- **AND** maintain minimum height of 100vh

### Requirement: Theme Provider
The system SHALL provide theme support with light and dark modes.

#### Scenario: Theme initialization
- **WHEN** app loads
- **THEN** detect system theme preference
- **AND** apply theme to root html element
- **AND** persist theme choice in localStorage

#### Scenario: CSS variables
- **WHEN** theme is applied
- **THEN** update CSS variable values for current theme
- **AND** ensure smooth transition between themes
- **AND** apply theme to all shadcn/ui components

### Requirement: Utility Functions
The system SHALL provide utility functions for common operations.

#### Scenario: cn() helper
- **WHEN** combining CSS classes
- **THEN** merge Tailwind classes without conflicts
- **AND** handle conditional classes
- **AND** remove duplicate classes
- **AND** return single className string

#### Scenario: Date formatting
- **WHEN** formatting dates
- **THEN** use date-fns for consistent formatting
- **AND** support relative time (e.g., "2 hours ago")
- **AND** support locale-specific formats

### Requirement: Loading States
The system SHALL provide consistent loading indicators.

#### Scenario: Loading spinner
- **WHEN** displaying loading state
- **THEN** show animated spinner icon
- **AND** center spinner in container
- **AND** support size variants (sm, md, lg)
- **AND** support color variants

#### Scenario: Skeleton loaders
- **WHEN** loading content
- **THEN** display skeleton placeholders matching content shape
- **AND** animate with pulse effect
- **AND** maintain layout stability

#### Scenario: Progress indicators
- **WHEN** showing progress
- **THEN** display progress bar with percentage
- **AND** support indeterminate state
- **AND** show progress text when available

### Requirement: Empty States
The system SHALL provide informative empty state components.

#### Scenario: No data empty state
- **WHEN** no data is available
- **THEN** display icon representing the feature
- **AND** show descriptive heading
- **AND** provide helpful message
- **AND** include call-to-action button when applicable

#### Scenario: Error empty state
- **WHEN** error occurs loading data
- **THEN** display error icon
- **AND** show error message
- **AND** provide retry button
- **AND** log error details for debugging

### Requirement: Toast Notifications
The system SHALL provide toast notifications for user feedback.

#### Scenario: Success toast
- **WHEN** operation succeeds
- **THEN** display success toast with checkmark icon
- **AND** show success message
- **AND** auto-dismiss after 3 seconds
- **AND** allow manual dismissal

#### Scenario: Error toast
- **WHEN** operation fails
- **THEN** display error toast with X icon
- **AND** show error message
- **AND** auto-dismiss after 5 seconds
- **AND** allow manual dismissal

#### Scenario: Info toast
- **WHEN** showing information
- **THEN** display info toast with info icon
- **AND** show info message
- **AND** auto-dismiss after 4 seconds

#### Scenario: Toast positioning
- **WHEN** displaying toasts
- **THEN** position toasts at bottom-right on desktop
- **AND** position toasts at top-center on mobile
- **AND** stack multiple toasts vertically
- **AND** limit to 3 visible toasts maximum

### Requirement: Responsive Hooks
The system SHALL provide hooks for responsive behavior.

#### Scenario: Mobile detection
- **WHEN** using useMobile hook
- **THEN** return true when viewport width <768px
- **AND** return false when viewport width ≥768px
- **AND** update on window resize
- **AND** use matchMedia for performance

#### Scenario: Breakpoint detection
- **WHEN** checking breakpoints
- **THEN** support sm (640px), md (768px), lg (1024px), xl (1280px)
- **AND** return current breakpoint name
- **AND** update on window resize

### Requirement: Form Components
The system SHALL provide form components integrated with react-hook-form.

#### Scenario: Form field wrapper
- **WHEN** rendering form field
- **THEN** display label above input
- **AND** show validation error below input
- **AND** apply error styling when invalid
- **AND** support required indicator

#### Scenario: Input validation
- **WHEN** validating input
- **THEN** show error message from zod schema
- **AND** apply error border color
- **AND** prevent form submission when invalid
- **AND** focus first invalid field on submit

### Requirement: Card Components
The system SHALL provide card components for content organization.

#### Scenario: Basic card
- **WHEN** rendering card
- **THEN** apply border and rounded corners
- **AND** use background color from theme
- **AND** support padding variants
- **AND** support hover effects

#### Scenario: Card composition
- **WHEN** using card components
- **THEN** support CardHeader for title area
- **AND** support CardContent for main content
- **AND** support CardFooter for actions
- **AND** allow flexible composition

### Requirement: Button Components
The system SHALL provide button components with variants.

#### Scenario: Button variants
- **WHEN** rendering buttons
- **THEN** support default variant (primary background)
- **AND** support secondary variant (muted background)
- **AND** support outline variant (border only)
- **AND** support ghost variant (transparent)
- **AND** support destructive variant (red)

#### Scenario: Button sizes
- **WHEN** sizing buttons
- **THEN** support sm size (small padding)
- **AND** support default size (medium padding)
- **AND** support lg size (large padding)
- **AND** support icon size (square, icon only)

#### Scenario: Button states
- **WHEN** button state changes
- **THEN** show loading spinner when loading
- **AND** disable interaction when disabled
- **AND** apply hover effects when enabled
- **AND** show focus ring for keyboard navigation

### Requirement: Accessibility
The system SHALL ensure components are accessible.

#### Scenario: Keyboard navigation
- **WHEN** navigating with keyboard
- **THEN** support Tab key for focus movement
- **AND** support Enter/Space for button activation
- **AND** support Escape for dialog dismissal
- **AND** show visible focus indicators

#### Scenario: Screen reader support
- **WHEN** using screen reader
- **THEN** provide ARIA labels for icons
- **AND** announce toast notifications
- **AND** describe form validation errors
- **AND** indicate loading states

#### Scenario: Color contrast
- **WHEN** applying colors
- **THEN** ensure 4.5:1 contrast ratio for text
- **AND** ensure 3:1 contrast ratio for UI components
- **AND** support high contrast mode

