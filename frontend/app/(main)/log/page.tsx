"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientOnly } from "@/components/ui/client-only"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { PageTransition } from "@/components/page-transition"
import { useFoodLogs, useFoodParse, useAddFoodLog, useDeleteFoodLog } from "@/hooks/use-food-logs"
import { UtensilsCrossed, Trash2, Plus } from "lucide-react"
import type { FoodItem, MealType } from "@/types/api"

export default function LogPage() {
  const today = format(new Date(), "yyyy-MM-dd")
  const [input, setInput] = useState("")
  const [mealType, setMealType] = useState<MealType>("breakfast")
  const [parsedItems, setParsedItems] = useState<FoodItem[]>([])

  const { data: logs, isLoading } = useFoodLogs(today)
  const parseMutation = useFoodParse()
  const addMutation = useAddFoodLog()
  const deleteMutation = useDeleteFoodLog()

  const handleParse = async () => {
    if (!input.trim()) return
    const result = await parseMutation.mutateAsync({ text: input, meal_type: mealType })
    setParsedItems(result)
  }

  const handleAdd = () => {
    if (parsedItems.length > 0) {
      addMutation.mutate(
        { date: today, food_items: parsedItems },
        {
          onSuccess: () => {
            setInput("")
            setParsedItems([])
          },
        }
      )
    }
  }

  const totalCalories = logs?.reduce((sum, log) => sum + log.total_calories, 0) || 0
  const targetCalories = 2000 // TODO: 从用户 profile 获取
  const remainingCalories = targetCalories - totalCalories
  const caloriePercentage = Math.min((totalCalories / targetCalories) * 100, 100)

  return (
    <PageTransition className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">食物记录</h1>

      <Card>
        <CardHeader>
          <CardTitle>添加食物</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientOnly
            fallback={
              <div className="h-9 w-fit min-w-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                早餐
              </div>
            }
          >
            <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">早餐</SelectItem>
                <SelectItem value="lunch">午餐</SelectItem>
                <SelectItem value="dinner">晚餐</SelectItem>
                <SelectItem value="snack">零食</SelectItem>
              </SelectContent>
            </Select>
          </ClientOnly>
          <Textarea
            placeholder="输入食物,例如: 煎蛋2个,全麦面包2片,牛奶一杯"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
          />
          <Button onClick={handleParse} disabled={parseMutation.isPending || !input.trim()}>
            {parseMutation.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            解析食物
          </Button>

          {parsedItems.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              {parsedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>{item.name} {item.portion}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.calories_min}-{item.calories_max} kcal
                  </span>
                </div>
              ))}
              <Button onClick={handleAdd} className="w-full" disabled={addMutation.isPending}>
                {addMutation.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                添加到记录
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>今日摄入</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">{totalCalories} <span className="text-sm">/ {targetCalories} kcal</span></p>
              <p className={`text-sm ${remainingCalories < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {remainingCalories >= 0 ? `剩余 ${remainingCalories} kcal` : `超出 ${Math.abs(remainingCalories)} kcal`}
              </p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className={remainingCalories < 0 ? "text-destructive" : "text-primary"}
                  strokeDasharray={`${(caloriePercentage / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{Math.round(caloriePercentage)}%</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : logs && logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      {log.food_items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <Badge variant="outline" className="mr-2">
                            {item.meal_type === "breakfast" ? "早餐" : item.meal_type === "lunch" ? "午餐" : item.meal_type === "dinner" ? "晚餐" : "零食"}
                          </Badge>
                          {item.name} {item.portion}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{log.total_calories} kcal</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate({ id: log.id, date: today })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<UtensilsCrossed className="h-12 w-12" />}
              title="还没有记录"
              description="开始记录您的每日饮食吧"
            />
          )}
        </CardContent>
      </Card>
    </PageTransition>
  )
}