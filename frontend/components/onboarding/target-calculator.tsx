"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { GoalType, Gender } from "@/types/models"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface TargetCalculatorProps {
  profile: {
    age: number
    gender: Gender
    height: number
    weight: number
    goal: GoalType
  }
  onSubmit: (targetCalories: number) => void
  onBack: () => void
  isSubmitting?: boolean
}

export function TargetCalculator({
  profile,
  onSubmit,
  onBack,
  isSubmitting,
}: TargetCalculatorProps) {
  const targetCalories = useMemo(() => {
    // 使用 Mifflin-St Jeor 公式计算基础代谢率 (BMR)
    let bmr: number
    if (profile.gender === "male") {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
    }

    // 假设活动系数为 1.375 (轻度活动)
    const tdee = bmr * 1.375

    // 根据目标调整热量
    const adjustments = {
      cut: -500,      // 减脂: 减少500卡
      bulk: 300,      // 增肌: 增加300卡
      gain: 500,      // 增重: 增加500卡
      maintain: 0,    // 保持: 不调整
    }

    return Math.round(tdee + adjustments[profile.goal])
  }, [profile])

  const goalDescriptions = {
    cut: "创造热量缺口,促进脂肪燃烧",
    bulk: "提供额外热量,支持肌肉增长",
    gain: "增加热量摄入,健康增重",
    maintain: "维持能量平衡,保持体重",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">每日目标热量</p>
            <p className="text-4xl font-bold text-primary">
              {targetCalories}
              <span className="text-lg ml-1">kcal</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {goalDescriptions[profile.goal]}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">基础信息</span>
              <span>
                {profile.age}岁 · {profile.gender === "male" ? "男" : profile.gender === "female" ? "女" : "其他"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">身高体重</span>
              <span>
                {profile.height}cm · {profile.weight}kg
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">健康目标</span>
              <span>
                {profile.goal === "cut"
                  ? "减脂"
                  : profile.goal === "bulk"
                  ? "增肌"
                  : profile.goal === "gain"
                  ? "增重"
                  : "保持"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-medium mb-2">💡 温馨提示</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>此热量目标基于您的基础代谢和活动水平计算</li>
          <li>实际需求可能因个人体质和运动强度而异</li>
          <li>建议根据实际效果适当调整</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isSubmitting}
        >
          上一步
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={() => onSubmit(targetCalories)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              提交中...
            </>
          ) : (
            "完成设置"
          )}
        </Button>
      </div>
    </div>
  )
}
