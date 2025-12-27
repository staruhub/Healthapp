"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { GoalType } from "@/types/models"
import { TrendingDown, TrendingUp, Target, Minus } from "lucide-react"

const goals = [
  {
    value: "cut" as GoalType,
    label: "减脂",
    description: "降低体脂,塑造线条",
    icon: TrendingDown,
    color: "text-orange-500",
  },
  {
    value: "bulk" as GoalType,
    label: "增肌",
    description: "增加肌肉量,提升力量",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    value: "gain" as GoalType,
    label: "增重",
    description: "健康增重,改善体质",
    icon: Target,
    color: "text-green-500",
  },
  {
    value: "maintain" as GoalType,
    label: "保持",
    description: "维持当前体重和状态",
    icon: Minus,
    color: "text-gray-500",
  },
]

interface GoalSelectorProps {
  onSubmit: (goal: GoalType) => void
  onBack: () => void
  defaultValue?: GoalType
}

export function GoalSelector({ onSubmit, onBack, defaultValue }: GoalSelectorProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(defaultValue || null)

  const handleSubmit = () => {
    if (selectedGoal) {
      onSubmit(selectedGoal)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const Icon = goal.icon
          const isSelected = selectedGoal === goal.value
          return (
            <Card
              key={goal.value}
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                isSelected && "border-primary bg-primary/5"
              )}
              onClick={() => setSelectedGoal(goal.value)}
            >
              <CardContent className="flex items-start gap-4 p-6">
                <div className={cn("mt-1", goal.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{goal.label}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                {isSelected && (
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          上一步
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={handleSubmit}
          disabled={!selectedGoal}
        >
          下一步
        </Button>
      </div>
    </div>
  )
}
