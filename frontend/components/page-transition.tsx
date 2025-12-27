"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-4 duration-300", className)}>
      {children}
    </div>
  )
}