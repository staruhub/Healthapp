"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  /** Progress value from 0 to 100 */
  value: number
  /** Size of the ring in pixels */
  size?: number
  /** Stroke width in pixels (10-14px recommended) */
  strokeWidth?: number
  /** Custom color for the progress fill (uses CSS variable by default) */
  color?: string
  /** Track color (semi-transparent by default) */
  trackColor?: string
  /** Show percentage text in center */
  showValue?: boolean
  /** Custom label to show instead of percentage */
  label?: string
  /** Additional class names */
  className?: string
  /** Children to render in the center */
  children?: React.ReactNode
}

/**
 * ProgressRing - SVG-based circular progress indicator
 * 
 * Features:
 * - SVG implementation with stroke-dasharray/stroke-dashoffset
 * - Starts at 12 o'clock position (-90°)
 * - Fills clockwise
 * - Round stroke caps (stroke-linecap: round)
 * - Smooth animation via CSS transition
 */
function ProgressRing({
  value,
  size = 120,
  strokeWidth = 12,
  color,
  trackColor = "rgba(255, 255, 255, 0.5)",
  showValue = false,
  label,
  className,
  children,
}: ProgressRingProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value))
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference
  
  // Center coordinates
  const center = size / 2

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track circle (background) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
        
        {/* Progress circle (fill) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color || "var(--morandi-accent)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-animate"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ? (
          children
        ) : showValue ? (
          <>
            <span className="text-3xl font-bold text-foreground">
              {Math.round(clampedValue)}%
            </span>
            {label && (
              <span className="text-sm text-muted-foreground mt-1">
                {label}
              </span>
            )}
          </>
        ) : label ? (
          <span className="text-sm text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export { ProgressRing }
export type { ProgressRingProps }

