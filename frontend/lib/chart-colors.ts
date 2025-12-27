/**
 * Chart Colors Configuration
 * 
 * Unified color configuration for Recharts and other chart libraries.
 * Uses CSS variables from globals.css for automatic light/dark mode support.
 * 
 * Wellness Color Palette:
 * - chart-1: #7CB69D (成功绿) - Walking/Success
 * - chart-2: #9B7BB8 (强调紫) - Calories/Accent  
 * - chart-3: #C4B896 (米黄色) - Distance/Neutral
 * - chart-4: #E8A0A0 (淡粉色) - Heart Rate/Alert
 * - chart-5: #A8C5D9 (辅助蓝) - Auxiliary Data
 */

/**
 * CSS variable references for chart colors
 * Use with: fill={chartColors.success} or stroke={chartColors.calories}
 */
export const chartColors = {
  // Primary wellness colors
  success: "hsl(var(--chart-1))",    // 成功绿 - Walking, positive feedback
  calories: "hsl(var(--chart-2))",   // 强调紫 - Calories, emphasis
  distance: "hsl(var(--chart-3))",   // 米黄色 - Distance, neutral
  heartRate: "hsl(var(--chart-4))",  // 淡粉色 - Heart rate, alert
  auxiliary: "hsl(var(--chart-5))",  // 辅助蓝 - Auxiliary data

  // Semantic aliases
  walking: "hsl(var(--chart-1))",
  steps: "hsl(var(--chart-1))",
  exercise: "hsl(var(--chart-1))",
  weight: "hsl(var(--chart-2))",
  protein: "hsl(var(--chart-3))",
  carbs: "hsl(var(--chart-4))",
  fat: "hsl(var(--chart-5))",

  // UI colors
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))",
  
  // Morandi palette direct access
  morandiMint: "var(--morandi-mint)",
  morandiLavender: "var(--morandi-lavender)",
  morandiCream: "var(--morandi-cream)",
  morandiSuccess: "var(--morandi-success)",
  morandiAccent: "var(--morandi-accent)",
} as const

/**
 * Chart color array for multi-series charts
 * Use with: colors={chartColorArray} in chart configuration
 */
export const chartColorArray = [
  chartColors.success,
  chartColors.calories,
  chartColors.distance,
  chartColors.heartRate,
  chartColors.auxiliary,
] as const

/**
 * Tooltip style configuration for Recharts
 * Matches the design system's card styling
 */
export const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    fontSize: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  labelStyle: {
    color: "hsl(var(--foreground))",
    fontWeight: 600,
  },
  itemStyle: {
    color: "hsl(var(--muted-foreground))",
  },
} as const

/**
 * Grid style configuration for Recharts
 */
export const chartGridStyle = {
  stroke: "hsl(var(--border))",
  strokeDasharray: "3 3",
  strokeOpacity: 0.5,
} as const

/**
 * Axis style configuration for Recharts
 */
export const chartAxisStyle = {
  axisLine: false,
  tickLine: false,
  tick: {
    fontSize: 12,
    fill: "hsl(var(--muted-foreground))",
  },
} as const

/**
 * Health metric color mapping
 * Maps health data types to appropriate chart colors
 */
export const healthMetricColors = {
  calories: chartColors.calories,
  protein: chartColors.protein,
  carbs: chartColors.carbs,
  fat: chartColors.fat,
  weight: chartColors.weight,
  steps: chartColors.steps,
  walking: chartColors.walking,
  exercise: chartColors.exercise,
  heartRate: chartColors.heartRate,
  distance: chartColors.distance,
  sleep: chartColors.auxiliary,
  water: chartColors.auxiliary,
} as const

export type ChartColorKey = keyof typeof chartColors
export type HealthMetricKey = keyof typeof healthMetricColors

