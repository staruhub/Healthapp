## ADDED Requirements

### Requirement: Morandi Color Palette
The design system SHALL use a Morandi low-saturation color palette for a soft, comfortable visual experience.

Primary colors:
- 薄荷绿 `#C5DDD6` - Primary card backgrounds
- 淡紫色 `#E8DFF0` - Secondary card backgrounds  
- 米黄色 `#E8E4C8` - Accent card backgrounds
- 奶油白 `#FAF8F5` - Page main background

Neutral colors:
- 深灰 `#2D2D2D` - Main titles, important data
- 中灰 `#6B6B6B` - Body text, secondary info
- 浅灰 `#9B9B9B` - Helper text, icons

Functional colors:
- 成功绿 `#7CB69D` - Progress completion, positive feedback
- 强调紫 `#9B7BB8` - Ring charts, data visualization

#### Scenario: Light mode color application
- **WHEN** the application is in light mode
- **THEN** the page background SHALL be 奶油白 `#FAF8F5`
- **AND** cards SHALL use the Morandi palette for backgrounds

#### Scenario: Dark mode color harmony
- **WHEN** the application is in dark mode
- **THEN** colors SHALL be adjusted to maintain Morandi tone harmony
- **AND** contrast ratios SHALL meet WCAG AA standards

### Requirement: Typography System
The design system SHALL implement a 5-level typography hierarchy for clear information structure.

| Type | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| H1 | 28px | Bold (700) | 1.2 | Page titles |
| H2 | 48px | Bold (700) | 1.0 | Primary data emphasis |
| H3 | 18px | SemiBold (600) | 1.3 | Card titles |
| Body | 14px | Regular (400) | 1.5 | Body text |
| Caption | 12px | Regular (400) | 1.4 | Secondary notes |

Font family: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`

#### Scenario: Data emphasis display
- **WHEN** displaying a primary metric (e.g., completion percentage)
- **THEN** the H2 style (48px Bold) SHALL be applied

#### Scenario: Card title display
- **WHEN** rendering a card component header
- **THEN** the H3 style (18px SemiBold) SHALL be applied

### Requirement: Soft Neomorphism Card Style
Cards SHALL use large border-radius and soft shadows for a gentle, comfortable visual effect.

Properties:
- Border radius: 24px - 28px
- Padding: 20px - 24px
- Shadow: `0 4px 20px rgba(0, 0, 0, 0.05)`

#### Scenario: Standard card rendering
- **WHEN** a Card component is rendered
- **THEN** it SHALL have border-radius of at least 24px
- **AND** it SHALL have a soft diffuse shadow

#### Scenario: Large card variation
- **WHEN** a large feature card is displayed
- **THEN** border-radius SHALL be 28px
- **AND** padding SHALL be 24px

### Requirement: Spacing System
The design system SHALL use a 4px-based spacing token system.

| Token | Value | Usage |
|-------|-------|-------|
| space-xs | 4px | Compact spacing |
| space-sm | 8px | Element internal spacing |
| space-md | 16px | Card spacing |
| space-lg | 24px | Section spacing |
| space-xl | 32px | Large section spacing |

#### Scenario: Card spacing consistency
- **WHEN** multiple cards are displayed in a list
- **THEN** the gap between cards SHALL be space-md (16px)

#### Scenario: Page margins
- **WHEN** rendering page content
- **THEN** left and right margins SHALL be 20px

### Requirement: Progress Ring Component
Ring progress charts SHALL be implemented using SVG and follow specific styling guidelines for data visualization.

Implementation: SVG-based (not CSS conic-gradient)

SVG Properties:
- Element: `<svg>` with `<circle>` elements for track and fill
- Stroke width: 10px - 14px
- Stroke linecap: round
- Track background: semi-transparent white `rgba(255, 255, 255, 0.5)`
- Start angle: -90° (12 o'clock position, via `transform="rotate(-90)"`)
- Fill direction: clockwise
- Animation: stroke-dasharray/stroke-dashoffset transition

#### Scenario: Progress ring SVG rendering
- **WHEN** displaying a progress ring component
- **THEN** the component SHALL render using SVG elements
- **AND** use stroke-dasharray for progress visualization

#### Scenario: Progress ring animation
- **WHEN** progress value changes
- **THEN** the ring fill SHALL animate smoothly clockwise
- **AND** use CSS transition on stroke-dashoffset

### Requirement: Animation and Transition Guidelines
Interactive elements SHALL provide smooth feedback through consistent animations.

Default transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
Bounce effect: `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`

Card click feedback: slight scale `scale(0.98)` + shadow deepen
Button click feedback: opacity reduce `opacity: 0.8`

#### Scenario: Card interaction feedback
- **WHEN** user taps/clicks a card
- **THEN** the card SHALL scale to 0.98 with deepened shadow

#### Scenario: Button interaction feedback  
- **WHEN** user taps/clicks a button
- **THEN** the button opacity SHALL reduce to 0.8 during press

### Requirement: Data Visualization Colors
Charts SHALL use a consistent wellness-themed color palette. Recharts and other chart libraries SHALL be configured to use these colors.

CSS Variables (in globals.css):
| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| --chart-1 | `#7CB69D` | `#7AA876` | Walking/Success |
| --chart-2 | `#9B7BB8` | `#B5A8C9` | Calories/Accent |
| --chart-3 | `#C4B896` | `#C9B89E` | Distance/Neutral |
| --chart-4 | `#E8A0A0` | `#C9A8B5` | Heart Rate/Alert |
| --chart-5 | `#A8C5D9` | `#8AAAC9` | Auxiliary Data |

Recharts Integration:
- Colors SHALL be applied via CSS variables for theme consistency
- Chart components SHALL read from `--chart-*` variables
- Both light and dark mode SHALL use the defined palette

#### Scenario: Recharts color configuration
- **WHEN** rendering Recharts components (AreaChart, LineChart, BarChart)
- **THEN** fill and stroke colors SHALL use the wellness palette CSS variables
- **AND** colors SHALL automatically switch between light/dark mode

#### Scenario: Chart color application
- **WHEN** rendering health metric charts
- **THEN** colors SHALL match the defined wellness palette
- **AND** colors SHALL be consistent across all chart types

### Requirement: Achievement Badge Design
Achievement badges SHALL follow a consistent visual pattern.

Properties:
- Container: white background, 20px border-radius
- Icon container: 40px circle with gradient background
- Layout: left icon + right text (title + description)
- Emoji usage: encouraged for approachability

#### Scenario: Badge display
- **WHEN** displaying an achievement badge
- **THEN** the badge SHALL have a circular icon on the left
- **AND** title and description text on the right

